// Lugha Worker: serves the website and answers /api/ai for every AI feature
// in the app (tutor, dictionary, flashcards, courses, email scoring,
// speaking partner, interface translation).
//
// The AI key lives only here, as a Worker secret. The browser never sees it.
//
// Secrets (set with `npx wrangler secret put NAME`):
//   AI_BASE_URL     OpenAI-compatible endpoint, e.g. https://api.groq.com/openai/v1
//   AI_API_KEY      your provider key
//   AI_MODEL        model for normal requests
//   AI_MODEL_QUICK  optional: faster model for quick requests (tutor chat, dictionary)
// Optional variable:
//   ALLOWED_ORIGINS comma-separated extra origins allowed to call /api/ai
//                   (the Worker's own address is always allowed)

const MAX_MESSAGES = 40;
const MAX_CHARS = 60_000;
const MAX_TOKENS_TEXT = 2048;
const MAX_TOKENS_JSON = 4096;
const PROVIDER_TIMEOUT_MS = 90_000;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function problem(status, code, error) {
  return json({ code, error }, status);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Checks the request body and returns clean messages, or a string explaining what's wrong.
export function readMessages(body) {
  const raw = body && body.messages;
  if (!Array.isArray(raw) || raw.length === 0) return "messages must be a non-empty list.";
  if (raw.length > MAX_MESSAGES) return `Send at most ${MAX_MESSAGES} messages.`;
  let chars = 0;
  const merged = [];
  for (const m of raw) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") {
      return "Each message needs role user or assistant and text content.";
    }
    chars += m.content.length;
    // Some providers reject two turns in a row from the same role, so join them.
    const last = merged[merged.length - 1];
    if (last && last.role === m.role) last.content += "\n\n" + m.content;
    else merged.push({ role: m.role, content: m.content });
  }
  if (chars > MAX_CHARS) return "That request is too long.";
  if (merged[merged.length - 1].role !== "user") return "The last message must come from the user.";
  return merged;
}

function systemPrompt(wantJson) {
  return (
    "You are the AI inside Lugha, a free language-learning app. " +
    "Follow the instructions in the user's message exactly." +
    (wantJson ? " Reply with valid JSON only: no code fences, no text before or after it." : "")
  );
}

async function callProvider(env, payload) {
  const base = String(env.AI_BASE_URL || "").replace(/\/+$/, "");
  const headers = { "Content-Type": "application/json" };
  if (env.AI_API_KEY) headers.Authorization = `Bearer ${env.AI_API_KEY}`;
  let last;
  // One retry for rate limits and provider hiccups, before anything is streamed.
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt > 0) await sleep(1200);
    try {
      const res = await fetch(`${base}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
      });
      if (res.status === 429 || res.status >= 500) {
        last = res;
        continue;
      }
      return res;
    } catch (err) {
      last = err;
    }
  }
  return last;
}

// Turns the provider's server-sent events into a plain text stream of the answer.
function pipeText(providerRes, ctx) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const pump = (async () => {
    const reader = providerRes.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nl;
        while ((nl = buffer.indexOf("\n")) >= 0) {
          const line = buffer.slice(0, nl).trim();
          buffer = buffer.slice(nl + 1);
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          let delta = "";
          try {
            delta = JSON.parse(data)?.choices?.[0]?.delta?.content || "";
          } catch {
            continue;
          }
          if (delta) await writer.write(encoder.encode(delta));
        }
      }
    } catch (err) {
      // The learner pressed Stop or the provider dropped: stop reading.
      try { await reader.cancel(); } catch {}
    } finally {
      try { await writer.close(); } catch {}
    }
  })();
  if (ctx && ctx.waitUntil) ctx.waitUntil(pump);
  return readable;
}

export async function handleAI(request, env, ctx) {
  if (request.method !== "POST") return problem(405, "method_not_allowed", "Use POST.");

  // Only pages on this site may use the endpoint from a browser.
  const self = new URL(request.url).origin;
  const allowed = [self, ...String(env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean)];
  const origin = request.headers.get("Origin");
  if (!origin || !allowed.includes(origin)) return problem(403, "forbidden", "Not allowed from this site.");

  if (env.AI_LIMITER) {
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const { success } = await env.AI_LIMITER.limit({ key: ip });
    if (!success) return problem(429, "rate_limited", "Too many requests. Please wait a minute.");
  }

  if (!env.AI_BASE_URL || !env.AI_MODEL) {
    return problem(503, "sampling_disabled", "The AI isn't switched on yet.");
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return problem(400, "bad_request", "Send the request as JSON.");
  }
  const messages = readMessages(body);
  if (typeof messages === "string") return problem(400, "bad_request", messages);

  const wantJson = body.json === true;
  const stream = body.stream === true && !wantJson;
  const quick = body.tier === "quick";
  const model = (quick && env.AI_MODEL_QUICK) || env.AI_MODEL;

  const res = await callProvider(env, {
    model,
    messages: [{ role: "system", content: systemPrompt(wantJson) }, ...messages],
    temperature: wantJson ? 0.4 : 0.8,
    max_tokens: wantJson ? MAX_TOKENS_JSON : MAX_TOKENS_TEXT,
    stream,
  });

  if (!(res instanceof Response)) {
    console.error("AI provider unreachable:", res && res.message);
    return problem(502, "server_error", "The AI service didn't respond. Please try again.");
  }
  if (res.status === 429) return problem(429, "rate_limited", "The AI is busy right now. Please try again in a few minutes.");
  if (!res.ok) {
    console.error("AI provider error", res.status, (await res.text()).slice(0, 500));
    return problem(502, "server_error", "The AI service had a problem. Please try again.");
  }

  if (stream) {
    return new Response(pipeText(res, ctx), {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  const data = await res.json().catch(() => null);
  const choice = data && data.choices && data.choices[0];
  const text = choice && choice.message && typeof choice.message.content === "string" ? choice.message.content : "";
  if (!text.trim()) return problem(502, "server_error", "The AI sent an empty answer. Please try again.");
  return json({ text, truncated: choice.finish_reason === "length" });
}

// Browser protection rules for every page. No Content-Security-Policy yet: the app relies on
// inline scripts, YouTube, Firebase and font hosts, and a strict policy would need testing first.
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  // Speaking practice uses the microphone; nothing else needs device access.
  "Permissions-Policy": "camera=(), geolocation=(), microphone=(self)",
};

function withSecurityHeaders(res) {
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) out.headers.set(k, v);
  return out;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/ai") return withSecurityHeaders(await handleAI(request, env, ctx));
    if (env.ASSETS) return withSecurityHeaders(await env.ASSETS.fetch(request));
    return new Response("Not found", { status: 404 });
  },
};

# Lugha

A free language-learning app for people who can't pay for a course. Live at https://learnwithlughaa.korevatools.workers.dev

## What's here

- `public/` is the website and the app (`public/app/`), exactly as deployed.
- `worker/` serves `public/` and answers `/api/ai`, which powers every AI feature on the website: the tutor, planning trainer, email scoring, dictionary, flashcard generator, AI-made courses and interface translation. The AI key is a Worker secret and never reaches the browser.
- `firestore.rules` holds the rules that keep each learner's saved progress private.
- `test/` runs the app's real AI code through the Worker against a fake provider. It needs no keys and no internet.

## Run and deploy

You need Node.js 20 or newer.

```
npx wrangler dev        # local copy at http://localhost:8787
npx wrangler deploy     # publish to learnwithlughaa.korevatools.workers.dev
node test/e2e.test.mjs  # check the AI path
```

## Switch on AI (once)

Use any OpenAI-compatible provider that's reachable from the internet. Base URLs:

- Groq: `https://api.groq.com/openai/v1`
- Cerebras: `https://api.cerebras.ai/v1`
- Google AI Studio: `https://generativelanguage.googleapis.com/v1beta/openai`

```
npx wrangler secret put AI_BASE_URL
npx wrangler secret put AI_API_KEY
npx wrangler secret put AI_MODEL
npx wrangler secret put AI_MODEL_QUICK   # optional: faster model for chat and dictionary
```

Each visitor can make 20 AI requests a minute. If wrangler rejects the `ratelimits` block in `wrangler.jsonc`, delete it; the Worker still runs, just without that limit.

## Firebase

The Firebase settings in `public/app/index.html` are meant to be public. What protects learners' progress is the Firestore rules: check in the Firebase console that they match `firestore.rules`.

## Limits

Everyone shares one AI key, so the provider's free daily quota is the ceiling for all learners combined. When it runs out, AI features say "Too many requests" until the quota resets. Lessons, flashcards and dictation keep working.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, Card, PageHeader } from "@lugha/ui";
import { fetchJson } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@lugha.com");
  const [password, setPassword] = useState("lugha123");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await fetchJson<{ token: string; user: { name: string; email: string; language: string; level: string; streak: number; weeklyGoal: string } }>(
        "/api/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }
      );

      localStorage.setItem("lugha_session", JSON.stringify(result));
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-shell narrow-shell">
      <PageHeader
        eyebrow="Welcome back"
        title="Log in to Lugha"
        subtitle="Continue building your fluency with guided sessions and personalized progress."
      />

      <Card title="Account access" description="Use your email and password to continue.">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="demo@lugha.com" />
          </label>
          <label>
            <span>Password</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
          </label>
          <div className="inline-row">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#">Forgot password?</a>
          </div>
          {error ? <div className="error-box">{error}</div> : null}
          <Button full type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>
          <div className="divider"><span>or</span></div>
          <Button variant="ghost" full type="button">Continue with Google</Button>
        </form>
      </Card>
    </main>
  );
}

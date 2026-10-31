import { Badge, Button, Card, PageHeader } from "@lugha/ui";

export default function LoginPage() {
  return (
    <main className="page-shell narrow-shell">
      <PageHeader
        eyebrow="Welcome back"
        title="Log in to Lugha"
        subtitle="Continue building your fluency with guided sessions and personalized progress."
      />

      <Card title="Account access" description="Use your email and password to continue.">
        <form className="form-grid">
          <label>
            <span>Email</span>
            <input type="email" placeholder="you@example.com" />
          </label>
          <label>
            <span>Password</span>
            <input type="password" placeholder="••••••••" />
          </label>
          <div className="inline-row">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#">Forgot password?</a>
          </div>
          <Button full>Log in</Button>
          <div className="divider"><span>or</span></div>
          <Button variant="ghost" full>Continue with Google</Button>
        </form>
      </Card>
    </main>
  );
}

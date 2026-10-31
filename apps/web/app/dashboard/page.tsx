import { Badge, Button, Card, StatCard } from "@lugha/ui";

const stats = [
  { label: "Active learners", value: "18k+" },
  { label: "Avg. streak", value: "14 days" },
  { label: "Lesson completion", value: "92%" },
];

const features = [
  { title: "AI-guided practice", description: "Get concise exercises tailored to how you learn and where you get stuck." },
  { title: "Vocabulary that sticks", description: "Learn by theme, context, and repetition with practical everyday language." },
  { title: "Progress you can see", description: "Track streaks, milestones, and confidence so learning stays motivating." },
];

const lessonCards = [
  { title: "Starter phrases", subtitle: "Beginner", accent: "#7dd3fc" },
  { title: "Travel essentials", subtitle: "Everyday", accent: "#34d399" },
  { title: "Workplace basics", subtitle: "Professional", accent: "#fbbf24" },
];

export default function HomePage() {
  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">L</div>
          <span className="brand-name">Lugha</span>
        </div>

        <nav className="nav" aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#curriculum">Curriculum</a>
          <a href="#pricing">Pricing</a>
        </nav>

        <div className="nav-actions">
          <Button variant="ghost">Log in</Button>
          <Button>Start learning</Button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <Badge>New learner experience</Badge>
          <h1>Speak with confidence in the languages you love.</h1>
          <p>
            Lugha helps you build real-world fluency through guided lessons, daily momentum,
            and smart vocabulary practice designed for modern learners.
          </p>
          <div className="cta-row">
            <Button>Try free today</Button>
            <Button variant="ghost">View curriculum</Button>
          </div>
          <div className="mini-metrics">
            {stats.map((stat) => (
              <StatCard key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="dashboard-panel">
            <div className="panel-header">
              <span>Daily progress</span>
              <Badge variant="success">+18%</Badge>
            </div>
            <div className="progress-ring">
              <div className="ring-inner">84%</div>
            </div>
            <ul className="lesson-list">
              <li><span>Spanish</span><strong>4/5</strong></li>
              <li><span>Conversation</span><strong>6/8</strong></li>
              <li><span>Listening</span><strong>7/10</strong></li>
            </ul>
          </div>
        </div>
      </section>

      <section id="features" className="section-block">
        <div className="section-heading">
          <Badge>Why learners choose Lugha</Badge>
          <h2>Built around momentum, not memorization.</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <Card key={feature.title} title={feature.title} description={feature.description} />
          ))}
        </div>
      </section>

      <section id="curriculum" className="section-block">
        <div className="section-heading narrow">
          <Badge>Popular tracks</Badge>
          <h2>Start where you are and grow faster.</h2>
        </div>
        <div className="lesson-grid">
          {lessonCards.map((entry) => (
            <article key={entry.title} className="lesson-card" style={{ borderTop: `4px solid ${entry.accent}` }}>
              <span className="lesson-level">{entry.subtitle}</span>
              <h3>{entry.title}</h3>
              <p>Practice natural phrases and essential speaking patterns with a guided path.</p>
              <Button variant="ghost">Open lesson</Button>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="section-block cta-banner">
        <div>
          <Badge>Ready to begin?</Badge>
          <h2>Learn a language with structure, support, and momentum.</h2>
        </div>
        <Button>Get started</Button>
      </section>
    </main>
  );
}

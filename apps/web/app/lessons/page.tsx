import { Badge, Button, Card, StatCard } from "@lugha/ui";

const todayPlan = [
  { title: "Vocabulary sprint", detail: "12 words • 15 min", progress: "75%" },
  { title: "Listening practice", detail: "Travel phrases • 10 min", progress: "60%" },
  { title: "Speaking drill", detail: "Pronunciation • 12 min", progress: "88%" },
];

const topics = [
  { name: "Greetings", level: "Beginner", mastery: "88%" },
  { name: "Ordering food", level: "Intermediate", mastery: "74%" },
  { name: "Daily routines", level: "Beginner", mastery: "91%" },
];

export default function DashboardPage() {
  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand-wrap">
          <div className="brand-mark">L</div>
          <span className="brand-name">Lugha</span>
        </div>

        <nav className="side-nav" aria-label="Dashboard navigation">
          <a className="active" href="/dashboard">Overview</a>
          <a href="/lessons">Lessons</a>
          <a href="/profile">Profile</a>
          <a href="/login">Login</a>
        </nav>

        <div className="profile-card">
          <strong>Amara</strong>
          <span>Spanish • Beginner</span>
        </div>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <Badge>Good morning</Badge>
            <h1>Welcome back, Amara</h1>
          </div>
          <Button>Continue lesson</Button>
        </header>

        <div className="stats-row">
          <StatCard label="Current streak" value="12 days" />
          <StatCard label="XP earned" value="1,540" />
          <StatCard label="Lessons done" value="34" />
          <StatCard label="Mastery" value="81%" />
        </div>

        <div className="content-grid">
          <div className="stacked-column">
            <Card title="Today’s plan" description="A focused set of activities to keep your learning momentum moving.">
              <div className="plan-list">
                {todayPlan.map((item) => (
                  <div key={item.title} className="plan-item">
                    <div>
                      <strong>{item.title}</strong>
                      <small>{item.detail}</small>
                    </div>
                    <span>{item.progress}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="stacked-column">
            <Card title="Topic mastery" description="You are improving steadily across your active learning topics.">
              <div className="topic-list">
                {topics.map((topic) => (
                  <div key={topic.name} className="topic-row">
                    <div>
                      <strong>{topic.name}</strong>
                      <small>{topic.level}</small>
                    </div>
                    <span>{topic.mastery}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

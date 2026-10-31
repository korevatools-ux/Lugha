"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Card, StatCard } from "@lugha/ui";
import { fetchJson } from "@/lib/api";

type DashboardResponse = {
  profile: {
    name: string;
    language: string;
    level: string;
    streak: number;
    weeklyGoal: string;
  };
  progress: {
    streak: number;
    lessonsCompleted: number;
    xpEarned: number;
    mastery: number;
    nextMilestone: string;
  };
  lessons: Array<{
    id: string;
    title: string;
    level: string;
    duration: number;
    description: string;
  }>;
  todayPlan: Array<{
    title: string;
    detail: string;
    progress: string;
  }>;
};

const topicMastery = [
  { name: "Greetings", level: "Beginner", mastery: "88%" },
  { name: "Ordering food", level: "Intermediate", mastery: "74%" },
  { name: "Daily routines", level: "Beginner", mastery: "91%" },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJson<DashboardResponse>("/api/dashboard")
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load dashboard"));
  }, []);

  if (!data) {
    return <main className="page-shell"><div className="loading-state">Loading your dashboard...</div></main>;
  }

  const firstName = data.profile.name.split(" ")[0];

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
          <strong>{firstName}</strong>
          <span>{data.profile.language} • {data.profile.level}</span>
        </div>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <Badge>Good morning</Badge>
            <h1>Welcome back, {firstName}</h1>
          </div>
          <Button>Continue lesson</Button>
        </header>

        {error ? <div className="error-box">{error}</div> : null}

        <div className="stats-row">
          <StatCard label="Current streak" value={`${data.progress.streak} days`} />
          <StatCard label="XP earned" value={String(data.progress.xpEarned)} />
          <StatCard label="Lessons done" value={String(data.progress.lessonsCompleted)} />
          <StatCard label="Mastery" value={`${data.progress.mastery}%`} />
        </div>

        <div className="content-grid">
          <div className="stacked-column">
            <Card title="Today’s plan" description="A focused set of activities to keep your learning momentum moving.">
              <div className="plan-list">
                {data.todayPlan.map((item) => (
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
                {topicMastery.map((topic) => (
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

"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Card, PageHeader, StatCard } from "@lugha/ui";
import { fetchJson } from "@/lib/api";

type ProfileResponse = {
  profile: {
    name: string;
    language: string;
    level: string;
    streak: number;
    weeklyGoal: string;
  };
};

const skills = [
  { name: "Speaking", level: "Advanced", value: "89%" },
  { name: "Listening", level: "Strong", value: "83%" },
  { name: "Vocabulary", level: "Good", value: "91%" },
  { name: "Grammar", level: "Steady", value: "76%" },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileResponse["profile"] | null>(null);

  useEffect(() => {
    fetchJson<ProfileResponse>("/api/profile")
      .then((data) => setProfile(data.profile))
      .catch(() => setProfile({
        name: "Amara Parker",
        language: "Spanish",
        level: "Intermediate",
        streak: 12,
        weeklyGoal: "4/5 sessions",
      }));
  }, []);

  if (!profile) {
    return <main className="page-shell"><div className="loading-state">Loading profile...</div></main>;
  }

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Your profile"
        title={profile.name}
        subtitle={`${profile.language} learner • ${profile.level} track • ${profile.streak}-day streak`}
        actions={<Button>Update goals</Button>}
      />

      <div className="stats-row">
        <StatCard label="Current streak" value={`${profile.streak} days`} />
        <StatCard label="XP earned" value="1,540" />
        <StatCard label="Lessons done" value="34" />
        <StatCard label="Weekly goal" value={profile.weeklyGoal} />
      </div>

      <div className="content-grid">
        <Card title="Skill focus" description="Your strongest growth is happening in daily speaking and listening practice.">
          <div className="list-stack">
            {skills.map((skill) => (
              <div key={skill.name} className="topic-row">
                <div>
                  <strong>{skill.name}</strong>
                  <small>{skill.level}</small>
                </div>
                <Badge variant="success">{skill.value}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Goals" description="Keep momentum by finishing the next milestone in your weekly plan.">
          <div className="goal-list">
            <div className="goal-item"><span>Complete 2 speaking sessions</span><strong>On track</strong></div>
            <div className="goal-item"><span>Review 25 new words</span><strong>Due today</strong></div>
            <div className="goal-item"><span>Finish travel unit</span><strong>3 days left</strong></div>
          </div>
        </Card>
      </div>
    </main>
  );
}

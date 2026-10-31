import { Badge, Button, Card, PageHeader, StatCard } from "@lugha/ui";

const skills = [
  { name: "Speaking", level: "Advanced", value: "89%" },
  { name: "Listening", level: "Strong", value: "83%" },
  { name: "Vocabulary", level: "Good", value: "91%" },
  { name: "Grammar", level: "Steady", value: "76%" },
];

export default function ProfilePage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Your profile"
        title="Amara Parker"
        subtitle="Spanish learner • Intermediate track • 12-day streak"
        actions={<Button>Update goals</Button>}
      />

      <div className="stats-row">
        <StatCard label="Current streak" value="12 days" />
        <StatCard label="XP earned" value="1,540" />
        <StatCard label="Lessons done" value="34" />
        <StatCard label="Weekly goal" value="4/5" />
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

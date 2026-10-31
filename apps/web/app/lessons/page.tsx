import { Badge, Button, Card } from "@lugha/ui";

export default function LessonsPage() {
  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <Badge>Learning library</Badge>
          <h1>Your lessons</h1>
        </div>
        <Button>Continue path</Button>
      </header>

      <div className="stack-grid">
        <Card title="Starter phrases" description="Build confidence with practical greetings, introductions, and everyday phrases.">
          <div className="meta-row">
            <Badge variant="neutral">Beginner</Badge>
            <span className="meta-pill">15 min</span>
          </div>
          <div className="spacer" />
          <Button variant="soft">Open lesson</Button>
        </Card>

        <Card title="Travel essentials" description="Learn useful phrases for airports, hotels, transportation, and restaurants.">
          <div className="meta-row">
            <Badge variant="neutral">Everyday</Badge>
            <span className="meta-pill">18 min</span>
          </div>
          <div className="spacer" />
          <Button variant="soft">Open lesson</Button>
        </Card>
      </div>
    </main>
  );
}

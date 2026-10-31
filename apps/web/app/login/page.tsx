import { Badge, Button, Card, PageHeader } from "@lugha/ui";

const lessons = [
  {
    title: "Starter phrases",
    level: "Beginner",
    duration: "15 min",
    description: "Build confidence with practical greetings, introductions, and everyday phrases.",
    accent: "#7dd3fc",
  },
  {
    title: "Travel essentials",
    level: "Everyday",
    duration: "18 min",
    description: "Learn useful phrases for airports, hotels, transportation, and restaurants.",
    accent: "#34d399",
  },
  {
    title: "Workplace basics",
    level: "Professional",
    duration: "22 min",
    description: "Practice speaking in meetings, presentations, and small talk at work.",
    accent: "#fbbf24",
  },
  {
    title: "Conversation flow",
    level: "Intermediate",
    duration: "25 min",
    description: "Move from words to natural, clear communication with everyday dialogue.",
    accent: "#a78bfa",
  },
];

export default function LessonsPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Learning library"
        title="Your lessons"
        subtitle="Choose a track that matches your pace and goals. Each lesson is built to turn everyday language into confident speaking habits."
        actions={<Button>Continue path</Button>}
      />

      <div className="stack-grid">
        {lessons.map((lesson) => (
          <Card key={lesson.title} title={lesson.title} description={lesson.description}>
            <div className="meta-row">
              <Badge variant="neutral">{lesson.level}</Badge>
              <span className="meta-pill">{lesson.duration}</span>
            </div>
            <div className="spacer" />
            <Button variant="soft">Open lesson</Button>
          </Card>
        ))}
      </div>
    </main>
  );
}

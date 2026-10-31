import { Badge, Button, Card, PageHeader } from "@lugha/ui";
import { lessonCatalog } from "@/lib/content";

const spotlight = lessonCatalog[0];

export default function LessonsPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Learning library"
        title="Your lessons"
        subtitle="Choose a track that matches your pace and goals. Each lesson is built to turn everyday language into confident speaking habits."
        actions={<Button>Continue path</Button>}
      />

      <section className="spotlight-card">
        <div>
          <Badge variant="success">Featured lesson</Badge>
          <h2>{spotlight.title}</h2>
          <p>{spotlight.description}</p>
        </div>
        <Button>Start now</Button>
      </section>

      <div className="stack-grid">
        {lessonCatalog.map((lesson) => (
          <Card key={lesson.slug} title={lesson.title} description={lesson.description}>
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

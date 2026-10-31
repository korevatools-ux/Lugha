import { Badge, Button, Card, PageHeader } from "@lugha/ui";
import { getLessonBySlug, lessonCatalog } from "@/lib/content";

export default function LessonDetailPage({ params }: { params: { slug: string } }) {
  const lesson = getLessonBySlug(params.slug);

  return (
    <main className="page-shell narrow-shell">
      <PageHeader
        eyebrow={lesson.category}
        title={lesson.title}
        subtitle={lesson.description}
        actions={<Button>Start lesson</Button>}
      />

      <div className="detail-layout">
        <Card title="What you'll practice" description="A focused learning path designed to build confidence and fluency.">
          <ul className="check-list">
            {lesson.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </Card>

        <Card title="Recommended next steps" description="Follow this structured path to keep improving across sessions.">
          <div className="goal-list">
            <div className="goal-item"><span>Warm up</span><strong>3 min</strong></div>
            <div className="goal-item"><span>Core practice</span><strong>8 min</strong></div>
            <div className="goal-item"><span>Review</span><strong>4 min</strong></div>
          </div>
        </Card>
      </div>

      <section className="section-block compact-block">
        <div className="section-heading narrow">
          <Badge>Continue exploring</Badge>
          <h2>More lessons</h2>
        </div>
        <div className="lesson-grid">
          {lessonCatalog.filter((item) => item.slug !== lesson.slug).slice(0, 2).map((entry) => (
            <article key={entry.slug} className="lesson-card" style={{ borderTop: `4px solid ${entry.accent}` }}>
              <span className="lesson-level">{entry.level}</span>
              <h3>{entry.title}</h3>
              <p>{entry.description}</p>
              <Button variant="ghost">Open lesson</Button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

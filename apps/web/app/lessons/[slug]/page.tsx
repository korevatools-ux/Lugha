"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Card, PageHeader } from "@lugha/ui";
import { fetchJson } from "@/lib/api";

type Lesson = {
  id: string;
  title: string;
  level: string;
  duration: number;
  description: string;
  category: string;
};

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    fetchJson<{ lessons: Lesson[] }>("/api/lessons")
      .then((data) => setLessons(data.lessons))
      .catch(() => setLessons([
        {
          id: "starter-phrases",
          title: "Starter phrases",
          level: "Beginner",
          duration: 15,
          description: "Build confidence with practical greetings, introductions, and everyday phrases.",
          category: "Foundations",
        },
      ]));
  }, []);

  const spotlight = lessons[0] ?? {
    id: "starter-phrases",
    title: "Starter phrases",
    level: "Beginner",
    duration: 15,
    description: "Build confidence with practical greetings, introductions, and everyday phrases.",
    category: "Foundations",
  };

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
        {lessons.map((lesson) => (
          <Card key={lesson.id} title={lesson.title} description={lesson.description}>
            <div className="meta-row">
              <Badge variant="neutral">{lesson.level}</Badge>
              <span className="meta-pill">{lesson.duration} min</span>
            </div>
            <div className="spacer" />
            <Button variant="soft">Open lesson</Button>
          </Card>
        ))}
      </div>
    </main>
  );
}

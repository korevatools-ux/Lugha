import { Card } from "@lugha/ui";

const features = [
  { title: "Modern frontend", description: "Build a polished experience with Next.js." },
  { title: "Real API", description: "Use the Express backend for business logic." },
  { title: "Shared components", description: "Keep reusable UI in a single package." },
];

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", padding: "4rem 2rem", background: "#07111e" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "grid", gap: "1rem", marginBottom: "2.5rem" }}>
          <span style={{ color: "#7dd3fc", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Lugha
          </span>
          <h1 style={{ fontSize: "3rem", lineHeight: 1.1, color: "#f8fafc", margin: 0 }}>
            Product-ready monorepo starter
          </h1>
          <p style={{ maxWidth: "640px", fontSize: "1.05rem", color: "#cbd5e1", margin: 0 }}>
            A clean foundation for building a multi-service product with a frontend, API, and shared design layer.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          {features.map((feature) => (
            <Card key={feature.title} title={feature.title} description={feature.description} />
          ))}
        </div>
      </div>
    </main>
  );
}

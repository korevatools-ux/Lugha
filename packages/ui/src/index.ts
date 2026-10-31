export function Card({ title, description }: { title: string; description: string }) {
  return (
    <article
      style={{
        background: "#0f172a",
        border: "1px solid rgba(148, 163, 184, 0.35)",
        borderRadius: "18px",
        padding: "1.25rem",
        boxShadow: "0 18px 40px rgba(15, 23, 42, 0.35)",
      }}
    >
      <h2 style={{ margin: "0 0 0.5rem", color: "#f8fafc", fontSize: "1.2rem" }}>{title}</h2>
      <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.7 }}>{description}</p>
    </article>
  );
}

export default { Card };

import type { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "neutral";
type ButtonVariant = "primary" | "ghost" | "soft";

export function Badge({ children, variant = "default" }: { children: ReactNode; variant?: BadgeVariant }) {
  const palette = {
    default: { background: "rgba(125, 211, 252, 0.1)", color: "#7dd3fc", border: "1px solid rgba(125, 211, 252, 0.2)" },
    success: { background: "rgba(52, 211, 153, 0.12)", color: "#bbf7d0", border: "1px solid rgba(52, 211, 153, 0.2)" },
    neutral: { background: "rgba(148, 163, 184, 0.1)", color: "#cbd5e1", border: "1px solid rgba(148, 163, 184, 0.18)" },
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "999px",
        padding: "0.45rem 0.8rem",
        fontSize: "0.7rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontWeight: 700,
        ...palette[variant],
      }}
    >
      {children}
    </span>
  );
}

export function Button({ children, variant = "primary", full = false }: { children: ReactNode; variant?: ButtonVariant; full?: boolean }) {
  const palette = {
    primary: {
      background: "linear-gradient(135deg, #7dd3fc 0%, #a78bfa 100%)",
      color: "#020617",
      border: "none",
      boxShadow: "0 12px 24px rgba(125, 211, 252, 0.2)",
    },
    ghost: {
      background: "rgba(148, 163, 184, 0.08)",
      color: "#f8fafc",
      border: "1px solid rgba(148, 163, 184, 0.2)",
    },
    soft: {
      background: "rgba(52, 211, 153, 0.1)",
      color: "#d1fae5",
      border: "1px solid rgba(52, 211, 153, 0.2)",
    },
  };

  return (
    <button
      style={{
        ...palette[variant],
        borderRadius: "12px",
        padding: "0.8rem 1.15rem",
        fontWeight: 700,
        width: full ? "100%" : "auto",
        transition: "transform 0.2s ease, opacity 0.2s ease",
      }}
    >
      {children}
    </button>
  );
}

export function Card({ title, description, children, tone = "default" }: { title?: string; description?: string; children?: ReactNode; tone?: "default" | "alt" }) {
  const style = tone === "alt"
    ? { background: "rgba(12, 18, 30, 0.92)", border: "1px solid rgba(148, 163, 184, 0.2)" }
    : { background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(148, 163, 184, 0.22)" };

  return (
    <article
      style={{
        ...style,
        borderRadius: "22px",
        padding: "1.25rem",
        boxShadow: "0 18px 38px rgba(15, 23, 42, 0.2)",
      }}
    >
      {title && <h3 style={{ margin: "0 0 0.6rem", fontSize: "1.25rem", color: "#f8fafc" }}>{title}</h3>}
      {description && <p style={{ margin: "0 0 0.9rem", color: "#cbd5e1", lineHeight: 1.7 }}>{description}</p>}
      {children}
    </article>
  );
}

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: "rgba(15, 23, 42, 0.78)",
      border: "1px solid rgba(148, 163, 184, 0.2)",
      borderRadius: "18px",
      padding: "1rem",
      minWidth: "120px",
    }}>
      <div style={{ color: "#94a3b8", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
      <div style={{ marginTop: "0.5rem", fontSize: "1.5rem", fontWeight: 700, color: "#f8fafc" }}>{value}</div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, subtitle, actions }: { eyebrow?: string; title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
      <div>
        {eyebrow && <div style={{ marginBottom: "0.5rem" }}><Badge variant="neutral">{eyebrow}</Badge></div>}
        <h1 style={{ margin: 0, fontSize: "clamp(2rem, 4vw, 3rem)" }}>{title}</h1>
        {subtitle && <p style={{ margin: "0.75rem 0 0", color: "#cbd5e1", maxWidth: "700px", lineHeight: 1.7 }}>{subtitle}</p>}
      </div>
      {actions}
    </header>
  );
}

export default { Badge, Button, Card, StatCard, PageHeader };

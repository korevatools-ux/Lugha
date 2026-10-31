export const marketingStats = [
  { label: "Active learners", value: "18k+" },
  { label: "Avg. streak", value: "14 days" },
  { label: "Lesson completion", value: "92%" },
];

export const learningFeatures = [
  {
    title: "AI-guided practice",
    description: "Get concise exercises tailored to how you learn and where you get stuck.",
  },
  {
    title: "Vocabulary that sticks",
    description: "Learn by theme, context, and repetition with practical everyday language.",
  },
  {
    title: "Progress you can see",
    description: "Track streaks, milestones, and confidence so learning stays motivating.",
  },
];

export const lessonCatalog = [
  {
    slug: "starter-phrases",
    title: "Starter phrases",
    level: "Beginner",
    duration: "15 min",
    description: "Build confidence with practical greetings, introductions, and everyday phrases.",
    accent: "#7dd3fc",
    category: "Foundations",
    outcomes: ["Introduce yourself naturally", "Ask basic questions", "Use common daily phrases"],
  },
  {
    slug: "travel-essentials",
    title: "Travel essentials",
    level: "Everyday",
    duration: "18 min",
    description: "Learn useful phrases for airports, hotels, transportation, and restaurants.",
    accent: "#34d399",
    category: "Travel",
    outcomes: ["Navigate public transport", "Order food confidently", "Ask for help quickly"],
  },
  {
    slug: "workplace-basics",
    title: "Workplace basics",
    level: "Professional",
    duration: "22 min",
    description: "Practice speaking in meetings, presentations, and small talk at work.",
    accent: "#fbbf24",
    category: "Career",
    outcomes: ["Introduce your role", "Handle small talk", "Speak in meetings"],
  },
  {
    slug: "conversation-flow",
    title: "Conversation flow",
    level: "Intermediate",
    duration: "25 min",
    description: "Move from words to natural, clear communication with everyday dialogue.",
    accent: "#a78bfa",
    category: "Fluency",
    outcomes: ["Build longer responses", "Stay fluent under pressure", "Keep conversations moving"],
  },
];

export const profileSummary = {
  name: "Amara Parker",
  language: "Spanish",
  level: "Intermediate",
  streak: 12,
  weeklyGoal: "4/5 sessions",
};

export const dashboardStats = [
  { label: "Current streak", value: "12 days" },
  { label: "XP earned", value: "1,540" },
  { label: "Lessons done", value: "34" },
  { label: "Mastery", value: "81%" },
];

export const beginnerSkills = [
  { name: "Speaking", level: "Advanced", value: "89%" },
  { name: "Listening", level: "Strong", value: "83%" },
  { name: "Vocabulary", level: "Good", value: "91%" },
  { name: "Grammar", level: "Steady", value: "76%" },
];

export const todayPlan = [
  { title: "Vocabulary sprint", detail: "12 words • 15 min", progress: "75%" },
  { title: "Listening practice", detail: "Travel phrases • 10 min", progress: "60%" },
  { title: "Speaking drill", detail: "Pronunciation • 12 min", progress: "88%" },
];

export function getLessonBySlug(slug: string) {
  return lessonCatalog.find((lesson) => lesson.slug === slug) ?? lessonCatalog[0];
}

import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";

dotenv.config();

const app = express();
const port = Number(process.env.API_PORT || 4000);

const demoUser = {
  id: "user_amaraparker",
  name: "Amara Parker",
  email: "demo@lugha.com",
  language: "Spanish",
  level: "Intermediate",
  streak: 12,
  weeklyGoal: "4/5 sessions",
};

const lessons = [
  {
    id: "starter-phrases",
    title: "Starter phrases",
    level: "Beginner",
    duration: 15,
    description: "Everyday phrases for travel and introductions.",
    category: "Foundations",
    outcomes: ["Introduce yourself naturally", "Ask basic questions", "Use common daily phrases"],
  },
  {
    id: "travel-essentials",
    title: "Travel essentials",
    level: "Everyday",
    duration: 18,
    description: "Navigate airports, hotels, and restaurants with confidence.",
    category: "Travel",
    outcomes: ["Navigate public transport", "Order food confidently", "Ask for help quickly"],
  },
  {
    id: "workplace-basics",
    title: "Workplace basics",
    level: "Professional",
    duration: 22,
    description: "Practice professional conversation and small talk.",
    category: "Career",
    outcomes: ["Introduce your role", "Handle small talk", "Speak in meetings"],
  },
  {
    id: "conversation-flow",
    title: "Conversation flow",
    level: "Intermediate",
    duration: 25,
    description: "Move from words to natural, clear communication with dialogue.",
    category: "Fluency",
    outcomes: ["Build longer responses", "Stay fluent under pressure", "Keep conversations moving"],
  },
];

const vocabulary = [
  { word: "Hola", translation: "Hello", category: "Greeting" },
  { word: "Gracias", translation: "Thank you", category: "Politeness" },
  { word: "Comida", translation: "Food", category: "Everyday" },
  { word: "Viaje", translation: "Trip", category: "Travel" },
  { word: "Trabajo", translation: "Work", category: "Career" },
  { word: "Reunión", translation: "Meeting", category: "Work" },
];

const progress = {
  streak: 12,
  lessonsCompleted: 34,
  xpEarned: 1540,
  mastery: 81,
  nextMilestone: "Complete 2 more sessions this week",
};

const todayPlan = [
  { title: "Vocabulary sprint", detail: "12 words • 15 min", progress: "75%" },
  { title: "Listening practice", detail: "Travel phrases • 10 min", progress: "60%" },
  { title: "Speaking drill", detail: "Pronunciation • 12 min", progress: "88%" },
];

app.use(cors());
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "lugha-api" });
});

app.get("/api/hello", (_req: Request, res: Response) => {
  res.json({
    message: "Welcome to Lugha API",
    status: "ready",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/lessons", (_req: Request, res: Response) => {
  res.json({ lessons });
});

app.get("/api/vocabulary", (_req: Request, res: Response) => {
  res.json({ vocabulary });
});

app.get("/api/progress", (_req: Request, res: Response) => {
  res.json({ progress });
});

app.get("/api/profile", (_req: Request, res: Response) => {
  res.json({ profile: demoUser });
});

app.get("/api/dashboard", (_req: Request, res: Response) => {
  res.json({
    profile: demoUser,
    progress,
    lessons,
    todayPlan,
  });
});

app.post("/api/auth/login", (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  if (email === "demo@lugha.com" && password === "lugha123") {
    return res.json({
      token: "demo-token",
      user: demoUser,
      message: "Login successful",
    });
  }

  return res.status(401).json({
    message: "Invalid email or password",
  });
});

app.get("/api/overview", (_req: Request, res: Response) => {
  res.json({ lessons, vocabulary, progress, profile: demoUser, todayPlan });
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});

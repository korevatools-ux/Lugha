import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";

dotenv.config();

const app = express();
const port = Number(process.env.API_PORT || 4000);

const lessons = [
  {
    id: "starter-phrases",
    title: "Starter phrases",
    level: "Beginner",
    duration: 15,
    description: "Everyday phrases for travel and introductions.",
  },
  {
    id: "travel-essentials",
    title: "Travel essentials",
    level: "Beginner",
    duration: 18,
    description: "Navigate airports, hotels, and restaurants with confidence.",
  },
  {
    id: "workplace-basics",
    title: "Workplace basics",
    level: "Intermediate",
    duration: 22,
    description: "Practice professional conversation and small talk.",
  },
  {
    id: "conversation-flow",
    title: "Conversation flow",
    level: "Intermediate",
    duration: 25,
    description: "Move from words to natural, clear communication with practical dialogue.",
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

const profile = {
  name: "Amara Parker",
  language: "Spanish",
  level: "Intermediate",
  streak: 12,
  weeklyGoal: "4/5 sessions",
};

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
  res.json({ profile });
});

app.get("/api/overview", (_req: Request, res: Response) => {
  res.json({ lessons, vocabulary, progress, profile });
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});

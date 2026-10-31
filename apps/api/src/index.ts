import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";

dotenv.config();

const app = express();
const port = Number(process.env.API_PORT || 4000);

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

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});

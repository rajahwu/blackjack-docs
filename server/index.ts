import express from "express";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const logDir = path.join(process.cwd(), "content", "traininglog");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

app.post("/api/traininglog", (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const filePath = path.join(logDir, `${today}.json`);

  let logs = [];
  if (fs.existsSync(filePath)) {
    logs = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }

  logs.push(req.body);
  fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));

  res.json({ success: true, saved: req.body });
});

app.get("/api/traininglog/:date", (req, res) => {
  const filePath = path.join(logDir, `${req.params.date}.json`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "No log for that date" });
  }
  const logs = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  res.json(logs);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Training log API running on http://localhost:${PORT}`);
});

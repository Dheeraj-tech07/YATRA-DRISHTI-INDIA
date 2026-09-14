require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Heritage = require("./models/Heritage");

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const FRONTEND_DIR = __dirname;

// Frontend ko local aur deployed dono origins se API call karne ki permission.
app.use(cors());
app.use(express.json({ limit: "1mb" }));

let databaseReady = false;
let geminiModel = null;

// Mongo connection optional rakha gaya hai taaki AI/health endpoint DB down hone par bhi clear status dein.
async function connectDatabase() {
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI missing: database routes unavailable rahengi.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    databaseReady = true;
    console.log("MongoDB Atlas connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}

// Gemini model ko startup par prepare karte hain; key missing ho to endpoint useful error dega.
if (process.env.GEMINI_API_KEY) {
  const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  geminiModel = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function requireDatabase(res) {
  if (databaseReady) return true;
  res.status(503).json({ message: "Database is not connected. MONGO_URI check karein." });
  return false;
}

// Sabhi stored monuments ka clean JSON response.
app.get("/api/heritage", async (req, res) => {
  if (!requireDatabase(res)) return;

  try {
    const monuments = await Heritage.find().sort({ name: 1 }).lean();
    res.json(monuments);
  } catch (error) {
    res.status(500).json({ message: "Heritage data load nahi ho saka.", error: error.message });
  }
});

// Search ko name, location, state aur category par case-insensitive banaya gaya hai.
app.get("/api/heritage/search", async (req, res) => {
  if (!requireDatabase(res)) return;

  const query = String(req.query.q || "").trim();
  if (!query) return res.json([]);

  try {
    const safeQuery = escapeRegex(query);
    const regex = new RegExp(safeQuery, "i");
    const monuments = await Heritage.find({
      $or: [{ name: regex }, { location: regex }, { state: regex }, { category: regex }]
    }).sort({ name: 1 }).limit(50).lean();
    res.json(monuments);
  } catch (error) {
    res.status(500).json({ message: "Heritage search fail ho gayi.", error: error.message });
  }
});

// Feedback ko validate karke MongoDB me save karte hain; alag model ki jagah lightweight collection use hoti hai.
app.post("/api/feedback", async (req, res) => {
  if (!requireDatabase(res)) return;

  const { name, email, details, message } = req.body || {};
  const feedbackText = String(details || message || "").trim();
  if (!String(name || "").trim() || !feedbackText) {
    return res.status(400).json({ message: "Name aur feedback details required hain." });
  }

  try {
    const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", new mongoose.Schema({
      name: { type: String, required: true, trim: true },
      email: { type: String, trim: true, lowercase: true },
      details: { type: String, required: true, trim: true },
      createdAt: { type: Date, default: Date.now }
    }));
    const savedFeedback = await Feedback.create({ name: String(name).trim(), email, details: feedbackText });
    res.status(201).json({ message: "Feedback successfully save ho gaya.", feedbackId: savedFeedback._id });
  } catch (error) {
    res.status(500).json({ message: "Feedback save nahi ho saka.", error: error.message });
  }
});

// Gemini se exactly short, judge-friendly heritage summary mangte hain.
app.post("/api/ai-info", async (req, res) => {
  const siteName = String(req.body?.siteName || req.body?.name || "").trim();
  if (!siteName) return res.status(400).json({ message: "siteName required hai." });
  if (!geminiModel) return res.status(503).json({ message: "GEMINI_API_KEY configured nahi hai." });

  try {
    const prompt = `Write exactly 2 concise lines in simple English about the Indian heritage site "${siteName}". Mention its historical or cultural significance. Do not use bullets, markdown, or headings.`;
    const result = await geminiModel.generateContent(prompt);
    const summary = result.response.text().trim();
    res.json({ siteName, summary });
  } catch (error) {
    res.status(502).json({ message: "Gemini summary generate nahi kar saka.", error: error.message });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, database: databaseReady, gemini: Boolean(geminiModel) });
});

// Static frontend serve karne se project ek hi localhost origin par bhi chal sakta hai.
app.use(express.static(FRONTEND_DIR));
app.get("*", (req, res) => res.sendFile(path.join(FRONTEND_DIR, "index.html")));

connectDatabase();
app.listen(PORT, () => console.log(`Yatra Drishti server running at http://localhost:${PORT}`));
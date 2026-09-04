import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";

import tutorialRoutes from "./routes/tutorialRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import cgpaRoutes from "./routes/cgpaRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import sitemapRoutes from "./routes/sitemapRoutes.js";
import mathRoutes from "./routes/mathRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import institutionRoutes from "./routes/institutionRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import courseTutorRoutes from "./routes/courseTutorRoutes.js";
import studyCoachRoutes from "./routes/studyCoachRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import missionsRoutes from "./routes/missionsRoutes.js";
import { startScheduledJobs } from "./jobs/streakReminderJob.js";
import authRoutes from "./routes/authRoute.js";
import studyPlannerRoutes from "./routes/studyPlannerRoutes.js";

import { errorHandler } from "./middleware/errorMiddleware.js";
import paymentRoutes from "./routes/paymentRoute.js";
import { paystackWebhook } from "./controllers/paystackwebhook.js";

connectDB();

const app = express();

// 🔒 Required when deployed behind a reverse proxy (Render, Heroku, etc.)
// — without this, express-rate-limit can't reliably determine each
// request's real client IP from the X-Forwarded-For header Render adds,
// and throws a validation error on every rate-limited request.
app.set("trust proxy", 1);

// 🔒 SECURITY: sets sensible HTTP security headers (blocks clickjacking,
// disables MIME-sniffing, etc.) with almost no downside.
app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "https://studenttoolsng.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// 🔒 SECURITY: general backstop rate limit across the whole API, on top
// of the stricter one on auth routes — protects things like AI quiz
// generation from being hammered by a script (which costs you real
// Groq API usage) and general abuse.
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
}));

// 🔒 CRITICAL: the Paystack webhook needs the RAW, unparsed request body to
// verify Paystack's signature (HMAC over the exact original bytes). It must
// be registered here, BEFORE the global express.json() below — if the
// global parser runs first, it consumes the body stream and req.rawBody
// below is always undefined, which silently breaks signature verification
// for every webhook call (this is exactly the bug that caused a real,
// successful payment to never activate a user's Pro access).
app.post(
  "/api/payment/paystack/webhook",
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  }),
  paystackWebhook
);

app.use(express.json());

app.get("/",(req,res)=>{
 res.send("StudentToolsNG API Running");
});

app.use("/api/tutorials",tutorialRoutes);
app.use("/api/messages",messageRoutes);

app.use("/api/cgpa",cgpaRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/admin",adminRoutes);

app.use("/api/math", mathRoutes);

app.use("/api/quiz", quizRoutes);

app.use("/api/institutions", institutionRoutes);

app.use("/api/materials", materialRoutes);

app.use("/api/course-tutor", courseTutorRoutes);

app.use("/api/study-coach", studyCoachRoutes);

app.use("/api/career", careerRoutes);

app.use("/api/missions", missionsRoutes);

app.use("/api/sitemap", sitemapRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/study-planner", studyPlannerRoutes);

app.use("/api/payment", paymentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
 console.log(`Server running on port ${PORT}`);
 startScheduledJobs();
});

console.log("OPENAI KEY:", process.env.OPENAI_API_KEY);
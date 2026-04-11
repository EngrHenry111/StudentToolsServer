import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import tutorialRoutes from "./routes/tutorialRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import cgpaRoutes from "./routes/cgpaRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import sitemapRoutes from "./routes/sitemapRoutes.js";


import { errorHandler } from "./middleware/errorMiddleware.js"

connectDB();

const app = express();

app.use(cors({
 origin:"*"
}));

app.use(express.json());

app.get("/",(req,res)=>{
 res.send("StudentToolsNG API Running");
});

app.use("/api/tutorials",tutorialRoutes);
app.use("/api/messages",messageRoutes);

app.use("/api/cgpa",cgpaRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/admin",adminRoutes);

app.use("/api/sitemap", sitemapRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
 console.log(`Server running on port ${PORT}`);
});

console.log("OPENAI KEY:", process.env.OPENAI_API_KEY);
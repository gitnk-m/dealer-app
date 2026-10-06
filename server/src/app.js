import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js"

const app = express();
app.use(express.json())
app.use(cors());

app.get("/health", (req, res) => {
    res.status(200).json({status: "ok", db: mongoose.connection.readyState });
});

app.use("/api/auth",authRoutes)

export default app
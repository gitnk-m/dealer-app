import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js"

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));

app.get("/health", (req, res) => {
    res.status(200).json({status: "ok", db: mongoose.connection.readyState });
});

app.use("/api/auth",authRoutes)


app.use(errorHandler)

export default app
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
// import db from "./config/db.js";

const app = express();
app.use(express.json())
app.use(cors());

app.get("/health", (req, res) => {
    res.status(200).json({ db: mongoose.connection.readyState });
    // try{
    //     res.status(200).json({ status: "ok" });
    // }
    // catch (error) {
    //     res.status(500).json({ status: "error", message: error.message });
    // }
});

export default app
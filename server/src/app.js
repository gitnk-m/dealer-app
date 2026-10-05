import express from "express";
import cors from "cors";

const app = express();
app.use(express.json())
app.use(cors());

app.get("/health", (req, res) => {
    try{
        res.status(200).json({ status: "ok" });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

export default app
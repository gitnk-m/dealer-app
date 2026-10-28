import express from "express";
import { stockIn } from "../controllers/stockController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const stockRoutes = express.Router();

stockRoutes.post("/inward", requireAuth, requireRole("admin"), stockIn);

export default stockRoutes;
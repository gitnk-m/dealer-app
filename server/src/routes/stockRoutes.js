import express from "express";
import { stockIn, stockReturn } from "../controllers/stockController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const stockRoutes = express.Router();

stockRoutes.post("/inward", requireAuth, requireRole("admin"), stockIn);
stockRoutes.post("/return", requireAuth, requireRole("admin"), stockReturn);

export default stockRoutes;
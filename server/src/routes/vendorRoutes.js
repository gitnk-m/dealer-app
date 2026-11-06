import express from "express";
import { createVendor, listVendors, getVendor, updateVendor } from "../controllers/vendorController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const vendorRoutes = express.Router();

vendorRoutes.post("/", requireAuth, requireRole("admin"), createVendor);
vendorRoutes.get("/", requireAuth, listVendors);
vendorRoutes.get("/:id", requireAuth, getVendor);
vendorRoutes.patch("/:id", requireAuth, requireRole("admin"), updateVendor);

export default vendorRoutes;
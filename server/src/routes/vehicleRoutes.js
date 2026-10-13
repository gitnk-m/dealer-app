import express from "express";
import { getVehicle, listVehicle, updateVehicle } from "../controllers/vehicleController.js";
import { requireAuth, requireRole} from "../middleware/auth.js";

const vehicleRoutes = express.Router();

vehicleRoutes.get("/", requireAuth, listVehicle)
vehicleRoutes.get("/:id", requireAuth, getVehicle)
vehicleRoutes.patch("/:id", requireAuth, requireRole("admin"), updateVehicle)

export default vehicleRoutes;
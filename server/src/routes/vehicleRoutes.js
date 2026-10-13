import express from "express";
import { listVehicle } from "../controllers/vehicleController.js";
import { requireAuth} from "../middleware/auth.js";

const vehicleRoutes = express.Router();

vehicleRoutes.get("/", requireAuth, listVehicle)

export default vehicleRoutes;
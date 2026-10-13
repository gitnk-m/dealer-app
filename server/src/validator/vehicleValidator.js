import * as z from "zod";
import { vehicleStatusEnum } from "../models/Vehicle.js";

export const addVehicleSchema = z.object({
    chassisNo : z.string().trim().uppercase(),
    engineNo : z.string().trim().uppercase(),
    model : z.string().trim(),
    variant : z.string().trim(),
    colour : z.string().trim(),
    status : z.enum(vehicleStatusEnum).default("in_stock")
});

export const listVehicleSchema = z.object({
    page : z.coerce.number().int().min(1).default(1),
    limit : z.coerce.number().int().min(1).max(50).default(10),
    status:z.enum(vehicleStatusEnum).optional(),
    model:z.string().trim().min(1).optional()
})

export const updateVehicleSchema = addVehicleSchema.partial();
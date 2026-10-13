import * as z from "zod";
import { vehicleStatusEnum } from "../models/Vehicle.js";

export const listVehicleSchema = z.object({
    page : z.coerce.number().int().min(1).default(1),
    limit : z.coerce.number().int().min(1).max(50).default(10),
    status:z.enum(vehicleStatusEnum).optional(),
    model:z.string().trim().min(1).optional()
})

export const updateVehicleSchema = z.strictObject({
    colour: z.string().trim().min(1).optional(),
    variant: z.string().trim().min(1).optional(),
    engineNo: z.string().trim().uppercase().min(1).optional(),
}).refine((data)=>Object.keys(data).length > 0,{
    message:"Send at least one field",
});
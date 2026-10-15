import * as z from "zod";

export const stockInwardSchema = z.strictObject({
    chassisNo : z.string().trim().toUpperCase().min(1),
    engineNo : z.string().trim().toUpperCase().min(1),
    model : z.string().trim().min(1),
    variant : z.string().trim().min(1).optional(),
    colour : z.string().trim().min(1),
    vendor : z.string().min(1),
    billNo : z.string().trim().min(1),
    date : z.iso.date().refine((d) => new Date(d) <= new Date(), "Bill date can't be in the future"),
    exShowroomPrice : z.number().int().min(0),
    amount : z.number().int().min(0)
})
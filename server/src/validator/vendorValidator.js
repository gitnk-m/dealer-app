import * as z from "zod";

export const createVendorSchema = z.object({
    name : z.string().trim().min(2, "Vendor name must be at least 2 characters"),
    phone : z.string().regex(/^\d{10}$/, "10-digits mobile number   "),
    address : z.string().trim().min(5, "Enter a valid address") 
})

export const listVendorSchema = z.object({
    active : z.stringbool().optional()
}).refine((data)=>Object.keys(data).length > 0,{
    message:"Send at least one field",
});

export const updateVendorSchema = z.strictObject({
    name : z.string().trim().min(2, "Vendor name must be at least 2 characters").optional(),
    phone : z.string().trim().min(10, "Phone number without country code").optional(),
    address : z.string().trim().min(5, "Enter a valid address").optional(),
    isActive : z.boolean().optional()
}).refine((data)=>Object.keys(data).length > 0,{
    message:"Send at least one field",
});
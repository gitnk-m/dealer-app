import * as z from "zod";

export const signupSchema = z.object({
    name: z.string().trim().min(2,"Name must be at least 2 characters"),
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    // role: z.enum(["executive", "admin"]).default("executive")
})

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1)
})
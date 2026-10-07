import express from "express";
import {register, login, refresher} from "../controllers/authController.js"
import {requireAuth, requireRole} from "../middleware/auth.js"

import User from "../models/User.js"

const authRouter = express.Router()

authRouter.post("/register", requireAuth,requireRole("admin"), register)
authRouter.post("/login", login)
authRouter.post("/refresh", refresher)
// authRouter.post("/logout", )

authRouter.get("/me", requireAuth, async (req, res) => {
    const userdetails = await User.findById(req.user.id)
    const user = {
        _id: userdetails._id,
        name: userdetails.name,
        email: userdetails.email,
        role: userdetails.role,
    }
    res.status(200).json({data:user})
})

export default authRouter
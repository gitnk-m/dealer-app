import express from "express";
import {register, login, refresher, logout} from "../controllers/authController.js"
import {requireAuth, requireRole} from "../middleware/auth.js"
import {getMe} from "../controllers/getmeController.js"

const authRouter = express.Router()

authRouter.post("/register", requireAuth,requireRole("admin"), register)
authRouter.post("/login", login)
authRouter.post("/refresh", refresher)
authRouter.post("/logout", logout)

authRouter.get("/me", requireAuth, getMe)

export default authRouter
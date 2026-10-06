import express from "express";
import {register, login, refresher} from "../controllers/authController.js"

const authRouter = express.Router()

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/refresh", refresher)

export default authRouter
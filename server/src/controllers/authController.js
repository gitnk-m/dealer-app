import {signupSchema, loginSchema} from "../validator/authValidator.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

export const register = async (req, res) => {
    const result = signupSchema.safeParse(req.body)
    if (!result.success){
        return res.status(400).json({message:"Invalid Input", error:result.error.issues})
    }
    
    const {name, email, password, role} = result.data;

    const duplicateUser = await User.findOne({email: email})
    if (duplicateUser){
        return res.status(409).json({message:"User already exists"})
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = new User({name, email, passwordHash, role:role||"executive"})

    await newUser.save();
    const user = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
    }
    res.status(201).json({message:"User registered successfully", data:user})
    
    
    
}

export const login = async (req, res) => {
    const result = loginSchema.safeParse(req.body)
    if (!result.success){
        return res.status(400).json({message:"Invalid Input"})
    }
    const {email, password} = result.data
    const loginUser = await User.findOne({email:email})
    if (!loginUser|| !await bcrypt.compare(password, loginUser.passwordHash)){
        return res.status(401).json({message:"Invalid email or password"})
    }
    const accessToken = jwt.sign({sub: loginUser._id, role: loginUser.role}, process.env.JWT_ACCESS_SECRET, {expiresIn:"15m"}) 
    const refToken = jwt.sign({sub:loginUser._id}, process.env.JWT_REFRESH_SECRET, {expiresIn:"7d"})

    const refreshTokenHash = sha256(refToken)
    loginUser.refreshTokenHash = refreshTokenHash;
    await loginUser.save();

    res.cookie(
        "refreshToken", 
        refToken, 
        {
            httpOnly:true, 
            sameSite: "strict", 
            secure:process.env.NODE_ENV === "production", 
            maxAge: 7 * 24 * 60 * 60 * 1000
        }
    ).status(200).json({
        accessToken:accessToken,
        user_id:loginUser._id,
        name:loginUser.name,
        email:loginUser.email,
        role:loginUser.role
    })
}

export const refresher = async (req, res) =>{
    const refToken = req.cookies.refreshToken;
    
    if (!refToken){
        return res.status(401).json({message:"Refresh token not found"})
    }
    let decoded;
    try{
        decoded = jwt.verify(refToken, process.env.JWT_REFRESH_SECRET);
    }catch(err){
        return res.status(401).json({message:"Invalid refresh token"})
    }
    const user = await User.findById(decoded.sub);
    if (!user){
        return res.status(401).json({message:"User not found"})
    }
    const refreshTokenHash = sha256(refToken)
    if (user.refreshTokenHash !== refreshTokenHash){
        return res.status(401).json({message:"Invalid refresh token"})
    }

    const accessToken = jwt.sign({sub: user._id, role: user.role}, process.env.JWT_ACCESS_SECRET, {expiresIn:"15m"}) 
    res.status(200).json({
        accessToken:accessToken,
        user_id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
    })
}

export const logout = async (req, res) => {
    const refToken = req.cookies.refreshToken;
    if (!refToken){
        return res.status(200).clearCookie("refreshToken").json({message:"Refresh token not found"})
    }
    let decoded;
    try{
        decoded = jwt.verify(refToken, process.env.JWT_REFRESH_SECRET);
    }catch(err){
        return res.status(200).clearCookie("refreshToken").json({message:"Invalid refresh token"})
    }
    const user = await User.findById(decoded.sub);
    if (!user){
        return res.status(200).clearCookie("refreshToken").json({message:"User not found"})
    }
    user.refreshTokenHash = null;
    await user.save();
    res.clearCookie("refreshToken").status(200).json({message:"Logged out successfully"})
}
    

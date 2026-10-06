import {signupSchema} from "../validator/authValidator.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

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
    const newUser = new User({name, email, passwordHash, role})

    await newUser.save();
    // const user = newUser.toObject();
    // delete user.passwordHash;
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
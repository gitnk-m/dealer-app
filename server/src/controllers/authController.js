import {signupSchema} from "../validator/authValidator.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
    const result = signupSchema.safeParse(req.body)
    // const {name, email, password, role} = req.body;
    if (!result.success){
        res.status(400).json({message:"Invalid Input", error:result.error.issues})
    }
    
    const {name, email, password, role} = result.data;

    const duplicateUser = await User.findOne({email: email})
    if (duplicateUser){
        return res.status(409).json({message:"User already exists"})
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = new User({name, email, passwordHash, role})

    try {
        await newUser.save();
        const user = newUser.toObject();
        delete user.passwordHash;
        res.status(201).json({message:"User registered successfully", data:user})
    }
    catch(err){
        console.error("Error registering user:", err);
        res.status(500).json({message:"Internal server error"})
    }
    
}

export default register 
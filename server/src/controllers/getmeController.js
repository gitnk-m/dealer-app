import User from "../models/User.js"

export const getMe = async (req, res) => {
    const userdetails = await User.findById(req.user.id)
    if (!userdetails) {
        return res.status(401).json({message:"User not found"})
    }
    const user = {
        _id: userdetails._id,
        name: userdetails.name,
        email: userdetails.email,
        role: userdetails.role,
    }
    res.status(200).json({data:user})
}
import User from "./models/User.js"
import "dotenv/config"
import bcrypt from "bcrypt"
import mongoose from "mongoose"
import connectDB from "./config/db.js"


const seedAdmin = async () => {
    try {
        const admin = new User({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12),
            role: "admin"
        })
        await admin.save();
        console.log("Admin user seeded successfully")
    }
    catch (error) {
        console.error("Error seeding admin user:", error)
    }
}

async function main() {

    const exist = await User.exists({role:"admin"})
    if (exist){
        console.log("Admin user already exists. Skipping seeding.")
        return
    }
    await connectDB()
    await seedAdmin()
    await mongoose.disconnect()
}

main()
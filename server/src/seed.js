import User from "../models/User.js"

const seedAdmin = async () => {
    try {
        const admin = new User({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12),
            role: process.env.ADMIN_ROLE || "admin"
        })
        await admin.save();
        console.log("Admin user seeded successfully")
    }
    catch (error) {
        console.error("Error seeding admin user:", error)
    }
}

// seedAdmin()
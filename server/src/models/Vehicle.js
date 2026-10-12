import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    chassisNo:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase:true
    },
    engineNo:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase:true
    },
    model:{
        type: String,
        required: true,
        trim: true,
    },
    variant:{
        type: String,
        trim: true,
    },
    colour:{
        type: String,
        required: true,
        trim: true,
    },
    status:{
        type: String,
        enum: ["in_stock", "booked", "retail", "insured", "rto", "registred", "returned", "transfered"],
        default: "in_stock"
    },
},{
    timestamps: true
});

export default mongoose.model("Vehicle", vehicleSchema)
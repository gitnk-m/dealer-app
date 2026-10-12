import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone:{
        type: String,
        trim: true
    },
    address:{
        type: String,
        trim: true
    },
    isActive:{
        type: Boolean,
        default: true
    }
});

export default mongoose.model("Vendor", vendorSchema);
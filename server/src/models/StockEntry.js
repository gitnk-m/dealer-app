import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
    vehicle:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        required: true,
    },
    vendor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true,
    },
    type:{
        type: String,
        required: true,
        enum: ["purchase", "return", "transfer"]
    },
    date:{
        type: Date,
        required: true
    },
    billNo:{
        type: String,
        trim: true,
        required: true
    },
    exShowroomPrice:{
        type: Number,
        required: true,
        min: 0
    },
    amount:{
        type: Number,
        required: true,
        min: 0
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {
    timestamps: true
});

export default mongoose.model("StockEntry", stockSchema, "stockentries");
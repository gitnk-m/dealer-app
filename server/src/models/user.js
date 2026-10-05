import monagoose from "mongoose";

const userSchema = new monagoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    passwordHash:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["executive", "admin"],
        default: "executive"
    }
},{
    timestamps: true
});

export default monagoose.model("User", userSchema);
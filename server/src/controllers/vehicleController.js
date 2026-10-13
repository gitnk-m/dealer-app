import { addVehicleSchema, listVehicleSchema, updateVehicleSchema } from "../validator/vehicleValidator.js";
import Vehicle from "../models/Vehicle.js";
import jwt from "jsonwebtoken";

// export const addVehicle = async(req, res) =>{
//     const result = addVehicleSchema.safeParse(req.body);
//     if (!result.success) {
//         return res.status(400).json({message:"Invalid Input", error:result.error.issues})
//     }

//     const {chassisNo, engineNo, model, variant, colour, status} = result.data;

//     const duplicateVehicle = await Vehicle.findOne({chassisNo : chassisNo})
//     if (duplicateVehicle){
//         return res.status(400).json({message:"Vehicle already exists"})
//     }

//     const newVehicle = new Vehicle({chassisNo, engineNo, model, variant, colour, status : status || "in_stock"})
//     await newVehicle.save();
//     res.status(201).json({message:"Vehicle added successfully", data:newVehicle});
// } 

export const listVehicle = async(req, res) =>{
    const result = listVehicleSchema.safeParse(req.query);
    if (!result.success) return res.status(400).json({message:"Invalid Query Params"})
    const {page, limit, status, model} = result.data;
    const skip = (page - 1) * limit;
    const filter = {}
    if (model) filter.model = model
    if (status) filter.status = status
    
    const [vehicles, total] = await Promise.all([
        Vehicle.find(filter).sort({createdAt : -1}).skip(skip).limit(limit),
        Vehicle.countDocuments(filter)
    ])
    // if (!vehicles || !total) return res.status(400).json({message:"Invalid Input"})
    res.status(200).json({
        vehicles:vehicles, 
        page:page, 
        limit:limit, 
        total:total, 
        totalPage: Math.ceil(total / limit) 
    })
}
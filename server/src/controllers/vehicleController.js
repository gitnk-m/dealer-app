import { listVehicleSchema, updateVehicleSchema } from "../validator/vehicleValidator.js";
import Vehicle from "../models/Vehicle.js";
import mongoose from "mongoose";

export const listVehicle = async(req, res) =>{
    const result = listVehicleSchema.safeParse(req.query);
    if (!result.success) return res.status(400).json({message:"Invalid Query Params", error:result.error.issues})
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

export const getVehicle = async(req, res) =>{
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({message:"Invalid Id"})
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return res.status(404).json({message:"Vehicle not found"});
    return res.status(200).json({vehicle:vehicle})
} 

export const updateVehicle = async(req, res) =>{
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({message:"Invalid Id"})
    const result = updateVehicleSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({message:"Invalid Query Params", error:result.error.issues})
    try{
        const vehicle = await Vehicle.findByIdAndUpdate(
            id,
            result.data,
            {returnDocument : "after", runValidators : true}
        )
        if (!vehicle) return res.status(404).json({message:"Vehicle not found"});
        return res.status(200).json({vehicle:vehicle})
    }catch(err){
        if (err.code === 11000) return res.status(409).json({message:"Engine number already belongs to another vehicle"});
        throw err;
    }
}
import { createVendorSchema, listVendorSchema, updateVendorSchema } from "../validator/vendorValidator.js";
import Vendor from "../models/Vendor.js";
import mongoose from "mongoose";

export const createVendor = async(req, res) =>{
    const result = createVendorSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({message:"Invalid Input", error:result.error.issues})
    const {name, phone, address} = result.data;
    const duplicateName = await Vendor.findOne({name:name})
    if (duplicateName){
        return res.status(409).json({message:"Vendor already exists"})
    }

    const newVendor = new Vendor({name,phone,address})
    await newVendor.save()
    const vendor = {
        _id:newVendor._id,
        name:newVendor.name,
        phone:newVendor.phone,
    }
    res.status(201).json({message:"Vendor created successfully", data:vendor})
}

export const listVendors = async(req, res) =>{
    const result = listVendorSchema.safeParse(req.query);
    if (!result.success) return res.status(400).json({message:"Invalid Query Params", error:result.error.issues})
    const filter = {}
    if (result.data.active) filter.isActive = result.data.active;
    const vendors = await Vendor.find(filter).sort({name:1});
    res.status(200).json({message:"Vendors listed successfully", data:vendors})
}

export const getVendor = async(req, res) =>{
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({message:"Invalid Id"})
    const vendor = await Vendor.findById(id);
    if (!vendor) return res.status(404).json({message:"Vendor not found"});
    return res.status(200).json({data:vendor})   
}

export const updateVendor = async(req, res) =>{
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({message:"Invalid Id"})
    const result = updateVendorSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({message:"Invalid input", error:result.error.issues})
    try{
        const vendor = await Vendor.findByIdAndUpdate(
            id,
            result.data,
            {returnDocument : "after", runValidators : true}
        )
        if (!vendor) return res.status(404).json({message:"Vendor not found"});
        return res.status(200).json({message:"Vendor updated successfully", data:vendor})
    }catch(err){
        if (err.code === 11000) return res.status(409).json({message:"Vendor name already exists"});
        throw err;
    }
}


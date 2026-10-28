import { stockInwardSchema } from "../validator/stockValidator.js";
import Vehicle from "../models/Vehicle.js";
import mongoose from "mongoose";
import Vendor from "../models/Vendor.js";
import StockEntry from "../models/StockEntry.js";

export const stockIn = async(req, res) =>{
    const stockVal = stockInwardSchema.safeParse(req.body);
    if (!stockVal.success) return res.status(400).json({message:"Invalid Input", error:stockVal.error.issues});
    const {
        chassisNo, 
        engineNo,
        model,
        variant,
        colour,
        vendor,
        billNo,
        date,
        exShowroomPrice,
        amount
    } = stockVal.data;
    if (!mongoose.isValidObjectId(vendor)) return res.status(400).json({message:"Invalid Vendor Id"});
    const vendorCheck = await Vendor.findOne({_id: vendor, isActive: true});
    if (!vendorCheck) return res.status(404).json({message:"Vendor not found"});
    
    const result = await mongoose.connection.transaction( async(session)=>{
        const existing = await Vehicle.findOne({ chassisNo }).session(session);
        let vehicle
        if (!existing){
            vehicle = new Vehicle({
                 chassisNo:chassisNo,
                 engineNo:engineNo,
                 model:model,
                 variant:variant,
                 colour:colour
             }) 
             await vehicle.save({session})
        }else if(existing.status === "returned" || existing.status === "transferred"){
            if (existing.engineNo !== engineNo) {
                const err = new Error("Engine number doesn't match this chassis");
                err.status = 409;
                throw err;    
            }
            vehicle = existing;
            vehicle.status = "in_stock"
            await vehicle.save({session})
        }else{
            const err = new Error("This chassis is already in stock or sold");
            err.status = 409;
            throw err;
        }

        const newStockEntry = new StockEntry({
            vehicle : vehicle._id,
            vendor : vendorCheck._id,
            type : "purchase",
            date : new Date(date),
            billNo : billNo,
            exShowroomPrice : exShowroomPrice,
            amount : amount,
            createdBy : req.user.id
        })
        await newStockEntry.save({session})

        return {vehicle, newStockEntry}
    })

    try{
        const result_check = await result
        res.status(201).json(result_check)
    }catch(err){
        if (err.code === 11000) return res.status(409).json({message:"Engine Number already exists"});
        throw err
    }

}
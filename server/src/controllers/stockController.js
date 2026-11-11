import { stockInwardSchema, stockReturnSchema } from "../validator/stockValidator.js";
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
    
    try{
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

            const entry = new StockEntry({
                vehicle : vehicle._id,
                vendor : vendorCheck._id,
                type : "purchase",
                date : new Date(date),
                billNo : billNo,
                exShowroomPrice : exShowroomPrice,
                amount : amount,
                createdBy : req.user.id
            })
            await entry.save({session})

            return {vehicle, entry}
        })
        res.status(201).json(result)
    }catch(err){
        if (err.code === 11000){
            const field = Object.keys(err.keyValue)[0];     // "engineNo" or "chassisNo"
            return res.status(409).json({ message: `${field} already exists`, field });
        }
        throw err
    }

}

export const stockReturn = async(req, res) => {
    const stockVal = stockReturnSchema.safeParse(req.body);
    if (!stockVal.success) return res.status(400).json({message:"Invalid Input", error:stockVal.error.issues});
    const { chassisNo, billNo, date } = stockVal.data;
    const result = await mongoose.connection.transaction(async(session)=>{
        const vehicle = await Vehicle.findOne({ chassisNo: chassisNo }).session(session);
        if (!vehicle) {
            const err = new Error("Vehicle not found");
            err.status = 404;
            throw err;
        }
        if (vehicle.status !== "in_stock"){
            const err = new Error("Vehicle is not in stock");
            err.status = 409;
            throw err;
        }
        const previousTrans = await StockEntry.findOne({ vehicle: vehicle._id, type: "purchase"})
            .sort({ date: -1, createdAt: -1 })
            .session(session)
        if (!previousTrans) {
            const err = new Error("No purchase record found for this vehicle");
            err.status = 404;
            throw err;
        }
        const newEntry = new StockEntry({
            vehicle: vehicle._id,
            vendor: previousTrans.vendor,
            type: "return",
            billNo: billNo,
            date: new Date(date),
            amount: previousTrans.amount,
            exShowroomPrice: previousTrans.exShowroomPrice,
            createdBy: req.user.id
        })
        await newEntry.save({session})
        vehicle.status = "returned"
        await vehicle.save({session})
        return {vehicle, entry: newEntry} 
    })
    res.status(201).json(result)
}
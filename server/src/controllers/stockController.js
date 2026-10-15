import { stockInwardSchema } from "../validator/stockValidator";
import Vehicle from "../models/Vehicle";
import mongoose from "mongoose";
import Vendor from "../models/Vendor";
import StockEntry from "../models/StockEntry";

export const stockIn = async(req, res) =>{
    const stockVal = stockInwardSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({message:"Invalid Input"});
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
    const vendorCheck = await Vendor.findByOne({_id: vendor, isActive: true});
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
             await newVehicle.save({session})
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
            vehicle
        })
    })

}
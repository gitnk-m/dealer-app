import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import User from "../src/models/User.js";

let replSet;

export const connect = async () => {
    replSet = await MongoMemoryReplSet.create({
        replSet : { count: 1}
    })
    await mongoose.connect(replSet.getUri())
    await User.init()  
} 

export const clear = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
}

export const close = async () => {
    await mongoose.disconnect();
    await replSet.stop();
}
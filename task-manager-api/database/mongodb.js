import mongoose from "mongoose";
import { MONGO_URI } from "../config/env.js";

if(!MONGO_URI) {
    throw new Error("Please define the MONGO_URI");
}

const connectToDatabase = async() => {
    try {
        await mongoose.connect(MONGO_URI);

        console.log('Connected to database!');
        
    } catch (error) {
        console.error('Error connrcting to database:', error);

        process.exit(1);
    }
}

export default connectToDatabase;
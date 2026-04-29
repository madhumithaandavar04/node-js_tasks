import mongoose from "mongoose";
import { logger } from "../logger/config.js";

const mongoUri = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        //verify the environment variable
        logger.debug(`Attempting to connect to MongoDB with URI: ${mongoUri}`);
        const conn = await mongoose.connect(mongoUri);
        // success message
        logger.info(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        // error
        logger.error(`Error occurred during MongoDB connection: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;
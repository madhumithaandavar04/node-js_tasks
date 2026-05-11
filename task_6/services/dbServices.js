import mongoose from "mongoose"
import { logger } from "../logger/config.js";

const mongoUri = process.env.MONGO_URI;
// connect to the mongodb
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(mongoUri);
        logger.info(`MongoDB connected ${conn.connection.host}`);
    }
    catch (error) {
        logger.error("Error occur during connect to mongodb", error.message);
    }
}

export default connectDB;
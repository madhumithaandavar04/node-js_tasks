import express from "express"
import dotenv from "dotenv/config";
import buddyRoutes from "./routes/buddyRoutes.js"
import { create } from "./services/buddyService.js";
import { errorhandler } from "./middleware/errorHandler.js";
import cors from "cors"
import { logger } from "./logger/config.js";
import connectDB from "./data/db.config.js";

//env variables
const PORT=process.env.PORT;

//initialize server
const app=express();
app.use(cors());
//middlewares
app.use(express.json());

//using modular routes
app.use('/api/v1/buddies',buddyRoutes);

//error middleware
app.use(errorhandler);
app.listen(PORT,async()=>{
   logger.info(`Buddy Nickname Project running on port ${PORT}`);
   await connectDB();
})

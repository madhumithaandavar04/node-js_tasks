import express from "express"
import dotenv from "dotenv/config";
import buddyRoutes from "./routes/buddyRoutes.js"
import { errorhandler } from "./middleware/errorHandler.js";
import cors from "cors"
import { logger } from "./logger/config.js";
import connectDB from "./services/dbServices.js";
import authRoutes from "./routes/authRoutes.js"

//env variables
const PORT = process.env.PORT;

//initialize server
const app = express();
app.use(cors());
//middlewares
app.use(express.json());

//auth route
app.use('/api/v1/auth', authRoutes);
//buddies route
app.use('/api/v1/buddies', buddyRoutes);

//error middleware
app.use(errorhandler);

//server listening to the port
app.listen(PORT, async () => {
   logger.info(`Buddy Nickname Project running on port ${PORT}`);
   await connectDB();
})

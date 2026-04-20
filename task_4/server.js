import express from "express"
import dotenv from "dotenv/config"
import buddyRoutes from "./routes/buddyRoutes.js"
import { initializeFile, writeFile } from "./services/fileService.js";
import { errorhandler } from "./middleware/errorHandler.js";

// env variables
const PORT=process.env.PORT;

// initialize server
const app=express();

// middlewares
app.use(express.json());

// using modular routes
app.use('/api/v1/buddies',buddyRoutes);

// error middleware
app.use(errorhandler);
app.listen(PORT,()=>{
   initializeFile();
   console.log(`Server is listening to the PORT ${PORT}.`);
     
})

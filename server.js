import express from "express";

import { connectDB } from "./db.js";

import dotenv from "dotenv";
dotenv.config();

import userroute from "./routes/userroute.js"
import candidateroute from "./routes/candidateroute.js";



import cors from "cors";

const app = express();
app.use(cors());
app.use (express.json());



app.use('/user',userroute);
app.use ('/candidate',candidateroute);

const startServer = async()=>{
    try{
        await connectDB();
        app.listen(3000, ()=>{
            console.log('Server is running on port 3000')
        
        });
    }catch(error){
        console.log('Server failed to start:', error.message);
    }
};
startServer();
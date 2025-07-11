import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import cors from 'cors';
import { connectDB } from './lib/db.js';
const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.get('/',(req,res)=>{
    res.send("Hello World");
});
app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);
app.listen(process.env.PORT,()=>{   
    console.log("Server is running on port 3000");
    connectDB()
});
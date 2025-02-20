
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import oportunityRoutes from "./routes/oportunityRoutes.js";
import {v2 as cloudinary} from "cloudinary";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import messageRoutes from "./routes/messageRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import { app, server } from "./socket/socket.js";

dotenv.config()

connectDB();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const PORT = process.env.PORT || 5000;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middlewares
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/oportunities", oportunityRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);


server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`))
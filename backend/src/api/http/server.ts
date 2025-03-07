import express from "express";
import dotenv from "dotenv";
import connectDB from "../../config/db/connectDB.ts";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import authRoutes from "../routes/authRoutes.ts";

import { app, server } from "./socket.ts";

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao banco de dados
connectDB();

// Configurar CORS
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const PORT: number = Number(process.env.PORT) || 5000;

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string
});

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

// Iniciar o servidor
server.listen(PORT, () => console.log(`🚀 Server started at http://localhost:${PORT}`));

import IUser from "@/db/interfaces/userInterface.ts";
import { Document } from "mongoose";
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from "@/db/models/userModel.ts";

// Define the structure of decoded JWT token
interface DecodedToken {
    userId: string;
}

export const authenticatedRequest = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            res.status(401).json({ message: "Não autorizado. Você não esta logado." });
            return;
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET não está definido");
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

        // Find user by ID (excluding password)
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            res.status(401).json({ message: "Usuário não encontrado" });
            return;
        }

        // Attach user to the request object
        req.user = user;

        next();
    } catch (error: any) {
        res.status(401).json({
            message: error.name === 'JsonWebTokenError' ?
                "Token inválido" :
                error.message || "Erro de autenticação"
        });
        return;
    }
};

export interface AuthRequest extends Request {
    user?: Document<unknown, {}, IUser> & IUser & Required<{ _id: unknown }> & { __v: number };
}


import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../../db/models/userModel.ts';
import { Document } from 'mongoose';
import IUser from '../../db/interfaces/userInterface.ts';

interface DecodedToken {
    userId: string;
}

interface RequestWithUser extends Request {
    user: Document<unknown, {}, IUser> & IUser & Required<{ _id: unknown; }> & { __v: number; } | null;
}

const protectRoute = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;

        if (!token) return res.status(401).json({ message: "Unauthorized" });

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as unknown as DecodedToken;

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;

        next();
    } catch (err: string | any) {
        res.status(500).json({ message: err.message });
        console.log("Error in protectRoute: ", err.message);
    }
}

export default protectRoute;
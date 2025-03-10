import { AuthRequest } from "../../../api/middlewares/authenticatedRequest.ts";
import User from "../../../db/models/userModel.ts";
import mongoose from 'mongoose';
import { Response } from "express";

const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    const { query } = req.params;
    try {
        let user;

        if (mongoose.Types.ObjectId.isValid(query)) {
            user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
        } else {
            user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
        }

        if (!user) {
            res.status(400).json({ error: "Usuário não encontrado" });
            return;
        }

        res.status(200).json(user);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
        console.log("Erro em getUserProfile: ", err.message);
        return;
    }
}

export default getUserProfile;

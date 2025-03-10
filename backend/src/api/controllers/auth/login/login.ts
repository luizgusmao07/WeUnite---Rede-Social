import User from "../../../../db/models/userModel.ts";
import generateTokenAndSetCookie from "../../../../utils/generateAndSetCookie.ts";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import LoginRequestBody from "./interfaces/LoginRequestBody.ts";
import LoginResponse from "./interfaces/LoginResponse.ts";

export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response<LoginResponse>): Promise<Response<LoginResponse>> => {

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Preencha todos os campos" });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ success: false, message: "Informações inválidas" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ success: false, message: "Email não verificado" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        generateTokenAndSetCookie(res, user._id.toString());

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                username: user.username,
                bio: user.bio,
                profilePic: user.profilePic,
                isClub: user.isClub
            }
        });
    } catch (error: any) {
        console.log("Error in loginUser: ", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

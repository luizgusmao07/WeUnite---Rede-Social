import { Request, Response } from "express";

export const logout = async (req: Request, res: Response) => {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

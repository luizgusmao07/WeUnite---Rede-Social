import User from "@/db/models/userModel.ts";
import { Request, Response } from "express";

export const verifyResetPasswordCode = async (req: Request, res: Response): Promise<Response> => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			resetPasswordToken: code,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Código invalido ou expirado" });
		};

		return res.status(200).json({ success: true, message: "Código de verificação é valido!" });

	} catch (error) {
		console.log("error in verifyForgotPasswordCode ", error);
		return res.status(500).json({ success: false, message: "Erro de servidor" });
	}
};
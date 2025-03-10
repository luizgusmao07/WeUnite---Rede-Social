import { sendWelcomeEmail } from "../../../../config/mail/emails.ts";
import User from "../../../../db/models/userModel.ts";
import generateTokenAndSetCookie from "../../../../utils/generateAndSetCookie.ts";
import { Request, Response } from "express";

export const verifyEmail = async (req: Request, res: Response): Promise<Response> => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
			isVerified: false
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Código inválido ou expirado" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		generateTokenAndSetCookie(res, user._id.toString());

		await sendWelcomeEmail({email: user.email, name: user.name});

		return res.status(200).json({
			success: true,
			message: "Email verificado com sucesso",
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				username: user.username,
				isVerified: true
			}
		});
	} catch (error) {
		console.log("Erro em verifyEmail backend", error);
		return res.status(500).json({ success: false, message: "Erro no servidor" });
	}
};
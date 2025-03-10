import User from '../../../../db/models/userModel.ts';
import { Request, Response } from 'express';
import bcrypt from "bcrypt";
import { sendResetSuccessEmail } from '../../../../config/mail/emails.ts';

export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Código invalido ou expirado" });
		}

		// update password
		const hashedPassword = await bcrypt.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		return res.status(200).json({ success: true, message: "Senha reinciada com sucesso!" });
	} catch (error: any) {
		console.log("Error in resetPassword ", error);
		return res.status(400).json({ success: false, message: error.message });
	}
};
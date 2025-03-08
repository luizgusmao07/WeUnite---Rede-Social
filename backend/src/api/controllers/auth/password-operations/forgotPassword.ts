import { sendPasswordResetEmail } from '@/config/mail/emails.ts';
import User from '@/db/models/userModel.ts';
import { Request, Response } from 'express';

export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {

	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "Usuário não encontrado" });
		}

		// Generate reset token
		const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
		const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail({ email: user.email, resetToken });

		return res.status(200).json({ success: true, message: "Código de verificação enviado para o seu email" });
	} catch (error: any) {
		console.log("Error in forgotPassword ", error);
		return res.status(400).json({ success: false, message: error.message });
	}
};
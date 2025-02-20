import bcryptjs from "bcryptjs";
import crypto from "crypto";
import {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendVerificationEmailCompany,
	sendWelcomeEmail,
	sendWelcomeEmailCompany,
} from "../resend/emails.js";
import User from "../models/userModel.js";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import dotenv from 'dotenv'
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Função para verificar o token e autenticar o usuário
export const googleLogin = async (req, res) => {
	const { token } = req.body;

	try {
		// Verifica o token do Google
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const { name, email, picture } = ticket.getPayload();

		// Busca o usuário pelo email
		let user = await User.findOne({ email });

		if (!user) {
			// Se o usuário não existir, cria um novo com username gerado a partir do nome ou email
			const generatedUsername = email.split('@')[0]; // Gera username baseado no email

			user = new User({
				name,
				email,
				profilePic: picture,
				username: generatedUsername, // Define o username automaticamente
				isVerified: true,
			});
			await user.save();
		}

		// Gera o token e retorna os dados do usuário
		generateTokenAndSetCookie(res, user._id);

		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			profilePic: user.profilePic,
			username: user.username,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false, message: "Erro ao autenticar com Google" });
	}
};

export const signup = async (req, res) => {

	try {
		const { email, password, name, username } = req.body;

		if (!email || !password || !name || !username) {
			return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios" });
		}

		if (password.length < 6) {
			return res.status(403).json({ success: false, message: "A senha deve ter ao menos 8 caracteres" })
		}

		const userAlreadyExists = await User.findOne({ $or: [{ email }, { username }] });

		if (userAlreadyExists) {
			return res.status(409).json({ success: false, message: "Usuário já existe" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

		const user = new User({
			email,
			password: hashedPassword,
			name,
			username,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
			isVerified: false // Novo campo para indicar se o usuário está verificado
		});

		await user.save();

		await sendVerificationEmail(user.email, verificationToken);

		res.status(201).json({
			success: true,
			message: "Usuário criado. Por favor, verifique seu email para ativar a conta.",
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				username: user.username,
				isVerified: false
			}
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

export const signupcompany = async (req, res) => {
	try {
		const { email, cnpj, name, username } = req.body;

		if (!email || !cnpj || !name || !username) {
			return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios" });
		}

		const userAlreadyExists = await User.findOne({ $or: [{ cnpj }] });

		if (userAlreadyExists) {
			return res.status(409).json({ success: false, message: "Usuário já existe" });
		}

		const password = crypto.randomBytes(4).toString('hex');
		const hashedPassword = await bcryptjs.hash(password, 10);

		const user = new User({
			email,
			password: hashedPassword,
			cnpj: cnpj,
			name,
			username,
			isClub: true,
			isVerified: true
		});

		await user.save();

		await sendWelcomeEmailCompany(email, name, username, password);

		res.status(201).json({
			success: true,
			message: "Usuário criado com suceesso",
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				cnpj: user.cnpj,
				username: user.username,
				isClub: true,
				isVerified: true
			}
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

export const signupcompanysolicitation = async (req, res) => {
	try {
		const { email, cnpj, name, username } = req.body;

		if (!email || !cnpj || !name || !username) {
			return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios" });
		}

		const userAlreadyExists = await User.findOne({ $or: [{ email }, { username }, { cnpj }] });

		if (userAlreadyExists) {
			return res.status(409).json({ success: false, message: "Usuário já existe" });
		}

		await sendVerificationEmailCompany(email, name, cnpj, username);

		res.status(201).json({
			success: true,
			message: "Solicitação de cadastro enviada com sucesso",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};


export const verifyEmail = async (req, res) => {
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

		generateTokenAndSetCookie(res, user._id);

		await sendWelcomeEmail(user.email, user.name);

		res.status(200).json({
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
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Erro no servidor" });
	}
};

export const login = async (req, res) => {

	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		if (!user.isVerified) {
			return res.status(403).json({ success: false, message: "Email não verificado" });
		}

		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		generateTokenAndSetCookie(res, user._id);

		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			username: user.username,
			bio: user.bio,
			profilePic: user.profilePic,
			isClub: user.isClub,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in loginUser: ", error.message);
	}
};

export const logout = async (req, res) => {
	res.clearCookie("jwt");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};


export const forgotPassword = async (req, res) => {

	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "Usuário não encontrado" });
		}

		// Generate reset token
		const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, resetToken);

		res.status(200).json({ success: true, message: "Código de verificação enviado para o seu email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const verifyForgotPasswordCode = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			resetPasswordToken: code,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Código invalido ou expirado" });
		};

		res.status(200).json({ success: true, message: "Código de verificação é valido!" });

	} catch (error) {
		console.log("error in verifyForgotPasswordCode ", error);
		res.status(500).json({ success: false, message: "Erro de servidor" });
	}
};

export const resetPassword = async (req, res) => {
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
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Senha reinciada com sucesso!" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "Usuário não encontrado" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};
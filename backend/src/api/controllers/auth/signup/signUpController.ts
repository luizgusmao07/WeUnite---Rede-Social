import { sendVerificationEmail } from "../../../../config/mail/emails.ts";
import IUser from "../../../../db/interfaces/userInterface.ts";
import User from "../../../../db/models/userModel.ts";
import mongoose from "mongoose";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import checkExistingUser from "../../functions/checkExistingUser.ts";
import { validateRequiredFields } from "../../functions/validateRequiredFields.ts";
import ISignUpRequestBody from "./interfaces/ISignUpRequestBody.ts";
import ISignUpResponse from "./interfaces/ISignUpResponse.ts";





const PASSWORD_MIN_LENGTH = 8;
const VERIFICATION_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 horas


function generateVerificationToken(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
} // Gera um código de verificação de seis digitos

async function createUser(
    email: string,
    password: string,
    name: string,
    username: string
): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email,
        password: hashedPassword,
        name,
        username,
        verificationToken,
        verificationTokenExpiresAt: Date.now() + VERIFICATION_TOKEN_EXPIRY,
        isVerified: false,
    });

    await user.save();
    await sendVerificationEmail({ email: user.email, verificationToken });

    return user;
}

export const signup = async (
    req: Request<{}, {}, ISignUpRequestBody>,
    res: Response<ISignUpResponse>
): Promise<Response<ISignUpResponse>> => {
    try {
        const { email, password, name, username } = req.body;

        if (!validateRequiredFields({email, password, name, username}, ['email', 'password', 'name', 'username'])) {
            return res.status(400).json({
                success: false,
                message: "Preencha todos os campos obrigatórios"
            });
        } // Verifica se todos os campos obrigatórios estão preenchidos

        if (password.length < PASSWORD_MIN_LENGTH) {
            return res.status(403).json({
                success: false,
                message: `A senha deve ter ao menos ${PASSWORD_MIN_LENGTH} caracteres`
            });
        } // Verifica se a senha tem o tamanho minímo

        const userExists = await checkExistingUser(email, username);
        if (userExists) {
            return res.status(409).json({
                success: false,
                message: "Usuário já existe"
            });
        } // Verifica se um usuário com as informações inseridas já existe no banco

        const user = await createUser(email, password, name, username); // Cria o usuário no banco de dados

        return res.status(201).json({
            success: true,
            message: "Usuário criado. Por favor, verifique seu email para ativar a conta.",
            user: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                username: user.username,
                isVerified: false
            }
        }); // Retorna a resposta de sucesso

    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Erro interno do servidor"
        });
    }
};
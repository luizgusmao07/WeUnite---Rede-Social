import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { sendWelcomeEmailCompany } from "@/config/mail/emails.ts";
import mongoose from "mongoose";
import User from '@/db/models/userModel.ts';
import { formatData } from '../../functions/formatData.ts';
import { validateRequiredFields } from '../../functions/validateRequiredFields.ts'; // Certifique-se de que o caminho está correto
import ISignUpCompanyRequestBody from './interfaces/ISignUpCompanyRequestBody.ts';
import ISignUpCompanyResponse from './interfaces/ISignUpCompanyResponse.ts';


export const signupcompany = async (req: Request<{}, {}, ISignUpCompanyRequestBody>, res: Response<ISignUpCompanyResponse>): Promise<Response<ISignUpCompanyResponse>> => {
    try {
        const { email, cnpj, name, username } = req.body;

        if (!validateRequiredFields({ email, cnpj, name, username }, ['email', 'cnpj', 'name', 'username'])) {
            return res.status(400).json({
                success: false,
                message: "Preencha todos os campos obrigatórios",
            });
        };

        const { isValid, errors } = formatData({ email, cnpj, name, username });
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: `Campos inválidos ${JSON.stringify(errors)}`,
            });
        };

        const userAlreadyExists = await User.findOne({ $or: [{ cnpj }] });

        if (userAlreadyExists) {
            return res.status(409).json({ success: false, message: "Usuário já existe" });
        }

        const password = crypto.randomBytes(4).toString('hex');
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email,
            password: hashedPassword,
            cnpj,
            name,
            username,
            isClub: true,
            isVerified: true
        });

        await user.save();

        await sendWelcomeEmailCompany({ email, name, username, password });

        return res.status(201).json({
            success: true,
            message: "Usuário criado com sucesso",
            user: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                cnpj: user.cnpj,
                username: user.username,
                isClub: true,
                isVerified: true
            }
        });
    } catch (error: any) {
        console.log("Error in signUpCompany: ", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};
import { sendVerificationEmailCompany } from "../../../../config/mail/emails.ts";
import checkExistingUser from "../../functions/checkExistingUser.ts";
import { Request, Response } from 'express';
import { formatData } from "../../functions/formatData.ts";
import { validateRequiredFields } from "../../functions/validateRequiredFields.ts";
import ISignUpCompanyRequestBody from "./interfaces/ISignUpCompanyRequestBody.ts";
import ISignUpCompanySolicitationResponse from "./interfaces/ISignUpCompanySolicitationResponse.ts";

export const signupcompanysolicitation = async (req: Request<{}, {}, ISignUpCompanyRequestBody>, res: Response<ISignUpCompanySolicitationResponse>): Promise<Response<ISignUpCompanySolicitationResponse>> => {
    try {
        const { email, cnpj, name, username } = req.body;

        if (!validateRequiredFields({email, cnpj, name, username}, ['email', 'cnpj', 'name', 'username'])) {
            return res.status(400).json({
                success: false,
                message: "Preencha todos os campos obrigatórios",
            })
        };

        const { isValid, errors } = formatData({ email, cnpj, name, username });
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: `Campos inválidos ${JSON.stringify(errors)}`,
            })
        };

        const userAlreadyExists = await checkExistingUser(email, username, cnpj);

        if (userAlreadyExists) {
            return res.status(409).json({
                success: false,
                message: "Usuário já existe"
            });
        }

        await sendVerificationEmailCompany({ email, name, cnpj, username });

        return res.status(201).json({
            success: true,
            message: "Solicitação de cadastro enviada com sucesso",
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


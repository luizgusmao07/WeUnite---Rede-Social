import {
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    VERIFICATION_EMAIL_TEMPLATE,
    VERIFICATION_EMAIL_TEMPLATE_COMPANY,
    WELCOME_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE_COMPANY,
} from "./emailTemplates.ts";

import transporter from "./nodemailer.config.ts";

interface EmailData {
    to: string;
    subject: string;
    html: string;
}

interface EmailError {
    message: string;
}

interface VerificationData {
    email: string;
    verificationToken: string;
}

interface CompanyVerificationData {
    email: string;
    name: string;
    username: string;
    cnpj: string;
}

interface WelcomeData {
    email: string;
    name: string;
}

interface CompanyWelcomeData {
    email: string;
    name: string;
    username: string;
    password: string;
}

interface PasswordResetData {
    email: string;
    resetToken: string;
}

const sendEmail = async ({ to, subject, html }: EmailData) => {
    try {
        const mailOptions = {
            from: 'WeUnite <seu_email@gmail.com>',
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully", info);
        return info;
    } catch (error: unknown) {
        const err = error as EmailError;
        console.error(`Error sending email`, error);
        throw new Error(`Error sending email: ${err.message}`);
    }
};

export const sendVerificationEmail = async ({ email, verificationToken }: VerificationData): Promise<void> => {
    try {
        await sendEmail({
            to: email,
            subject: "Verifique seu email em WeUnite",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken)
        });
        console.log("Verification email sent successfully");
    } catch (error: unknown) {
        const err = error as EmailError;
        console.error(`Error sending verification email`, error);
        throw new Error(`Error sending verification email: ${err.message}`);
    }
};

export const sendVerificationEmailCompany = async ({ email, name, username, cnpj }: CompanyVerificationData): Promise<void> => {
    try {
        await sendEmail({
            to: email,
            subject: "Solicitação de cadastro em WeUnite",
            html: VERIFICATION_EMAIL_TEMPLATE_COMPANY
                .replace("{name}", name)
                .replace("{username}", username)
                .replace("{cnpj}", cnpj)
                .replace("{email}", email)
        });
        console.log("Verification email sent successfully");
    } catch (error: unknown) {
        const err = error as EmailError;
        console.error(`Error sending verification email`, error);
        throw new Error(`Error sending verification email: ${err.message}`);
    }
};

export const sendWelcomeEmail = async ({ email, name }: WelcomeData): Promise<void> => {
    try {
        await sendEmail({
            to: email,
            subject: "Seja bem vindo a WeUnite",
            html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name)
        });
        console.log("Welcome email sent successfully");
    } catch (error: unknown) {
        const err = error as EmailError;
        console.error(`Error sending welcome email`, error);
        throw new Error(`Error sending welcome email: ${err.message}`);
    }
};

export const sendWelcomeEmailCompany = async ({ email, name, username, password }: CompanyWelcomeData): Promise<void> => {
    try {
        await sendEmail({
            to: email,
            subject: `Seja bem vindo a WeUnite`,
            html: WELCOME_EMAIL_TEMPLATE_COMPANY.replace("{username}", username).replace("{password}", password)
        });
        console.log("Welcome email sent successfully");
    } catch (error: unknown) {
        const err = error as EmailError;
        console.error(`Error sending welcome email`, error);
        throw new Error(`Error sending welcome email: ${err.message}`);
    }
};

export const sendPasswordResetEmail = async ({ email, resetToken }: PasswordResetData): Promise<void> => {
    try {
        await sendEmail({
            to: email,
            subject: "Reinicie sua senha em WeUnite",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{verificationCode}", resetToken)
        });
        console.log("Password reset email sent successfully");
    } catch (error: unknown) {
        const err = error as EmailError;
        console.error(`Error sending password reset email`, error);
        throw new Error(`Error sending password reset email: ${err.message}`);
    }
};

export const sendResetSuccessEmail = async (email: string): Promise<void> => {
    try {
        await sendEmail({
            to: email,
            subject: "Senha reiniciada com sucesso em WeUnite",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE
        });
        console.log("Password reset success email sent successfully");
    } catch (error: unknown) {
        const err = error as EmailError;
        console.error(`Erro ao enviar email de reinicio de senha`, error);
        throw new Error(`Erro ao enviar email de reinicio de senha: ${err.message}`);
    }
};
import {
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    VERIFICATION_EMAIL_TEMPLATE,
    VERIFICATION_EMAIL_TEMPLATE_COMPANY,
    WELCOME_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE_COMPANY,
} from "./emailTemplates.js";

import transporter from "./nodemailer.config.js";

const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: 'WeUnite <seu_email@gmail.com>', // Substitua pelo seu email do Gmail
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully", info);
        return info;
    } catch (error) {
        console.error(`Error sending email`, error);
        throw new Error(`Error sending email: ${error.message}`);
    }
};

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        await sendEmail(
            email,
            "Verifique seu email em WeUnite",
            VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken)
        );
        console.log("Verification email sent successfully");
    } catch (error) {
        console.error(`Error sending verification email`, error);
        throw new Error(`Error sending verification email: ${error.message}`);
    }
};

export const sendVerificationEmailCompany = async (email, name, username, cnpj) => {
    try {
        await sendEmail(
            email,
            "Solicitação de cadastro em WeUnite",
            VERIFICATION_EMAIL_TEMPLATE_COMPANY
                .replace("{name}", name)
                .replace("{username}", username)
                .replace("{cnpj}", cnpj)
                .replace("{email}", email)
        );
        console.log("Verification email sent successfully");
    } catch (error) {
        console.error(`Error sending verification email`, error);
        throw new Error(`Error sending verification email: ${error.message}`);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    try {
        await sendEmail(
            email,
            "Seja bem vindo a WeUnite",
            WELCOME_EMAIL_TEMPLATE.replace("{name}", name)
        );
        console.log("Welcome email sent successfully");
    } catch (error) {
        console.error(`Error sending welcome email`, error);
        throw new Error(`Error sending welcome email: ${error.message}`);
    }
};

export const sendWelcomeEmailCompany = async (email, name, username, password) => {
    try {
        await sendEmail(
            email,
            `Seja bem vindo a WeUnite`,
            WELCOME_EMAIL_TEMPLATE_COMPANY.replace("{username}", username).replace("{password}", password)
        );
        console.log("Welcome email sent successfully");
    } catch (error) {
        console.error(`Error sending welcome email`, error);
        throw new Error(`Error sending welcome email: ${error.message}`);
    }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
    try {
        await sendEmail(
            email,
            "Reinicie sua senha em WeUnite",
            PASSWORD_RESET_REQUEST_TEMPLATE.replace("{verificationCode}", resetToken)
        );
        console.log("Password reset email sent successfully");
    } catch (error) {
        console.error(`Error sending password reset email`, error);
        throw new Error(`Error sending password reset email: ${error.message}`);
    }
};

export const sendResetSuccessEmail = async (email) => {
    try {
        await sendEmail(
            email,
            "Senha reiniciada com sucesso em WeUnite",
            PASSWORD_RESET_SUCCESS_TEMPLATE
        );
        console.log("Password reset success email sent successfully");
    } catch (error) {
        console.error(`Erro ao enviar email de reinicio de senha`, error);
        throw new Error(`Erro ao enviar email de reinicio de senha: ${error.message}`);
    }
};
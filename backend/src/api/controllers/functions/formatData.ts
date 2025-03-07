import { z } from 'zod';

// Define individual field schemas
const usernameSchema = z
    .string()
    .min(5, { message: 'Username must be at least 3 characters long' })
    .max(25, { message: 'Username must be at most 30 characters long' })
    .regex(/^[a-zA-Z0-9_.-]+$/, { message: 'Username can only contain letters, numbers, underscores, dots, and hyphens' });

const nameSchema = z
    .string()
    .min(5, { message: 'Name must be at least 2 characters long' })
    .max(45, { message: 'Name must be at most 100 characters long' })
    .regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/, { message: 'Name contains invalid characters' });

const emailSchema = z
    .string()
    .email({ message: 'Invalid email address format' });

const passwordSchema = z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' });

const cnpjSchema = z
    .string()
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, { message: 'CNPJ must be in format XX.XXX.XXX/XXXX-XX' })
    .refine((cnpj: string) => {
        // Remove non-digit characters
        const digits = cnpj.replace(/\D/g, '');

        // CNPJ must have 14 digits
        if (digits.length !== 14) return false;

        // Check if all digits are the same
        if (/^(\d)\1+$/.test(digits)) return false;

        // Validate check digits
        let sum = 0;
        let pos = 5;
        for (let i = 0; i < 12; i++) {
            sum += parseInt(digits[i]) * pos;
            pos = pos === 2 ? 9 : pos - 1;
        }
        let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (parseInt(digits[12]) !== result) return false;

        sum = 0;
        pos = 6;
        for (let i = 0; i < 13; i++) {
            sum += parseInt(digits[i]) * pos;
            pos = pos === 2 ? 9 : pos - 1;
        }
        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

        return parseInt(digits[13]) === result;
    }, { message: 'Invalid CNPJ' });

// Validation function
export function formatData({
    username,
    name,
    email,
    password,
    cnpj,
}: {
    username?: string;
    name?: string;
    email?: string;
    password?: string;
    cnpj?: string;
}) {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (username !== undefined) {
        const result = usernameSchema.safeParse(username);
        if (!result.success) {
            errors.username = "O nome de usuário deve ter entre 5 e 25 caracteres e conter apenas letras, números, underscores, pontos e hífens";
            isValid = false;
        }
    }

    if (name !== undefined) {
        const result = nameSchema.safeParse(name);
        if (!result.success) {
            errors.name = "O nome deve ter entre 5 e 45 caracteres e conter apenas letras e espaços";
            isValid = false;
        }
    }

    if (email !== undefined) {
        const result = emailSchema.safeParse(email);
        if (!result.success) {
            errors.email = "O e-mail informado não é válido";
            isValid = false;
        }
    }

    if (password !== undefined) {
        const result = passwordSchema.safeParse(password);
        if (!result.success) {
            errors.password = "A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial";
            isValid = false;
        }
    }

    if (cnpj !== undefined) {
        console.log("Validating CNPJ:", cnpj);
        const result = cnpjSchema.safeParse(cnpj);
        console.log("CNPJ validation result:", result);
        if (!result.success) {
            errors.cnpj = "O CNPJ informado não é válido, verifique o formato (XX.XXX.XXX/XXXX-XX) e os dígitos verificadores";
            isValid = false;
        }
    }

    return { isValid, errors: Object.keys(errors).length > 0 ? errors : undefined };
}
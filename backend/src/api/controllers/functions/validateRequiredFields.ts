export function validateRequiredFields(
    fields: {
        email?: string;
        password?: string;
        name?: string;
        username?: string;
        cnpj?: string;
    },
    requiredFields: string[] = ['email', 'name', 'username']
): boolean {
    return requiredFields.every(field => Boolean(fields[field as keyof typeof fields]));
}

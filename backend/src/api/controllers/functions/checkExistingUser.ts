import User from "@/db/models/userModel.ts";

async function checkExistingUser(email: string, username: string, cnpj?: string): Promise<boolean> {
    const user = await User.findOne({ $or: [{ email }, { username }, { cnpj }] });
    return Boolean(user);
}

export default checkExistingUser;
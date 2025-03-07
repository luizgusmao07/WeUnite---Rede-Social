import mongoose, { Document } from "mongoose";

interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    username: string;
    cnpj: string;
    email: string;
    password: string;
    profilePic: string;
    followers: string[];
    following: string[];
    bio: string;
    isFrozen: boolean;
    isVerified: boolean;
    isClub: boolean;
    savedOportunities: mongoose.Types.ObjectId[];
    resetPasswordToken?: string;
    resetPasswordExpiresAt?: Date;
    verificationToken?: string;
    verificationTokenExpiresAt?: Date;
}

export default IUser;
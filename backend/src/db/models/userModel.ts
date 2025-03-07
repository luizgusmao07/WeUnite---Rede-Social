import IUser from "../interfaces/userInterface.ts";
import mongoose, { Model, Schema } from "mongoose";

const userSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        cnpj: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        profilePic: {
            type: String,
            default: ""
        },
        followers: {
            type: [String],
            default: []
        },
        following: {
            type: [String],
            default: []
        },
        bio: {
            type: String,
            default: ""
        },
        isFrozen: {
            type: Boolean,
            default: false
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isClub: {
            type: Boolean,
            default: false
        },
        savedOportunities: [{
            type: Schema.Types.ObjectId,
            ref: "Oportunity"
        }],
        resetPasswordToken: {
            type: String
        },
        resetPasswordExpiresAt: {
            type: Date
        },
        verificationToken: {
            type: String
        },
        verificationTokenExpiresAt: {
            type: Date
        },
    },
    {
        timestamps: true,
    }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
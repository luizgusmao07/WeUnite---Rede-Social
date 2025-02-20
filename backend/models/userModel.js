import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        cnpj: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
        },
        profilePic: {
            type: String,
            default: "",
        },
        followers: {
            type: [String],
            default: [],
        },
        following: {
            type: [String],
            default: [],
        },
        bio: {
            type: String,
            default: "",
        },
        isFrozen: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isClub: {
            type: Boolean,
            default: false,
        },
        savedOportunities: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Oportunity',  // Referência ao modelo Oportunity
            }
        ],
        resetPasswordToken: String,
        resetPasswordExpiresAt: Date,
        verificationToken: String,
        verificationTokenExpiresAt: Date,
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;

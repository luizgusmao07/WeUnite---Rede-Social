import mongoose, { Document } from "mongoose";

interface IConversation extends Document {
    participants: mongoose.Types.ObjectId[];
    lastMessage: {
        text: string;
        sender: mongoose.Types.ObjectId;
        seen: boolean;
        createdAt: Date;
    };
}

export default IConversation;
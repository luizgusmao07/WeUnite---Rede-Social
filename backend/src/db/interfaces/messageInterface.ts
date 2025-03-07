import mongoose, { Document } from "mongoose";

interface IMessage extends Document {
    conversationId: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    text: string;
    seen: boolean;
    img?: string;
    video?: string;
    mediaType: string;
    createdAt: Date;
}

export default IMessage;
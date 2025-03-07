import mongoose, { Document } from "mongoose";

interface INotification extends Document {
    user: mongoose.Types.ObjectId;
    type: string;
    postId: mongoose.Types.ObjectId;
    triggeredBy: mongoose.Types.ObjectId;
    message: string;
    isRead: boolean;
    createdAt: Date;
}

export default INotification;
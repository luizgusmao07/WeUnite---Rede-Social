import mongoose, { Model, Schema } from "mongoose";
import INotification from "../interfaces/notificationInterface.ts";

const notificationSchema: Schema<INotification> = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['like', 'comment', 'follow', 'message'], // Incluindo os novos tipos
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    triggeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Notification: Model<INotification> = mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;

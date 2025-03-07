import mongoose, { Model, Schema } from "mongoose";
import IMessage from "../interfaces/messageInterface.ts";

const messageSchema: Schema<IMessage> = new Schema(
	{
		conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
		sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		text: String,
		seen: {
			type: Boolean,
			default: false,
		},
		img: {
			type: String,
			default: "",
		},
		video: {
			type: String,
			default: "",
		},
		mediaType: {
			type: String,
			enum: ['image', 'video', 'none'],
			default: 'none'
		},
	},
	{ timestamps: true }
);

const Message: Model<IMessage> = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
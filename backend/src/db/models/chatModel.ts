import mongoose, { Model, Schema } from "mongoose";
import IConversation from "../interfaces/conversationInterface.ts";

const conversationSchema: Schema<IConversation> = new Schema({
	participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	lastMessage: {
		text: String,
		sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		seen: {
			type: Boolean,
			default: false,
		},
	},
},
	{ timestamps: true }
);

const Conversation: Model<IConversation> = mongoose.model<IConversation>("Chat", conversationSchema );

export default Conversation;
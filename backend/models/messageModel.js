import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
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

const Message = mongoose.model("Message", messageSchema);

export default Message;
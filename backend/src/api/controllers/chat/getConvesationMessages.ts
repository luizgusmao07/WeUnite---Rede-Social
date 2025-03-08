import { AuthRequest } from "@/api/middlewares/authenticatedRequest.ts";
import Conversation from "@/db/models/chatModel.ts";
import Message from "@/db/models/messageModel.ts";
import { Response } from "express";

async function getConversationMessages(req: AuthRequest, res: Response): Promise<void> {
	const { otherUserId } = req.params;
	const userId = req.user!._id;
	try {
		const conversation = await Conversation.findOne({
			participants: { $all: [userId, otherUserId] },
		});

		if (!conversation) {
			res.status(404).json({ error: "Conversation not found" });
            return;
		}

		const messages = await Message.find({
			conversationId: conversation._id,
		}).sort({ createdAt: 1 });

		res.status(200).json(messages);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}

export default getConversationMessages;
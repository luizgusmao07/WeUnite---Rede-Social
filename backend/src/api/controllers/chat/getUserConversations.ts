import { AuthRequest } from "../../../api/middlewares/authenticatedRequest.ts";
import Conversation from "../../../db/models/chatModel.ts";
import { Response } from "express";

async function getUserConversations(req: AuthRequest, res: Response): Promise<void> {
	const userId = req.user!._id;
	try {
		const conversations = await Conversation.find({ participants: userId }).populate({
			path: "participants",
			select: "username profilePic",
		});

		//remove the current user from the participants array
		conversations.forEach(conversation => {
			conversation.participants = conversation.participants.filter(
				participant => participant._id.toString() !== userId.toString()
			)
		});
		res.status(200).json(conversations);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}

export default getUserConversations;
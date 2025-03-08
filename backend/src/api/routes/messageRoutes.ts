import express, { Response } from "express";
import { authenticatedRequest, AuthRequest } from "../middlewares/authenticatedRequest.ts";
import sendMessage from "../controllers/chat/sendMessage.ts";
import getUserConversations from "../controllers/chat/getUserConversations.ts";
import getConversationMessages from "../controllers/chat/getConvesationMessages.ts";

const router = express.Router();

//Send message
router.post("/", async (req: AuthRequest, res: Response) => {
    await sendMessage(req, res);
});

//Get user conversations
router.get("/conversations", authenticatedRequest, async (req: AuthRequest, res: Response) => {
    await getUserConversations(req, res);
});

//Get conversation messages
router.get("/:otherUserId", authenticatedRequest, async (req: AuthRequest, res: Response) => {
    await getConversationMessages(req, res);
});


export default router;
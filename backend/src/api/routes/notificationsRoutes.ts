import express, { Response } from "express";
import getUserNotifications from "../controllers/notifications/getUserNotifications.ts";
import { AuthRequest } from "../middlewares/authenticatedRequest.ts";
import markAsRead from "../controllers/notifications/markNotificationAsRead.ts";

const router = express.Router();

//Get user notifications
router.get("/", async (req: AuthRequest, res: Response) => {
    await getUserNotifications(req, res);
});

//Mark notification as read
router.put("/markAsRead", async (req: AuthRequest, res: Response) => {
    await markAsRead(req, res);
});


export default router;
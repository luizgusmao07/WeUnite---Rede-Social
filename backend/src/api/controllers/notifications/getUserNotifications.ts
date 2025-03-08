import { AuthRequest } from "@/api/middlewares/authenticatedRequest.ts";
import Notification from "@/db/models/notificationModel.ts";
import { Response } from 'express';

export const getUserNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const notifications = await Notification.find({ user: req.user!._id })
            .populate('triggeredBy', 'username profilePic')
            .sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export default getUserNotifications;
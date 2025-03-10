import { AuthRequest } from "../../../api/middlewares/authenticatedRequest.ts";
import Notification from "../../../db/models/notificationModel.ts";
import { Response } from 'express';

export const markAsRead = async (req: AuthRequest, res: Response) => {
    try {
        await Notification.updateMany(
            { user: req.user!._id, isRead: false },
            { $set: { isRead: true } }
        );
        res.status(200).json({ message: 'Notificações marcadas como lidas' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export default markAsRead;
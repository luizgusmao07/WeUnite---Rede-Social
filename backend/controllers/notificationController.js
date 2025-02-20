// controllers/notificationController.js
import Notification from '../models/notificationModel.js';

export const createNotification = async (user, type, postId = null, triggeredBy, message = '') => {
    try {
        const notificationMessage = {
            like: 'curtiu seu post',
            comment: 'comentou em seu post',
            follow: 'começou a seguir você',
            message: 'enviou uma nova mensagem'
        };

        const notification = new Notification({
            user,
            type,
            postId,
            triggeredBy,
            message: message || notificationMessage[type],
        });
        await notification.save();
    } catch (err) {
        console.error("Erro ao criar notificação:", err);
    }
};

export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .populate('triggeredBy', 'username profilePic')
            .sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );
        res.status(200).json({ message: 'Notificações marcadas como lidas' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

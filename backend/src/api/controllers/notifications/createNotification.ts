import Notification from "@/db/models/notificationModel.ts";

export const createNotification = async (
    user: string,
    type: 'like' | 'comment' | 'follow' | 'message',
    postId: string | null = null,
    triggeredBy: string,
    message: string = ''
) => {
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

export default createNotification;


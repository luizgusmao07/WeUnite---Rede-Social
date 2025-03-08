import { AuthRequest } from "@/api/middlewares/authenticatedRequest.ts";
import Conversation from "@/db/models/chatModel.ts";
import { Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import Message from "@/db/models/messageModel.ts";
import { getRecipientSocketId, io } from "@/api/http/socket.ts";

async function sendMessage(req: AuthRequest, res: Response): Promise<void> {
    try {
        const { recipientId, message } = req.body; // Adicionando video
        let { mediaUrl, mediaType } = req.body;
        const senderId = req.user!._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] },
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, recipientId],
                lastMessage: {
                    text: message,
                    sender: senderId,
                },
            });
            await conversation.save();
        }

        let uploadedUrl = null;

        if (mediaUrl) {
            const uploadOptions = {
                resource_type: (mediaType === 'video' ? 'video' : 'image') as 'video' | 'image' | 'raw' | 'auto',
                // Configurações específicas para vídeo
                ...(mediaType === 'video' && {
                    chunk_size: 6000000, // tamanho do chunk para upload
                    eager: [
                        { width: 720, height: 480, crop: "pad", audio_codec: "none" },
                        { width: 480, height: 320, crop: "pad", audio_codec: "none" }
                    ],
                    eager_async: true
                })
            };

            const uploadedResponse = await cloudinary.uploader.upload(mediaUrl, uploadOptions);
            uploadedUrl = uploadedResponse.secure_url;
        }

        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text: message,
            ...(mediaType === 'image' && { img: uploadedUrl }),
            ...(mediaType === 'video' && { video: uploadedUrl }),
            mediaType: mediaUrl ? mediaType : 'none'
        });

        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage: {
                    text: message,
                    sender: senderId,
                },
            }),
        ]);
        const recipientSocketId = getRecipientSocketId(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export default sendMessage;
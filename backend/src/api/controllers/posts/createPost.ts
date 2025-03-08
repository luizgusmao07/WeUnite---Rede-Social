import ICreatePostResponse from './interfaces/ICreatePostResponse.ts';
import Post from '@/db/models/postModel.ts';
import User from '@/db/models/userModel.ts';
import { v2 as cloudinary } from "cloudinary";
import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authenticatedRequest.ts';


// Define AuthenticatedRequest interface
const createPost = async (req: AuthRequest, res: Response<ICreatePostResponse>): Promise<void> => {
    try {
        const { postedBy, text } = req.body;
        let { mediaUrl, mediaType } = req.body;

        if (!postedBy || !text) {
            res.status(400).json({ success: false, message: "Postedby e texto são obrigatórios" });
            return;
        }

        const user = await User.findById(postedBy);
        if (!user) {
            res.status(404).json({ success: false, message: "Usuário não encontrado" });
            return;
        }

        if (!req.user) {
            res.status(401).json({ success: false, message: "Não autorizado a criar publicação" });
            return;
        }

        if (user._id.toString() !== req.user._id.toString()) {
            res.status(401).json({ success: false, message: "Não autorizado a criar publicação" });
            return;
        }

        const maxLength = 500;
        if (text.length > maxLength) {
            res.status(400).json({ success: false, message: `O texto deve ter menos que ${maxLength} caracteres` });
            return;
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

        const newPost = new Post({
            postedBy,
            text,
            ...(mediaType === 'image' && { img: uploadedUrl }),
            ...(mediaType === 'video' && { video: uploadedUrl }),
            mediaType: mediaUrl ? mediaType : 'none'
        });

        await newPost.save();

        // Format response according to ICreatePostResponse interface
        res.status(201).json({
            success: true,
            message: "Publicação criada com sucesso",
            post: {
                postedBy: newPost.postedBy.toString(),
                text: newPost.text,
                img: newPost.img,
                video: newPost.video,
                mediaType: newPost.mediaType
            }
        });
    } catch (err: any) {
        console.log(err);
        // Match error format with interface
        res.status(500).json({
            success: false,
            message: err.message || "Erro ao criar publicação"
        });
    }
};

export default createPost;
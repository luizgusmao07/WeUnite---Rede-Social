import { AuthRequest } from '@/api/middlewares/authenticatedRequest.ts';
import Post from '@/db/models/postModel.ts';
import User from '@/db/models/userModel.ts';
import { Response } from 'express';

const getFeedPosts = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const following = user.following;
        
        // Parâmetros de paginação
        const page = parseInt(req.query.page as string) || 1; // Página atual, padrão = 1
        const limit = 10; // Número fixo de 10 posts por página
        const skip = (page - 1) * limit; // Cálculo de quantos documentos pular
        
        // Buscar posts paginados
        const feedPosts = await Post.find({ postedBy: { $in: following } })
                                   .sort({ createdAt: -1 })
                                   .skip(skip)
                                   .limit(limit);
        
        // Contar total de posts para informações de paginação
        const totalPosts = await Post.countDocuments({ postedBy: { $in: following } });
        
        res.status(200).json({
            posts: feedPosts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message })
    }
};

export default getFeedPosts;

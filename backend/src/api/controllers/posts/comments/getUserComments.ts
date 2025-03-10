import { AuthRequest } from '../../../../api/middlewares/authenticatedRequest.ts';
import Post from '../../../../db/models/postModel.ts';
import User from '../../../../db/models/userModel.ts';
import { Response } from 'express';

const getUserComments = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { username } = req.params;

        // Encontrar o usuário pelo nome de usuário
        const user = await User.findOne({ username });
        if (!user) {
            res.status(404).json({ error: "Usuário não encontrado" });
            return;
        }

        // Encontrar todas as publicações que contêm comentários do usuário, excluindo suas próprias publicações
        const posts = await Post.find({
            'replies.userId': user._id,
            'postedBy': { $ne: user._id } // Filtra para publicações feitas por outros usuários
        });

        const postUserIds = [...new Set(posts.map(post => post.postedBy.toString()))];
        const postUsers = await User.find({ _id: { $in: postUserIds } });
        const postUsersMap = postUsers.reduce<Record<string, string>>((acc, user) => {
            acc[user._id.toString()] = user.username;
            return acc;
        }, {});

        // Extrair apenas os comentários do usuário de todas as publicações
        const userComments = posts.flatMap(post =>
            post.replies.filter(reply => reply.userId.toString() === user._id.toString())
                .map(reply => ({
                    postId: post._id,
                    commentId: reply._id,
                    text: reply.text,
                    profilePic: reply.userProfilePic,
                    postAuthorName: postUsersMap[post.postedBy.toString()] || 'Desconhecido',
                    createdAt: reply.createdAt
                }))
        );

        // Ordenar os comentários por data de criação (do mais recente para o mais antigo)
        userComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        res.status(200).json(userComments);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export default getUserComments;
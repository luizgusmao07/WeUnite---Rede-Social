import { AuthRequest } from "@/api/middlewares/authenticatedRequest.ts";
import Post from "@/db/models/postModel.ts";
import { Response } from 'express';

const deleteComment = async (req: AuthRequest, res: Response) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.user!._id;

        // Encontrar o post
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post não encontrado" });
        }

        // Encontrar o comentário
        const comment = post.replies.find(reply => reply._id.toString() === commentId);

        if (!comment) {
            return res.status(404).json({ error: "Comentário não encontrado" });
        }

        // Verificar se o usuário é o autor do comentário
        if (comment.userId.toString() !== userId.toString()) {
            return res.status(401).json({ error: "Não autorizado a excluir este comentário" });
        }

        // Remover o comentário
        post.replies = post.replies.filter(reply => reply._id.toString() !== commentId);

        // Salvar o post atualizado
        await post.save();

        res.status(200).json({ message: "Comentário excluído com sucesso" });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
}

export default deleteComment;
import { AuthRequest } from '@/api/middlewares/authenticatedRequest.ts';
import Post from '@/db/models/postModel.ts';
import { Response } from 'express';
import createNotification from '../notifications/createNotification.ts';

const likeUnlikePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id: postId } = req.params;

        const userId = req.user!._id;

        const post = await Post.findById(postId);

        if (!post) {
            res.status(404).json({ error: "Post não encontrado" });
            return
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            //Unlike post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })
            res.status(200).json({ message: "Curtida retirada" });

        } else {
            //Like post
            post.likes.push(userId);
            await post.save();
            res.status(200).json({ message: "Post curtido" });

            await createNotification(post.postedBy.toString(), 'like', postId, userId.toString());
        }
    } catch (err: any) {
        res.status(500).json({ error: err.message })
    }
};

export default likeUnlikePost;
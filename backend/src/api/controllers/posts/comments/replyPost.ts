import { AuthRequest } from '../../../../api/middlewares/authenticatedRequest.ts';
import Post from '../../../../db/models/postModel.ts';
import { Response } from 'express';
import { Types } from 'mongoose';
import createNotification from '../../notifications/createNotification.ts';

const replyPost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { text } = req.body;
        const postId = req.params.id;

       
        const userId = req.user!._id;
        const userProfilePic = req.user!.profilePic;
        const username = req.user!.username;

        if (!text) {
            res.status(400).json({ error: "Text field is required" });
            return;
        }

        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json({ error: "Post not found" });
            return;
        }

        const reply = { 
            _id: new Types.ObjectId(),
            userId, 
            text, 
            userProfilePic, 
            username,
            createdAt: new Date()
        };

        post.replies.push(reply);
        await post.save();

        await createNotification(post.postedBy.toString(), 'comment', postId, userId.toString());

        res.status(200).json(reply);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export default replyPost;
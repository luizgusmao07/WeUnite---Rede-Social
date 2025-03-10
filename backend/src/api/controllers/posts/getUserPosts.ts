import { Response } from 'express';
import Post from '../../../db/models/postModel.ts';
import User from '../../../db/models/userModel.ts';
import { AuthRequest } from '../../middlewares/authenticatedRequest.ts';

const getUserPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            res.status(404).json({ error: "Usuário não encontrado" });
            return;
        }

        const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export default getUserPosts;
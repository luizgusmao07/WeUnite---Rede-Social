import { AuthRequest } from '../../../api/middlewares/authenticatedRequest.ts';
import Post from '../../../db/models/postModel.ts';
import { Response } from 'express';

const getPost = async (req: AuthRequest, res: Response) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.status(200).json(post);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
        console.log(err)
    }
};

export default getPost;
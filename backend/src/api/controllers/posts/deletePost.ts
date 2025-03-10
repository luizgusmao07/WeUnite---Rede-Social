import { AuthRequest } from "../../../api/middlewares/authenticatedRequest.ts";
import Post from "../../../db/models/postModel.ts";
import { Response } from 'express';
import { v2 as cloudinary } from "cloudinary";

const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({ error: "Post not found" });
            return;
        }

        if (!req.user) {
            res.status(401).json({ error: "Você precisa estar logado para deletar um post " });
            return;
        }

        if (post.postedBy.toString() !== req.user._id.toString()) {
            res.status(401).json({ error: "Este post não é seu " });
            return;
        }

        if (post.img) {
            const imgId = post.img.split("/").pop()?.split(".")[0];
            if (imgId) {
                await cloudinary.uploader.destroy(imgId);
            }
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export default deletePost;

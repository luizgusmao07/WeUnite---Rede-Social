import express, { Response } from "express";
import createPost from "../controllers/posts/createPost.ts";
import { authenticatedRequest, AuthRequest } from "../middlewares/authenticatedRequest.ts";
import deletePost from "../controllers/posts/deletePost.ts";
import getPost from "../controllers/posts/getPost.ts";
import getFeedPosts from "../controllers/posts/getFeedPosts.ts";
import getUserPosts from "../controllers/posts/getUserPosts.ts";
import getUserComments from "../controllers/posts/comments/getUserComments.ts";
import deleteComment from "../controllers/posts/comments/deleteComment.ts";
import likeUnlikePost from "../controllers/posts/likeUnlikePost.ts";
import replyPost from "../controllers/posts/comments/replyPost.ts";


const router = express.Router();

//Create
router.post("/create-post", authenticatedRequest, async (req: AuthRequest, res: Response) => {
    await createPost(req, res);
});

//Get
router.get("/get-post/:id/", authenticatedRequest, async (req: AuthRequest, res: Response) => {
    await getPost(req, res);
});

//Delete
router.delete("/delete-post/:id/", authenticatedRequest, async (req: AuthRequest, res: Response) => {
    await deletePost(req, res);
});

//Get Feed Posts
router.get('/feed', authenticatedRequest, async (req: AuthRequest, res: Response) => {
    getFeedPosts(req, res);
});

//Get User Posts
router.get('/user-posts/:username', authenticatedRequest, async (req: AuthRequest, res: Response) => {
    getUserPosts(req, res);
});

//Get User Comments
router.get('/user-comments/:username', authenticatedRequest, async (req: AuthRequest, res: Response) => {
    getUserComments(req, res);
});

//Like post
router.put('/like-post/:id', authenticatedRequest, async (req: AuthRequest, res: Response) => {
    likeUnlikePost(req, res);
});

//Reply to post
router.put('/reply-post/:postId', authenticatedRequest, async (req: AuthRequest, res: Response) => {
    await replyPost(req, res);
});

//Delete Comment
router.delete('/delete-comment/:postId/:commentId', authenticatedRequest, async (req: AuthRequest, res: Response) => {
    deleteComment(req, res);
});





export default router;
import express from 'express'
import { createPost, deleteComment, deletePost, getFeedPosts, getPost, getUserComments, getUserPosts, likeUnlikePost, replyToPost } from '../controllers/postController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

router.get("/feed", protectRoute, getFeedPosts);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyToPost);
router.get('/user/:username/comments', getUserComments);
router.delete("/:postId/comments/:commentId", protectRoute, deleteComment);

export default router;
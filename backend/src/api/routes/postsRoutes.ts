import express, { Response } from "express";
import createPost from "../controllers/posts/createPost.ts";
import { authenticatedRequest, AuthRequest } from "../middlewares/authenticatedRequest.ts";
import deletePost from "../controllers/posts/deletePost.ts";


const router = express.Router();

//Create
router.post("/createPost", authenticatedRequest, async (req: AuthRequest, res: Response) => {
    await createPost(req, res);
});

router.delete("/delete-post/:id/", authenticatedRequest, async (req: AuthRequest, res: Response) => {
    await deletePost(req, res);
});



export default router;
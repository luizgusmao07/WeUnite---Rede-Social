import express, { Response } from "express";
import createPost from "../controllers/posts/createPost.ts";
import { authenticatedRequest, AuthRequest } from "../middlewares/authenticatedRequest.ts";


const router = express.Router();

//Create
router.post("/create", authenticatedRequest, async (req: AuthRequest, res: Response) => {
    await createPost(req, res);
});



export default router;
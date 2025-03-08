import express, { Response } from "express";
import { authenticatedRequest, AuthRequest } from "../middlewares/authenticatedRequest.ts";
import getUserProfile from "../controllers/user/getUserProfile.ts";
import updateUser from "../controllers/user/updateUser.ts";
import searchUsers from "../controllers/user/searchUsers.ts";
import followUnfollowUser from "../controllers/user/followUnfollowUser.ts";
import getSuggestedUsers from "../controllers/user/getSuggestedUsers.ts";

const router = express.Router();

//Get user profile
router.get("/profile/:id", authenticatedRequest, async (req: AuthRequest, res: Response) => {
    await getUserProfile(req, res);
});

//Update user profile
router.put("/update/:id", authenticatedRequest, async (req: AuthRequest, res: Response) => {
    await updateUser(req, res);
});

//Search users
router.get("/search", authenticatedRequest, async (req: AuthRequest, res: Response) => {
    await searchUsers(req, res);
});

//Get suggested users
router.get(/suggested/, authenticatedRequest, async (req: AuthRequest, res: Response) => {
    await getSuggestedUsers(req, res);
});

//Follow/Unfollow user
router.post("/follow/:id", authenticatedRequest, async (req: AuthRequest, res: Response) => {
    await followUnfollowUser(req, res);
});

export default router;
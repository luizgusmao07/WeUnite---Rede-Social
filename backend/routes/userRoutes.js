import express from "express";
import { followUnfollowUser, updateUser, getUserProfile, getSuggestedUsers, searchUsers, getFollowers, getFollowingUsers } from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.put("/update/:id", protectRoute, updateUser);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.get("/search", protectRoute, searchUsers);
router.get("/followers/:username", protectRoute, getFollowers);
router.get("/following/:username", protectRoute, getFollowingUsers);


export default router;
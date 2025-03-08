import { AuthRequest } from "@/api/middlewares/authenticatedRequest.ts";
import User from "@/db/models/userModel.ts";
import { Response } from 'express';


const getUserFollowing = async (req: AuthRequest, res: Response): Promise<void> => {

    try {
        const username = req.params.username;

        if (!username) {
            res.status(400).json({ error: "Username is required" });
            return;
        }

        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Find all users whose 'following' array contains the user's id
        const following = await User.find(
            { following: user._id },
            'name username profilePic'
        ).limit(10);


        res.status(200).json(following);
    } catch (error) {
        console.error("Error in getFollowing:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default getUserFollowing;
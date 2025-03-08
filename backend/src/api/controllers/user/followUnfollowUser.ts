import { AuthRequest } from "@/api/middlewares/authenticatedRequest.ts";
import User from "@/db/models/userModel.ts";
import createNotification from "../notifications/createNotification.ts";
import { Response } from "express";

const followUnfollowUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user!._id);

        if (id === req.user!._id.toString()) { 
            res.status(400).json({ error: "Você não pode seguir a si próprio" }) 
            return;
        }

        if (!userToModify || !currentUser) { 
            res.status(400).json({ error: "Usuário não encontrado" });
            return;}

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            //Unfollow user
            //Modify current user following, modify followers of userToModify
            await User.findByIdAndUpdate(req.user!._id, { $pull: { following: id } });
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user!._id } });
            res.status(200).json({ message: "Deixou de seguir" });
        } else {
            //Follow user
            await User.findByIdAndUpdate(req.user!._id, { $push: { following: id } });
            await User.findByIdAndUpdate(id, { $push: { followers: req.user!._id } });
            await createNotification(id, 'follow', null, currentUser.toString());
            res.status(200).json({ message: "Usuário seguido" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.log("Error in followUnfollowUser: ", error.message);
    }
};

export default followUnfollowUser
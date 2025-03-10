import { AuthRequest } from "../../middlewares/authenticatedRequest.ts";
import User from "../../../db/models/userModel.ts";
import { Response } from "express";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import Post from "../../../db/models/postModel.ts";

const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
	try {
		const { name, email, username, password, bio, userIsClub } = req.body;
		let { profilePic } = req.body;
		const userId = req.user!._id;

		let user = await User.findById(userId);
		if (!user) {
            res.status(400).json({ error: "Usuário não encontrado" });
            return;
        } 

		if (req.params.id !== userId.toString()){
            res.status(400).json({ error: "Você não pode atualizar o perfil de outro usuário" });
            return;
        }
			

		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

		if (profilePic) {
			if (user.profilePic) {
				await cloudinary.uploader.destroy(user.profilePic.split("/").pop()?.split(".")[0] || "");
			}
			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}


		user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;
		user.isClub = userIsClub || user.isClub;

		user = await user.save();

		await Post.updateMany(
			{ "replies.userId": userId },
			{
				$set: {
					"replies.$[reply].username": user.username,
					"replies.$[reply].userProfilePic": user.profilePic
				}
			},
			{
				arrayFilters: [{ "reply.userId": userId }]
			}
		)

		// password should be null in response
		user.password = "";

		res.status(200).json(user);

	} catch (err: any) {
		res.status(500).json({ error: err.message });
		console.log("Erro em updateUser: ", err.message);
	}
};

export default updateUser;
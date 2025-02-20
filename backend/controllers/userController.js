import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import { createNotification } from "./notificationController.js";

const getUserProfile = async (req, res) => {
	const { query } = req.params;
	try {
		let user;

		if (mongoose.Types.ObjectId.isValid(query)) {
			user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
		} else {
			user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
		}

		if (!user) return res.status(400).json({ error: "User not found" });

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in getUserProfile: ", err.message);
	}
}

const followUnfollowUser = async (req, res) => {
	try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === req.user._id.toString()) return res.status(400).json({ error: "Você não pode seguir a si próprio" });

		if (!userToModify || !currentUser) return res.status(400).json({ error: "Usuário não encontrado" });

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			//Unfollow user
			//Modify current user following, modify followers of userToModify
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			res.status(200).json({ message: "Deixou de seguir" });
		} else {
			//Follow user
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await createNotification(id, 'follow', null, currentUser);
			res.status(200).json({ message: "Usuário seguido" });
		}
	} catch (error) {
		res.status(500).json({ error: err.message });
		console.log("Error in followUnfollowUser: ", err.message);
	}
};

const updateUser = async (req, res) => {
	try {
		const { name, email, username, password, bio, userType } = req.body;
		let { profilePic } = req.body;
		const userId = req.user._id;

		let user = await User.findById(userId);
		if (!user) return res.status(400).json({ error: "User not found" });

		if (req.params.id !== userId.toString())
			return res.status(400).json({ error: "You cannot update other user's profile" });

		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

		if (profilePic) {
			if (user.profilePic) {
				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
			}
			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}

		user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;
		user.userType = userType || user.userType;

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
		user.password = null;

		res.status(200).json(user);

	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in updateUser: ", err.message);
	}
};

const getSuggestedUsers = async (req, res) => {
	try {
		const currentUserId = req.user._id;

		// Obter o usuário atual, incluindo os IDs dos usuários que ele já segue
		const currentUser = await User.findById(currentUserId).select('following').lean();

		// Obter usuários sugeridos, excluindo o próprio usuário e aqueles que ele já segue
		const suggestedUsers = await User.find({
			_id: {
				$ne: currentUserId,        // Exclui o próprio usuário
				$nin: currentUser.following // Exclui usuários que já são seguidos
			}
		})
			.limit(8) // Limita o número de sugestões, se desejado
			.lean();

		res.json(suggestedUsers);
	} catch (error) {
		res.status(500).json({ error: 'Erro ao buscar usuários sugeridos' });
	}
};


const searchUsers = async (req, res) => {
	try {
		const { query } = req.query;
		if (!query) {
			return res.status(400).json({ error: "Search query is required" });
		}

		const users = await User.find({
			username: { $regex: query, $options: "i" }
		})
			.limit(5)
			.select("username profilePic name");

		res.json(users);
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
};

const getFollowers = async (req, res) => {
	console.log("Params:", req.params);
	try {
		const username = req.params.username;

		if (!username) {
			return res.status(400).json({ error: "Username is required" });
		}

		// Find the user by username
		const user = await User.findOne({ username });

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		console.log("User found:", user._id);

		// Find all users whose 'following' array contains the user's id
		const followers = await User.find(
			{ followers: user._id },
			'name username profilePic'
		).limit(10);

		console.log("Followers found:", followers.length);

		res.json(followers);
	} catch (error) {
		console.error("Error in getFollowers:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const getFollowingUsers = async (req, res) => {
	console.log("Params:", req.params);
	try {
		const username = req.params.username;

		if (!username) {
			return res.status(400).json({ error: "Username is required" });
		}

		// Find the user by username
		const user = await User.findOne({ username });

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		console.log("User found:", user._id);

		// Find all users whose 'following' array contains the user's id
		const following = await User.find(
			{ following: user._id },
			'name username profilePic'
		).limit(10);

		console.log("Following found:", following.length);

		res.json(following);
	} catch (error) {
		console.error("Error in getFollowing:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export { followUnfollowUser, updateUser, getUserProfile, getSuggestedUsers, searchUsers, getFollowers, getFollowingUsers };
import { AuthRequest } from "@/api/middlewares/authenticatedRequest.ts";
import User from "@/db/models/userModel.ts";
import { Response } from 'express';

const searchUsers = async (req: AuthRequest, res: Response): Promise<void> => {
	try {
		const { query } = req.query;
		if (!query) {
			res.status(400).json({ error: "É preciso digitar algo" });
            return 
		}

		const users = await User.find({
			username: { $regex: query, $options: "i" }
		})
			.limit(5)
			.select("username profilePic name");

		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ error: "Erro em searchUsers" });
	}
};

export default searchUsers;
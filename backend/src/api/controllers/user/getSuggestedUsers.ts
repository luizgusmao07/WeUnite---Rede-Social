import { AuthRequest } from "../../../api/middlewares/authenticatedRequest.ts";
import User from "../../../db/models/userModel.ts";
import { Response } from 'express';

const getSuggestedUsers = async (req: AuthRequest, res: Response): Promise<void> => {
	try {
		const currentUserId = req.user!._id;

		// Obter o usuário atual, incluindo os IDs dos usuários que ele já segue
		const currentUser = await User.findById(currentUserId).select('following').lean();

		// Obter usuários sugeridos, excluindo o próprio usuário e aqueles que ele já segue
		const suggestedUsers = await User.find({
			_id: {
				$ne: currentUserId,        // Exclui o próprio usuário
				$nin: currentUser!.following // Exclui usuários que já são seguidos
			}
		})
			.limit(8) // Limita o número de sugestões, se desejado
			.lean();

		res.status(200).json(suggestedUsers);
	} catch (error) {
		res.status(500).json({ error: 'Erro ao buscar usuários sugeridos' });
	}
};

export default getSuggestedUsers;
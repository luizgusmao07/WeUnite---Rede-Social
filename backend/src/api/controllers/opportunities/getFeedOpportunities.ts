import { AuthRequest } from '../../../api/middlewares/authenticatedRequest.ts';
import Oportunity from '../../../db/models/oportunityModel.ts';
import User from '../../../db/models/userModel.ts';
import { Response } from 'express';

const getFeedOpportunities = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.user!._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const following = user.following;

        // Parâmetros de paginação
        const page = parseInt(req.query.page as string) || 1; // Página atual, padrão = 1
        const limit = 10; // Número fixo de 10 posts por página
        const skip = (page - 1) * limit; // Cálculo de quantos documentos pular

        // Buscar posts paginados
        const feedOpportunities = await Oportunity.find({ postedBy: { $in: following } })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Contar total de posts para informações de paginação
        const totalOpportunities = await Oportunity.countDocuments({ postedBy: { $in: following } });

        return res.status(200).json({
            posts: feedOpportunities,
            currentPage: page,
            totalPages: Math.ceil(totalOpportunities / limit),
            totalOpportunities
        });
    } catch (err: any) {
        return res.status(500).json({ error: err.message })
    }
};

export default getFeedOpportunities;

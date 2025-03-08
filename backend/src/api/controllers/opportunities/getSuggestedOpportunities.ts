import { AuthRequest } from "@/api/middlewares/authenticatedRequest.ts";
import Oportunity from "@/db/models/oportunityModel.ts";
import { Response } from 'express';

const getSuggestedOportunities = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!._id;

        // Obtendo três oportunidades aleatórias, exceto as criadas pelo usuário atual
        const oportunities = await Oportunity.aggregate([
            { $match: { postedBy: { $ne: userId } } },
            { $sample: { size: 3 } }
        ]);

        res.status(200).json(oportunities);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
};

export default getSuggestedOportunities
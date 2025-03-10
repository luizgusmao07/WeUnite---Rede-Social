import { Response } from 'express';
import Oportunity from '../../../db/models/oportunityModel.ts';
import User from '../../../db/models/userModel.ts';
import { AuthRequest } from '../../../api/middlewares/authenticatedRequest.ts';

const getUserOpportunities = async (req: AuthRequest, res: Response): Promise<void> => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            res.status(404).json({ error: "Usuário não encontrado" });
            return;
        }

        const opportunities = await Oportunity.find({ postedBy: user._id }).sort({ createdAt: -1 });

        res.status(200).json(opportunities);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export default getUserOpportunities;
import { AuthRequest } from "../../../api/middlewares/authenticatedRequest.ts";
import Oportunity from "../../../db/models/oportunityModel.ts";
import { Response } from 'express';

const getOpportunity = async (req: AuthRequest, res: Response) => {
    try {
        const oportunity = await Oportunity.findById(req.params.id)

        if (!oportunity) {
            return res.status(404).json({ error: "Oportunidade não encontrado" });
        }

        res.status(200).json(oportunity);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
        console.log(err)
    }
};

export default getOpportunity;
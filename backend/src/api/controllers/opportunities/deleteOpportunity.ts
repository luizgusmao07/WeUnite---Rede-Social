import { AuthRequest } from "../../../api/middlewares/authenticatedRequest.ts";
import { Response } from 'express';
import { v2 as cloudinary } from "cloudinary";
import Oportunity from "../../../db/models/oportunityModel.ts";

const deleteOpportunity = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const opportunity = await Oportunity.findById(req.params.id);
        if (!opportunity) {
            res.status(404).json({ error: "Oportunidade não encontrada" });
            return;
        }

        if (!req.user) {
            res.status(401).json({ error: "Você precisa estar logado para deletar uma oportunidade" });
            return;
        }

        if (opportunity.postedBy.toString() !== req.user._id.toString()) {
            res.status(401).json({ error: "Esta oportunidade não é seu " });
            return;
        }

        if (opportunity.img) {
            const imgId = opportunity.img.split("/").pop()?.split(".")[0];
            if (imgId) {
                await cloudinary.uploader.destroy(imgId);
            }
        }

        await Oportunity.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Oportunidade deletada" });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export default deleteOpportunity;

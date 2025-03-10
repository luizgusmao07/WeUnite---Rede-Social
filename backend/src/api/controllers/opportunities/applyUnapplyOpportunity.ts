import { AuthRequest } from "../../../api/middlewares/authenticatedRequest.ts";
import Oportunity from "../../../db/models/oportunityModel.ts";
import { Response } from 'express';

const applyUnapplyOportunity = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const oportunityId = req.params.id;
        const userId = req.user!._id;

        const oportunity = await Oportunity.findById(oportunityId);
        if (!oportunity) {
            return res.status(404).json({ error: "Oportunidade não encontrada" });
        }

        if (oportunity.postedBy.toString() === userId.toString()) {
            return res.status(400).json({ error: "Você não pode se inscrever na sua própria oportunidade" });
        }

        const userAppliedIndex = oportunity.applications.indexOf(userId);

        if (userAppliedIndex !== -1) {
            // User has already applied, so unapply
            oportunity.applications.splice(userAppliedIndex, 1);
            await oportunity.save();
            return res.status(200).json({ message: "Inscrição cancelada com sucesso", applied: false });
        } else {
            // User hasn't applied, so apply
            oportunity.applications.push(userId);
            await oportunity.save();
            return res.status(200).json({ message: "Inscrição realizada com sucesso", applied: true });
        }
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};

export default applyUnapplyOportunity;
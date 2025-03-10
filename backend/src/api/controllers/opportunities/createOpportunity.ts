import { AuthRequest } from "../../../api/middlewares/authenticatedRequest.ts";
import Oportunity from "../../../db/models/oportunityModel.ts";
import User from "../../../db/models/userModel.ts";
import { v2 as cloudinary } from "cloudinary"
import { Response } from 'express';


const createOpportunity = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { postedBy, title, text, applicationDeadline, location, maxApplications } = req.body;
        let { img } = req.body;

        if (!postedBy || !text || !title || !applicationDeadline || !location || !maxApplications) {
            res.status(400).json({ error: "Preencha os campos obrigatórios" });
            return;
        }

        const user = await User.findById(postedBy);
        if (!user) {
            res.status(404).json({ error: "Usuário não encontrado" });
            return;
        }

        if (user._id.toString() !== req.user!._id.toString()) {
            res.status(401).json({ error: "É preciso estar logado para criar uma oportunidade" });
            return;
        }

        // Check if the user is of type 'Clube'
        if (!user.isClub) {
            res.status(403).json({ error: "Apenas clubes podem postar oportunidades" });
            return;
        }

        const maxLengthText = 500;
        const maxLengthTitle = 50;
        if (text.length > maxLengthText) {
            res.status(400).json({ error: `O texto deve ter menos que ${maxLengthText} caracteres` });
            return;
        }

        if (title.length > maxLengthTitle) {
            res.status(400).json({ error: `O texto deve ter menos que ${maxLengthTitle} caracteres` });
            return;
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newOportunity = new Oportunity({ postedBy, title, text, img, applicationDeadline, location, maxApplications });
        await newOportunity.save();
        res.status(201).json(newOportunity);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
        console.log(err)
    }
};

export default createOpportunity;
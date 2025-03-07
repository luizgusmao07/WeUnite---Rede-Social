import User from "../models/userModel.js";
import Oportunity from "../models/oportunityModel.js";
import { v2 as cloudinary } from "cloudinary"

const createOportunity = async (req, res) => {
    try {
        const { postedBy, title, text, applicationDeadline, location, maxApplications } = req.body;
        let { img } = req.body;

        if (!postedBy || !text || !title || !applicationDeadline || !location || !maxApplications) {
            return res.status(400).json({ error: "Postedby, text and title fields are required" })
        }

        const user = await User.findById(postedBy);
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Unauthorized to create post" })
        }

        // Check if the user is of type 'Clube'
        if (!user.isClub) {
            return res.status(403).json({ error: "Only Clube users can create opportunities" })
        }

        const maxLengthText = 500;
        const maxLengthTitle = 50;
        if (text.length > maxLengthText) {
            return res.status(400).json({ error: `Text must be less than ${maxLengthText} characters` })
        }

        if (title.length > maxLengthTitle) {
            return res.status(400).json({ error: `Text must be less than ${maxLengthTitle} characters` })
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newOportunity = new Oportunity({ postedBy, title, text, img, applicationDeadline, location, maxApplications });
        await newOportunity.save();
        res.status(201).json(newOportunity);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err)
    }
};

const getOportunity = async (req, res) => {
    try {
        const oportunity = await Oportunity.findById(req.params.id)

        if (!oportunity) {
            return res.status(404).json({ error: "Oportunity not found" });
        }

        res.status(200).json(oportunity);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err)
    }
};

const deleteOportunity = async (req, res) => {
    try {
        const oportunity = await Oportunity.findById(req.params.id);
        if (!oportunity) {
            return res.status(404).json({ error: "Oportunity not found" });
        }

        if (oportunity.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Unauthorized to delete oportunity " });
        }

        if (oportunity.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Oportunity.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Oportunity deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const likeUnlikeOportunity = async (req, res) => {
    try {
        const { id: oportunityId } = req.params;
        const userId = req.user._id;

        const oportunity = await Oportunity.findById(oportunityId);

        if (!oportunity) {
            return res.status(404).json({ error: "Oportunity not found" });
        }

        const userLikedOportunity = oportunity.likes.includes(userId);

        if (userLikedOportunity) {
            //Unlike Oportunity
            await Oportunity.updateOne({ _id: oportunityId }, { $pull: { likes: userId } })
            res.status(200).json({ message: "Oportunity unliked successfully" });

        } else {
            //Like Oportunity
            oportunity.likes.push(userId);
            await oportunity.save();
            res.status(200).json({ message: "Oportunity liked successfully" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
};

const replyToOportunity = async (req, res) => {
    try {
        const { text } = req.body;
        const oportunityId = req.params.id;
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        if (!text) {
            return res.status(400).json({ error: "Text field is required" });
        }

        const oportunity = await Oportunity.findById(oportunityId);
        if (!oportunity) {
            return res.status(404).json({ error: "Oportunity not found" });
        }

        const reply = { userId, text, userProfilePic, username };

        oportunity.replies.push(reply);
        await oportunity.save();

        res.status(200).json(reply);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// const getFeedOportunities = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(400).json({ error: "User not found" });
//         }

//         const following = user.following;

//         const feedOportunities = await Oportunity.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

//         res.status(200).json(feedOportunities);
//     } catch (err) {
//         res.status(500).json({ error: err.message })
//     }
// };

const getFeedOportunities = async (req, res) => {
    try {
        // Buscar todas as oportunidades, ordenadas por data de criação
        const feedOportunities = await Oportunity.find().sort({ createdAt: -1 });

        res.status(200).json(feedOportunities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getUserOportunities = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const oportunities = await Oportunity.find({ postedBy: user._id }).sort({ createdAt: -1 });

        res.status(200).json(oportunities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// const getSuggestedOportunities = async (req, res) => {
//     try {
//         const userId = req.user._id;

//         // Obtendo todas as oportunidades, exceto as criadas pelo usuário atual
//         const oportunities = await Oportunity.find({ postedBy: { $ne: userId } }).sort({ createdAt: -1 });

//         res.status(200).json(oportunities);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Server error. Please try again later." });
//     }

// };

const getSuggestedOportunities = async (req, res) => {
    try {
        const userId = req.user._id;

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

const applyToOportunity = async (req, res) => {
    try {
        const oportunityId = req.params.id;
        const userId = req.user._id;

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
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const saveUnsaveOportunity = async (req, res) => {
    try {
        const oportunityId = req.params.id;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        const oportunity = await Oportunity.findById(oportunityId);
        if (!oportunity) {
            return res.status(404).json({ error: "Oportunidade não encontrada" });
        }

        const isSaved = user.savedOportunities.includes(oportunityId);

        if (isSaved) {
            // Remove a oportunidade dos salvos
            await User.findByIdAndUpdate(userId, { $pull: { savedOportunities: oportunityId } });
            res.status(200).json({ message: "Oportunidade removida dos salvos", isSaved: false });
        } else {
            // Adiciona a oportunidade aos salvos
            await User.findByIdAndUpdate(userId, { $push: { savedOportunities: oportunityId } });
            res.status(200).json({ message: "Oportunidade salva com sucesso", isSaved: true });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error in saveUnsaveOportunity: ", error.message);
    }
};

const checkIfSaved = async (req, res) => {
    try {
        const oportunityId = req.params.id; // ID da oportunidade
        const userId = req.user._id; // ID do usuário autenticado

        // Busca o usuário no banco de dados
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        // Verifica se a oportunidade está na lista de oportunidades salvas do usuário
        const isSaved = user.savedOportunities.includes(oportunityId);

        // Retorna a resposta ao frontend com o estado de 'isSaved'
        res.status(200).json({ isSaved });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error in checkIfSaved: ", error.message);
    }
};

const getSavedOportunities = async (req, res) => {
    try {
        const { username } = req.params; // Recebe o username dos parâmetros da rota
        const user = await User.findOne({ username }); // Busca o usuário pelo username

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        // Busca as oportunidades salvas pelo usuário
        const savedOportunities = await Oportunity.find({
            _id: { $in: user.savedOportunities },
        });

        console.log("Oportunidades salvas:", savedOportunities); // Adicione este log

        res.status(200).json(savedOportunities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAppliedOportunities = async (req, res) => {
    try {
        const { username } = req.params;
        
        // Find the user first
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        // Find opportunities where the user has applied
        const appliedOportunities = await Oportunity.find({
            applications: user._id
        }).sort({ createdAt: -1 });

        res.status(200).json(appliedOportunities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getOpportunityApplicants = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the opportunity first
        const opportunity = await Oportunity.findById(id);
        if (!opportunity) {
            return res.status(404).json({ error: "Oportunidade não encontrada" });
        }

        // Find users who applied to this opportunity
        const applicants = await User.find({
            _id: { $in: opportunity.applications }
        }).select('-password'); // exclude password

        res.status(200).json(applicants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { createOportunity, getOportunity, deleteOportunity, likeUnlikeOportunity, replyToOportunity, getFeedOportunities, getUserOportunities, getSuggestedOportunities, applyToOportunity, saveUnsaveOportunity, checkIfSaved, getSavedOportunities }
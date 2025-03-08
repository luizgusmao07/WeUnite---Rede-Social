import express, { Response } from "express";
import createOpportunity from "../controllers/opportunities/createOpportunity.ts";
import getSuggestedOpportunities from "../controllers/opportunities/getSuggestedOpportunities.ts";
import { authenticatedRequest, AuthRequest } from "../middlewares/authenticatedRequest.ts";

const router = express.Router();

//Create
router.post("/create-opportunity", authenticatedRequest, async (req: AuthRequest, res: Response) => {
    await createOpportunity(req, res);
});

//Get suggested opportunities
router.get('/suggested-opportunities', authenticatedRequest, async (req: AuthRequest, res: Response) => {
    getSuggestedOpportunities(req, res);
});

export default router;
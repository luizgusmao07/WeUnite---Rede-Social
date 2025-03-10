import express, { Response } from "express";
import createOpportunity from "../controllers/opportunities/createOpportunity.ts";
import getSuggestedOpportunities from "../controllers/opportunities/getSuggestedOpportunities.ts";
import { authenticatedRequest, AuthRequest } from "../middlewares/authenticatedRequest.ts";
import deleteOpportunity from "../controllers/opportunities/deleteOpportunity.ts";
import getOpportunity from "../controllers/opportunities/getOpportunity.ts";
import getFeedOpportunities from "../controllers/opportunities/getFeedOpportunities.ts";

const router = express.Router();

//Create opportunity
router.post("/create-opportunity", authenticatedRequest, async (req: AuthRequest, res: Response) => {
    await createOpportunity(req, res);
});

//Get opportunity
router.get("/get-opportunity/:id", authenticatedRequest, async (req: AuthRequest, res: Response) => {
    await getOpportunity(req, res);
});

//Delete opportunity
router.delete("/delete-opportunity/:id", authenticatedRequest, async (req: AuthRequest, res: Response) => {
    await deleteOpportunity(req, res);
});

//Get feed opportunities
router.get('/feed-opportunities', authenticatedRequest, async (req: AuthRequest, res: Response) => {
    getFeedOpportunities(req, res);
});

//Get suggested opportunities
router.get('/suggested-opportunities', authenticatedRequest, async (req: AuthRequest, res: Response) => {
    getSuggestedOpportunities(req, res);
});

export default router;
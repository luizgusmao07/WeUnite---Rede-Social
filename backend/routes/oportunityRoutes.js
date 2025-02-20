import express from 'express'
import { createOportunity, deleteOportunity, getFeedOportunities, getOportunity,  getUserOportunities, likeUnlikeOportunity, replyToOportunity, getSuggestedOportunities, applyToOportunity, saveUnsaveOportunity, checkIfSaved, getSavedOportunities } from '../controllers/oportunityController.js';
import protectRoute from '../middlewares/protectRoute.js';
import {getAppliedOportunities } from '../controllers/oportunityController.js';
import { getOpportunityApplicants } from '../controllers/oportunityController.js';

const router = express.Router();

router.post("/create", protectRoute, createOportunity);
router.get("/feed", protectRoute , getFeedOportunities);
router.get("/user/:username", getUserOportunities);
router.get("/suggested", protectRoute, getSuggestedOportunities);
router.delete("/:id", protectRoute, deleteOportunity);
router.get("/:id", getOportunity);
router.put("/like/:id", protectRoute, likeUnlikeOportunity);
router.put("/reply/:id", protectRoute, replyToOportunity);
router.post("/apply/:id", protectRoute, applyToOportunity);
router.post('/save/:id', protectRoute, saveUnsaveOportunity);
router.get('/saved/:id', protectRoute, checkIfSaved);
router.get('/saved-oportunities/:username', protectRoute, getSavedOportunities);
router.get('/applied-oportunities/:username', protectRoute, getAppliedOportunities);
router.get('/:id/applicants', protectRoute, getOpportunityApplicants);
export default router;
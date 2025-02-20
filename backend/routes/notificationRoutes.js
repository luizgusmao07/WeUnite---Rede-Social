// routes/notificationRoutes.js
import express from 'express';
import { getUserNotifications, markAsRead } from '../controllers/notificationController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

router.get('/', protectRoute, getUserNotifications);
router.put('/read', protectRoute, markAsRead);

export default router;

import express from "express";
import { checkAuth, forgotPassword, login, logout, resetPassword, signup, verifyEmail, verifyForgotPasswordCode, googleLogin, signupcompany, signupcompanysolicitation } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post('/google-login', googleLogin);
router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/signupcompany", signupcompany);
router.post("/signupcompanysolicitation", signupcompanysolicitation);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);
router.post("/verify-reset-code", verifyForgotPasswordCode)

export default router;
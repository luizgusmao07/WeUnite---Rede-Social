import express, { Request, Response } from "express";
import { signup } from "../controllers/auth/signup/signUpController.ts";
import { signupcompanysolicitation } from "../controllers/auth/signup/signUpCompanySolicitationController.ts";
import { signupcompany } from "../controllers/auth/signup/signUpCompanyController.ts";
import { login } from "../controllers/auth/login/login.ts";
import { verifyEmail } from "../controllers/auth/verifications/verifyEmail.ts";
import { verifyResetPasswordCode } from "../controllers/auth/verifications/verifyResetPasswordCode.ts";
import { forgotPassword } from "../controllers/auth/password-operations/forgotPassword.ts";
import { resetPassword } from "../controllers/auth/password-operations/resetPassword.ts";
import { logout } from "../controllers/auth/login/logout.ts";



const router = express.Router();

//Signup
router.post("/signup", async (req: Request, res: Response) => {
	await signup(req, res);
});
router.post("/signupcompanysolicitation", async (req: Request, res: Response) => {
	await signupcompanysolicitation(req, res);
});
router.post("/signupcompany", async (req: Request, res: Response) => {
	await signupcompany(req, res);
})

//Login e logout
router.post("/login", async (req: Request, res: Response) => {
	await login(req, res);
});

router.post("/logout", async (req: Request, res: Response) => {
	await logout(req, res);
});

//Verificações
router.post("/verify-email", async (req: Request, res: Response) => {
	await verifyEmail(req, res);
})

router.post("/verify-reset-code", async (req: Request, res: Response) => {
	await verifyResetPasswordCode(req, res);
})

//Password Operations
router.post("/forgot-password", async (req: Request, res: Response) => {
	await forgotPassword(req, res);
})

router.post("/reset-password/:token", async (req: Request, res: Response) => {
	await resetPassword(req, res);
})

export default router; 
import express, { Request, Response } from "express";
import { signup } from "../controllers/auth/signup/signUpController.ts";
import { signupcompanysolicitation } from "../controllers/auth/signup/signUpCompanySolicitationController.ts";
import { signupcompany } from "../controllers/auth/signup/signUpCompanyController.ts";
import { login } from "../controllers/auth/login/login.ts";



const router = express.Router();

//Signup
router.post("/signup", async (req: Request, res: Response ) => {
	await signup(req, res);
});
router.post("/signupcompanysolicitation", async (req: Request, res: Response ) => {
	await signupcompanysolicitation(req, res);
});
router.post("/signupcompany", async (req: Request, res: Response) => {
	await signupcompany(req, res);
})

//Login
router.post("/login", async (req: Request, res: Response) => {
	await login(req, res);
});

export default router; 
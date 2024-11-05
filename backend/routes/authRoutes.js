import express from 'express';
import {Signup,Login, loginWithGithub, loginWithGoogle} from "../controllers/authController.js";


const router =express.Router();

router.post("/signup",Signup);
router.post("/login",Login);
router.post("/loginWithGithub",loginWithGithub);
router.get('/loginWithGoogle',loginWithGoogle);
export default router;
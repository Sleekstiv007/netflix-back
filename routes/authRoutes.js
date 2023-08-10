import { Router } from "express";
import authController from "../controllers/authController.js";

const router = Router();

router.post("/sign-up", authController.signup);

router.post("/login", authController.login);

router.get("/logout", authController.logout);

router.post("/profile", authController.editProfile);

router.post("/get-profile", authController.getProfile);

router.post("/forgot-password/:log", authController.sendPassword);


router.post("/changePassword", authController.changePassword);

export default router;


//https://busy-blue-spider-wrap.cyclic.app

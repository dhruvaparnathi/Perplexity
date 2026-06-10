import express from "express";
import { registerController, verifyEmailController, loginController, getMeController } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidator, registerController);
authRouter.get("/verify-email/:token", verifyEmailController);
authRouter.post("/login", loginValidator, loginController);
authRouter.get("/me", authMiddleware, getMeController);

export default authRouter;
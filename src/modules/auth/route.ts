import { Router } from "express";
import authController from "./controller";
import authMiddleware from "./middleware";

const authRouter = Router();

authRouter.post("/login", authMiddleware.validateLogin, authController.login);
authRouter.patch(
  "/credentials",
  authMiddleware.requireAuth,
  authMiddleware.validateChangeCredentials,
  authController.changeCredentials
);

export default authRouter;

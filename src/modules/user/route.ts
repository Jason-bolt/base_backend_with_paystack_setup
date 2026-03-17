import { Router } from "express";
import userController from "./controller";
import userMiddleware from "./middleware";

const userRouterV1 = Router();

userRouterV1.post(
  "/signup",
  userMiddleware.validateCreateUser,
  userMiddleware.isUniqueUser,
  userController.signUpUser
);

userRouterV1.post(
  "/login",
  userMiddleware.validateLoginUser,
  userController.loginUser
);

userRouterV1.post(
  "/initiate_password_reset",
  userMiddleware.doesUserExistByEmail,
  userController.initiatePasswordReset
);

userRouterV1.post(
  "/reset_password",
  userMiddleware.confirmResetPasswordToken,
  userMiddleware.validatePasswords,
  userController.resetPassword
);
// baseRouter.get("/read", userController.read);
// baseRouter.put("/update", userController.update);
// baseRouter.delete("/delete", userController.delete);

export default userRouterV1;

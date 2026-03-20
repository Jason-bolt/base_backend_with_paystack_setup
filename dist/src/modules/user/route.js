"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const middleware_1 = __importDefault(require("./middleware"));
const userRouterV1 = (0, express_1.Router)();
userRouterV1.post("/signup", middleware_1.default.validateCreateUser, middleware_1.default.isUniqueUser, controller_1.default.signUpUser);
userRouterV1.post("/login", middleware_1.default.validateLoginUser, controller_1.default.loginUser);
userRouterV1.post("/initiate_password_reset", middleware_1.default.doesUserExistByEmail, controller_1.default.initiatePasswordReset);
userRouterV1.post("/reset_password", middleware_1.default.confirmResetPasswordToken, middleware_1.default.validatePasswords, controller_1.default.resetPassword);
// baseRouter.get("/read", userController.read);
// baseRouter.put("/update", userController.update);
// baseRouter.delete("/delete", userController.delete);
exports.default = userRouterV1;

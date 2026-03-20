"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("../service"));
const logger_1 = __importDefault(require("../../../../utils/logger"));
const userEmails_1 = require("../../../../utils/helpers/emailTemplates/userEmails");
const queue_1 = require("../../../../config/queue");
class UserController {
    constructor(service) {
        this.service = service;
        this.signUpUser = async (req, res) => {
            try {
                const userData = req.body;
                logger_1.default.info(`User data: ${JSON.stringify(userData)}`);
                const user = await this.service.signUpUser(req.body);
                delete user.password;
                await (0, queue_1.sendEmail)({
                    to: user.email,
                    subject: "Welcome to our app",
                    text: "Welcome to our app",
                    html: (0, userEmails_1.userSignupEmail)(user.name),
                });
                return res.status(201).json({
                    success: true,
                    message: "User created successfully",
                    data: user,
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: `Failed to create user: ${error.message}`,
                    error: {
                        message: error.message,
                        stack: error.stack,
                    },
                });
            }
        };
        this.loginUser = async (req, res) => {
            try {
                const { email } = req?.body;
                const { token } = await this.service.loginUser(email.trim());
                return res.status(200).json({
                    success: true,
                    message: "User logged in successfully",
                    data: {
                        token,
                    },
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: `Failed to login user: ${error.message}`,
                    error: {
                        message: error.message,
                        stack: error.stack,
                    },
                });
            }
        };
        this.initiatePasswordReset = async (req, res) => {
            try {
                const { email } = req?.body;
                const passwordToken = await this.service.initiatePasswordReset(email.trim());
                // await sendEmail({
                //   to: email,
                //   subject: "Welcome to our app",
                //   text: "Welcome to our app",
                //   html: initiatePasswordResetEmail(user.name),
                // });
                return res.status(200).json({
                    success: true,
                    message: "Password reset initiated",
                    data: {
                        passwordToken,
                    },
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: `Failed to initiate password reset: ${error.message}`,
                    error: {
                        message: error.message,
                        stack: error.stack,
                    },
                });
            }
        };
        this.resetPassword = async (req, res) => {
            try {
                const { password } = req?.body;
                const email = req.userEmail;
                const userData = await this.service.resetPassword(email.trim(), password.trim());
                delete userData.password;
                // await sendEmail({
                //   to: email,
                //   subject: "Welcome to our app",
                //   text: "Welcome to our app",
                //   html: resetPasswordEmail(user.name),
                // });
                return res.status(200).json({
                    success: true,
                    message: "Password has been reset successfully!",
                    data: {
                        userData,
                    },
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: `Failed to reset password: ${error.message}`,
                    error: {
                        message: error.message,
                        stack: error.stack,
                    },
                });
            }
        };
    }
}
const userController = new UserController(service_1.default);
exports.default = userController;

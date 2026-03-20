"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../../../config/db/schemas/User");
const db_1 = __importDefault(require("../../../../config/db"));
const drizzle_orm_1 = require("drizzle-orm");
const user_1 = require("../../../../config/zod/schemas/user");
const logger_1 = __importDefault(require("../../../../utils/logger"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const redis_1 = require("../../../../utils/helpers/redis");
const general_1 = require("../../../../utils/helpers/general");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envs_1 = __importDefault(require("../../../../config/envs"));
class UserMiddleware {
    async validateCreateUser(req, res, next) {
        const validationResult = user_1.createUserSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: validationResult.error.issues
                    .map((issue) => issue.message)
                    .join(", "),
            });
        }
        return next();
    }
    async isUniqueUser(req, res, next) {
        const { email } = req.body;
        if (!email.trim()) {
            return res.status(400).json({
                success: false,
                message: "Email is required field!",
            });
        }
        const user = await db_1.default
            .select()
            .from(User_1.usersTable)
            .where((0, drizzle_orm_1.eq)(User_1.usersTable.email, email.trim()))
            .limit(1);
        logger_1.default.info(`Existing user: ${JSON.stringify(user)}`);
        if (user[0]) {
            return res.status(400).json({
                success: false,
                message: "User already exists!",
            });
        }
        return next();
    }
    async validateLoginUser(req, res, next) {
        const { email: passedEmail, password: passedPassword } = req.body;
        const email = passedEmail.trim();
        const password = passedPassword?.trim();
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required fields!",
            });
        }
        let userData = null;
        const redisData = await (0, redis_1.getRedisData)(email);
        if (!redisData) {
            const user = await db_1.default
                .select()
                .from(User_1.usersTable)
                .where((0, drizzle_orm_1.eq)(User_1.usersTable.email, email))
                .limit(1);
            await (0, redis_1.setRedisData)(`users:email:${email}`, user);
            userData = (0, general_1.camelize)(user[0]);
        }
        logger_1.default.info(`Existing user: ${JSON.stringify(userData)}`);
        if (!userData) {
            return res.status(400).json({
                success: false,
                message: "Email or password is incorrect!",
            });
        }
        if (!(await bcrypt_1.default.compare(password, userData.password || ""))) {
            return res.status(400).json({
                success: false,
                message: "Email or password is incorrect!",
            });
        }
        return next();
    }
    async doesUserExistByEmail(req, res, next) {
        const { email: passedEmail } = req.body;
        const email = passedEmail.trim();
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required!",
            });
        }
        const user = await db_1.default
            .select()
            .from(User_1.usersTable)
            .where((0, drizzle_orm_1.eq)(User_1.usersTable.email, email))
            .limit(1);
        logger_1.default.info(`Existing user: ${JSON.stringify(user)}`);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist!",
            });
        }
        return next();
    }
    async confirmResetPasswordToken(req, res, next) {
        try {
            const { reset_token: resetToken } = req.query;
            if (!resetToken) {
                return res.status(400).json({
                    success: false,
                    message: "Reset token is missing!",
                });
            }
            try {
                const decodedToken = jsonwebtoken_1.default.verify(resetToken, envs_1.default.JWT_SECRET);
                const email = decodedToken?.email;
                const user = await db_1.default
                    .select()
                    .from(User_1.usersTable)
                    .where((0, drizzle_orm_1.eq)(User_1.usersTable.email, email))
                    .limit(1);
                req.userEmail = email.trim();
                if (!user[0]) {
                    return res.status(400).json({
                        success: false,
                        message: `Password reset failed!`,
                    });
                }
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    message: `Failed to confirm password reset token: ${error.message}`,
                    error: {
                        message: error.message,
                        stack: error.stack,
                    },
                });
            }
            return next();
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: `Failed to confirm password reset token: ${error.message}`,
                error: {
                    message: error.message,
                    stack: error.stack,
                },
            });
        }
    }
    async validatePasswords(req, res, next) {
        const validationResult = user_1.passwordCheckSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: validationResult.error.issues
                    .map((issue) => issue.message)
                    .join(", "),
            });
        }
        return next();
    }
}
const userMiddleware = new UserMiddleware();
exports.default = userMiddleware;

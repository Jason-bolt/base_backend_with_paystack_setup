"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../../../config/db"));
const User_1 = require("../../../../config/db/schemas/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_1 = __importDefault(require("../../../../utils/logger"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("../../../../utils/helpers/redis");
const drizzle_orm_1 = require("drizzle-orm");
const envs_1 = __importDefault(require("../../../../config/envs"));
const PasswordReset_1 = require("../../../../config/db/schemas/PasswordReset");
const generic_helpers_1 = require("../../../../utils/helpers/generic.helpers");
class UserService {
    constructor(db) {
        this.db = db;
    }
    async signUpUser(data) {
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        const preparedData = {
            id: generic_helpers_1.GenericHelper.generateUUID(),
            name: data.name,
            firebase_uid: data?.firebaseUid || undefined,
            email: data.email,
            password: hashedPassword,
        };
        logger_1.default.info(`Prepared data: ${JSON.stringify(preparedData)}`);
        const user = await this.db
            .insert(User_1.usersTable)
            .values(preparedData)
            .returning();
        logger_1.default.info(`User: ${JSON.stringify(user)}`);
        return generic_helpers_1.GenericHelper.camelize(user[0]);
    }
    async loginUser(email) {
        let userData = null;
        userData = await (0, redis_1.getRedisData)(email);
        if (!userData) {
            const user = await db_1.default
                .select()
                .from(User_1.usersTable)
                .where((0, drizzle_orm_1.eq)(User_1.usersTable.email, email))
                .limit(1);
            await (0, redis_1.setRedisData)(`users:email:${email}`, user);
            userData = generic_helpers_1.GenericHelper.camelize(user[0]);
        }
        const tokenData = {
            id: userData?.id,
            name: userData?.name,
            email: userData?.email,
        };
        const token = jsonwebtoken_1.default.sign({ tokenData }, envs_1.default.JWT_SECRET, {
            expiresIn: "1h",
        });
        logger_1.default.info(`User: ${JSON.stringify(tokenData)}`);
        logger_1.default.info(`Token: ${token}`);
        return { token };
    }
    async initiatePasswordReset(email) {
        let userData = null;
        userData = await (0, redis_1.getRedisData)(`users:email:${email}`);
        console.log("Redis Data", userData);
        if (!userData) {
            const user = await db_1.default
                .select()
                .from(User_1.usersTable)
                .where((0, drizzle_orm_1.eq)(User_1.usersTable.email, email))
                .limit(1);
            await (0, redis_1.setRedisData)(`users:email:${email}`, user);
            userData = generic_helpers_1.GenericHelper.camelize(user[0]);
            console.log("No redis data", userData);
        }
        const now = Date.now();
        const resetPasswordToken = jsonwebtoken_1.default.sign({
            email: userData?.email,
            timestamp: now,
        }, envs_1.default.JWT_SECRET, {
            expiresIn: "1h",
        });
        const resetTokenData = {
            user_id: userData.id,
            reset_token: resetPasswordToken,
        };
        await db_1.default
            .delete(PasswordReset_1.resetPasswordTokensTable)
            .where((0, drizzle_orm_1.eq)(PasswordReset_1.resetPasswordTokensTable.user_id, userData.id));
        const userResetToken = await db_1.default
            .insert(PasswordReset_1.resetPasswordTokensTable)
            .values(resetTokenData)
            .returning();
        const processedData = generic_helpers_1.GenericHelper.camelize(userResetToken[0]);
        return processedData;
    }
    async resetPassword(email, password) {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const updatedUserData = await db_1.default
            .update(User_1.usersTable)
            .set({
            password: hashedPassword,
        })
            .where((0, drizzle_orm_1.eq)(User_1.usersTable.email, email))
            .returning();
        const processedData = generic_helpers_1.GenericHelper.camelize(updatedUserData[0]);
        return processedData;
    }
}
const userService = new UserService(db_1.default);
exports.default = userService;

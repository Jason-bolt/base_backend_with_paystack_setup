"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PasswordReset_1 = require("./PasswordReset");
const User_1 = require("./User");
const schemas = {
    users: User_1.usersTable,
    resetPasswordTokens: PasswordReset_1.resetPasswordTokensTable
};
exports.default = schemas;

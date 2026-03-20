"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("../../modules/user/route"));
const route_2 = __importDefault(require("../../modules/paystack/route"));
const v1Router = (0, express_1.Router)();
v1Router.use("/users", route_1.default);
v1Router.use("/paystack", route_2.default);
exports.default = v1Router;

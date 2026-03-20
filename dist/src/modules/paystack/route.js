"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const paystackRouter = (0, express_1.Router)();
paystackRouter.post("/initialize", controller_1.default.initializeTransaction);
paystackRouter.get("/verify/:reference", controller_1.default.verifyTransaction);
paystackRouter.post("/webhook", controller_1.default.processWebhook);
exports.default = paystackRouter;

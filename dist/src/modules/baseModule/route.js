"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const baseRouterV1 = (0, express_1.Router)();
baseRouterV1.post("/create", controller_1.default.create);
baseRouterV1.get("/read", controller_1.default.read);
baseRouterV1.put("/update", controller_1.default.update);
baseRouterV1.delete("/delete", controller_1.default.delete);
exports.default = baseRouterV1;

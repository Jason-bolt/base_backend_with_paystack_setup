"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("../service"));
class BaseController {
    constructor(service) {
        this.service = service;
    }
    async create(req, res) {
        try {
            return;
        }
        catch (error) {
            throw new Error("Failed to create user");
        }
    }
    async read(req, res) {
        try {
            return;
        }
        catch (error) {
            throw new Error("Failed to read user");
        }
    }
    async update(req, res) {
        try {
            return;
        }
        catch (error) {
            throw new Error("Failed to update user");
        }
    }
    async delete(req, res) {
        try {
            return;
        }
        catch (error) {
            throw new Error("Failed to delete user");
        }
    }
}
const baseController = new BaseController(service_1.default);
exports.default = baseController;

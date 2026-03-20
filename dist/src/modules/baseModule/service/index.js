"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../../../config/db"));
class BaseService {
    constructor(db) {
        this.db = db;
    }
    async create(data) {
        try {
            return;
        }
        catch (error) {
            throw new Error("Failed to create user");
        }
    }
    async read(id) {
        try {
            return;
        }
        catch (error) {
            throw new Error("Failed to read user");
        }
    }
    async update(id, data) {
        try {
            return;
        }
        catch (error) {
            throw new Error("Failed to update user");
        }
    }
    async delete(id) {
        try {
            return;
        }
        catch (error) {
            throw new Error("Failed to delete user");
        }
    }
}
const baseService = new BaseService(db_1.default);
exports.default = baseService;

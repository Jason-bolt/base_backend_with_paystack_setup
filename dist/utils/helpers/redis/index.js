"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRedisData = exports.setRedisData = exports.getRedisData = void 0;
const redis_1 = require("redis");
const envs_1 = __importDefault(require("../../../config/envs"));
const redisClient = (0, redis_1.createClient)({
    url: envs_1.default.REDIS_URL,
});
redisClient.connect();
const getRedisData = async (key) => {
    const data = await redisClient.get(key);
    return JSON.parse(data);
};
exports.getRedisData = getRedisData;
const setRedisData = async (key, data, ttl = 10) => {
    await redisClient.set(key, JSON.stringify(data), { EX: ttl, NX: true });
};
exports.setRedisData = setRedisData;
const deleteRedisData = async (key) => {
    await redisClient.del(key);
};
exports.deleteRedisData = deleteRedisData;

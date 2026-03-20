"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const routes_1 = __importDefault(require("./src/routes"));
const envs_1 = __importDefault(require("./config/envs"));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too many requests, please try again later.",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const app = (0, express_1.default)();
// Trust proxy - required for express-rate-limit to work correctly behind proxies
app.set("trust proxy", 1);
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(limiter);
app.use("/api", routes_1.default);
app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "API is running",
        version: "1.0.0",
        env: envs_1.default.NODE_ENV,
    });
});
app.listen(envs_1.default.PORT, () => {
    console.log(`Server is running on port ${envs_1.default.PORT}`);
});

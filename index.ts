import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import router from "./src/routes";
// import "./config/queue/worker";
import { Request, Response } from "express";
import envs from "./config/envs";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Too many requests, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();

// Trust proxy - required for express-rate-limit to work correctly behind proxies
app.set("trust proxy", 1);

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "API is running",
    version: "1.0.0",
    env: envs.NODE_ENV,
  });
});

app.listen(envs.PORT, () => {
  console.log(`Server is running on port ${envs.PORT}`);
});

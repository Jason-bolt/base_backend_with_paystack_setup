import { Router } from "express";
import userRouterV1 from "../../modules/user/route";
import stockRouter from "../../modules/stock/route";
import requestsRouter from "../../modules/requests/route";
import contributionsRouter from "../../modules/contributions/route";
import timeBlocksRouter from "../../modules/timeBlocks/route";
import authRouter from "../../modules/auth/route";

const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/users", userRouterV1);
v1Router.use("/stock", stockRouter);
v1Router.use("/requests", requestsRouter);
v1Router.use("/contributions", contributionsRouter);
v1Router.use("/time-blocks", timeBlocksRouter);

export default v1Router;

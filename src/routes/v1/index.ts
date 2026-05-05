import { Router } from "express";
import userRouterV1 from "../../modules/user/route";
import paystackRouter from "../../modules/paystack/route";

const v1Router = Router();

v1Router.use("/users", userRouterV1);
v1Router.use("/paystack", paystackRouter);

export default v1Router;

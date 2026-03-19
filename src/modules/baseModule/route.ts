import { Router } from "express";
import baseController from "./controller";

const baseRouterV1 = Router();

baseRouterV1.post("/create", baseController.create);
baseRouterV1.get("/read", baseController.read);
baseRouterV1.put("/update", baseController.update);
baseRouterV1.delete("/delete", baseController.delete);

export default baseRouterV1;

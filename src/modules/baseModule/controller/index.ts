import IController from "./Icontroller";
import { Request, Response } from "express";
import IService from "../service/Iservice";
import baseService from "../service";

class BaseController implements IController {
  constructor(private readonly service: IService) {}

  async create(req: Request, res: Response) {
    try {
      return;
    } catch (error: any) {
      throw new Error("Failed to create user");
    }
  }

  async read(req: Request, res: Response) {
    try {
      return;
    } catch (error: any) {
      throw new Error("Failed to read user");
    }
  }

  async update(req: Request, res: Response) {
    try {
      return;
    } catch (error: any) {
      throw new Error("Failed to update user");
    }
  }

  async delete(req: Request, res: Response) {
    try {
      return;
    } catch (error: any) {
      throw new Error("Failed to delete user");
    }
  }
}

const baseController = new BaseController(baseService);
export default baseController;

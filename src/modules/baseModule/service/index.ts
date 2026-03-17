import db, { DB } from "../../../../config/db";
import IService from "./Iservice";

class BaseService implements IService {
  constructor(private readonly db: DB) {}

  async create(data: any) {
    try {
      return;
    } catch (error) {
      throw new Error("Failed to create user");
    }
  }

  async read(id: string) {
    try {
      return;
    } catch (error) {
      throw new Error("Failed to read user");
    }
  }

  async update(id: string, data: any) {
    try {
      return;
    } catch (error) {
      throw new Error("Failed to update user");
    }
  }

  async delete(id: string) {
    try {
      return;
    } catch (error) {
      throw new Error("Failed to delete user");
    }
  }
}

const baseService = new BaseService(db);
export default baseService;
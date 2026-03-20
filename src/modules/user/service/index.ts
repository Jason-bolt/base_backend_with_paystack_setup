import db, { DB } from "../../../../config/db";
import { usersTable } from "../../../../config/db/schemas/User";
import { ICreateUser, IGetUsersFilter, IUpdateUser, IUser } from "../types";
import IService from "./Iservice";
import bcrypt from "bcrypt";
import logger from "../../../../utils/logger";
import jwt from "jsonwebtoken";
import { getRedisData, setRedisData } from "../../../../utils/helpers/redis";
import { eq } from "drizzle-orm";
import envs from "../../../../config/envs";
import { resetPasswordTokensTable } from "../../../../config/db/schemas/PasswordReset";
import { GenericHelper } from "../../../../utils/helpers/generic.helpers";

class UserService implements IService {
  constructor(private readonly db: DB) {}

  async signUpUser(data: ICreateUser) {
    const hashedPassword = await bcrypt.hash(data.password as string, 10);
    const preparedData = {
      id: GenericHelper.generateUUID(),
      name: data.name,
      firebase_uid: data?.firebaseUid || undefined,
      email: data.email,
      password: hashedPassword,
    };

    logger.info(`Prepared data: ${JSON.stringify(preparedData)}`);

    const user = await this.db
      .insert(usersTable)
      .values(preparedData)
      .returning();

    logger.info(`User: ${JSON.stringify(user)}`);

    return GenericHelper.camelize<IUser>(user[0]);
  }

  async loginUser(email: string) {
    let userData: IUser | null = null;
    userData = await getRedisData(email);

    if (!userData) {
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);

      await setRedisData(`users:email:${email}`, user);
      userData = GenericHelper.camelize(user[0]);
    }

    const tokenData = {
      id: userData?.id,
      name: userData?.name,
      email: userData?.email,
    };

    const token = jwt.sign({ tokenData }, envs.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    logger.info(`User: ${JSON.stringify(tokenData)}`);
    logger.info(`Token: ${token}`);

    return { token };
  }

  async initiatePasswordReset(email: string) {
    let userData: IUser | null = null;
    userData = await getRedisData(`users:email:${email}`);

    console.log("Redis Data", userData);

    if (!userData) {
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);

      await setRedisData(`users:email:${email}`, user);
      userData = GenericHelper.camelize<IUser>(user[0]);
      console.log("No redis data", userData);
    }

    const now = Date.now();
    const resetPasswordToken = jwt.sign(
      {
        email: userData?.email,
        timestamp: now,
      },
      envs.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    const resetTokenData = {
      user_id: userData!.id,
      reset_token: resetPasswordToken,
    };
    await db
      .delete(resetPasswordTokensTable)
      .where(eq(resetPasswordTokensTable.user_id, userData!.id));

    const userResetToken = await db
      .insert(resetPasswordTokensTable)
      .values(resetTokenData)
      .returning();

    const processedData = GenericHelper.camelize<{
      userId: string;
      resetToken: string;
    }>(userResetToken[0]);
    return processedData;
  }

  async resetPassword(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password as string, 10);
    const updatedUserData = await db
      .update(usersTable)
      .set({
        password: hashedPassword,
      })
      .where(eq(usersTable.email, email))
      .returning();
    const processedData = GenericHelper.camelize<IUser>(updatedUserData[0]);

    return processedData;
  }

  // async getUser(id: string) {
  //   try {
  //     return;
  //   } catch (error) {
  //     throw new Error("Failed to read user");
  //   }
  // }

  // async getUsers(data: IGetUsersFilter) {
  //   try {
  //     return;
  //   } catch (error) {
  //     throw new Error("Failed to get users");
  //   }
  // }

  // async updateUser(id: string, data: IUpdateUser) {
  //   try {
  //     return;
  //   } catch (error) {
  //     throw new Error("Failed to update user");
  //   }
  // }

  // async deleteUser(id: string) {
  //   try {
  //     return;
  //   } catch (error) {
  //     throw new Error("Failed to delete user");
  //   }
  // }
}

const userService = new UserService(db);
export default userService;

import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import _ from "lodash";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
// import db from "../../config/db";
import envs from "../../config/envs";

export class GenericHelper {
  static generateId(length = 6, prefix = "", suffix = ""): string {
    const randomNumber = GenericHelper.generateRandomNumber(length);
    return `${prefix ? prefix + "-" : ""}${randomNumber}${suffix ? "-" + suffix : ""}`;
  }

  static generateUUID(): string {
    return uuidv4();
  }

  static calcPages(total: number, limit: number): number {
    const displayPage = Math.floor(total / limit);
    return total % limit ? displayPage + 1 : displayPage;
  }

  static camelize<T>(obj: Record<string, any>): T {
    return _.transform(
      obj,
      (acc: any, value, key, target) => {
        const camelKey = _.isArray(target) ? key : _.camelCase(key);

        // Handle Date objects - convert to ISO string before camelizing
        if (value instanceof Date) {
          acc[camelKey] = value.toISOString();
        } else if (_.isObject(value) && !_.isArray(value)) {
          // Only recursively camelize if it's a plain object (not Date, not Array)
          acc[camelKey] = GenericHelper.camelize(value);
        } else {
          acc[camelKey] = value;
        }

        return acc;
      },
      {} as Record<string, any>,
    );
  }

  //   static async paginatedData(
  //     resourceQuery: string,
  //     countQuery: string,
  //     page: number,
  //     limit: number,
  //     queryParams: Record<string, string | number>,
  //   ): Promise<{
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     data: any[];
  //     currentPage: number;
  //     totalCount: number;
  //     totalPages: number;
  //   }> {
  //     const offset = (page - 1) * limit;

  //     // where queryParams is an array or an object
  //     if (Array.isArray(queryParams)) {
  //       queryParams.push(offset, limit);
  //     } else {
  //       queryParams.offset = offset;
  //       queryParams.limit = limit;

  //       resourceQuery += ` OFFSET $/offset/ LIMIT $/limit/;`;
  //     }
  //     const fetchCount = db.oneOrNone(countQuery, queryParams);
  //     const fetchData = db.manyOrNone(resourceQuery, queryParams);

  //     const [{ count }, data] = await Promise.all([fetchCount, fetchData]);
  //     const totalCount: number = parseInt(count);
  //     const totalPages: number = GenericHelper.calcPages(totalCount, limit);

  //     return {
  //       data,
  //       currentPage: page,
  //       totalCount,
  //       totalPages,
  //     };
  //   }

  static capitalizeFirstLetter(word: string) {
    if (word.length === 0) {
      return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  static generateRandomSixDigitNumber() {
    const randomBytes = crypto.randomBytes(3); // 3 bytes = 6 hexadecimal digits

    const randomNumber = parseInt(randomBytes.toString("hex"), 16);
    const sixDigitNumber = String(randomNumber).padEnd(6, "0");
    return parseInt(sixDigitNumber.slice(0, 6));
  }

  static generateToken(
    data: object,
    expiresIn: SignOptions["expiresIn"] = envs.JWT_TOKEN_EXPIRY
      ? (envs.JWT_TOKEN_EXPIRY as SignOptions["expiresIn"])
      : ("1h" as SignOptions["expiresIn"]),
  ) {
    return jwt.sign(data, envs.JWT_SECRET, { expiresIn });
  }

  static decryptJwt(jwtString: string) {
    return jwt.verify(jwtString, envs.JWT_SECRET as string);
  }

  static generateRandomNumber(length: number = 6) {
    if (length <= 0) {
      throw new Error("Length must be greater than 0");
    }

    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static hashString(string: string) {
    return bcrypt.hashSync(string, 10);
  }

  static compareHash(string: string, hash: string) {
    return bcrypt.compareSync(string, hash);
  }

  static isValidPassword(password: string): boolean {
    // Check if the password meets the criteria
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Return true only if all conditions are met
    return (
      hasMinLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  }
}
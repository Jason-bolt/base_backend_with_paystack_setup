"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericHelper = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const lodash_1 = __importDefault(require("lodash"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
// import db from "../../config/db";
const envs_1 = __importDefault(require("../../config/envs"));
class GenericHelper {
    static generateId(length = 6, prefix = "", suffix = "") {
        const randomNumber = GenericHelper.generateRandomNumber(length);
        return `${prefix ? prefix + "-" : ""}${randomNumber}${suffix ? "-" + suffix : ""}`;
    }
    static generateUUID() {
        return (0, uuid_1.v4)();
    }
    static calcPages(total, limit) {
        const displayPage = Math.floor(total / limit);
        return total % limit ? displayPage + 1 : displayPage;
    }
    static camelize(obj) {
        return lodash_1.default.transform(obj, (acc, value, key, target) => {
            const camelKey = lodash_1.default.isArray(target) ? key : lodash_1.default.camelCase(key);
            // Handle Date objects - convert to ISO string before camelizing
            if (value instanceof Date) {
                acc[camelKey] = value.toISOString();
            }
            else if (lodash_1.default.isObject(value) && !lodash_1.default.isArray(value)) {
                // Only recursively camelize if it's a plain object (not Date, not Array)
                acc[camelKey] = GenericHelper.camelize(value);
            }
            else {
                acc[camelKey] = value;
            }
            return acc;
        }, {});
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
    static capitalizeFirstLetter(word) {
        if (word.length === 0) {
            return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
    static generateRandomSixDigitNumber() {
        const randomBytes = crypto_1.default.randomBytes(3); // 3 bytes = 6 hexadecimal digits
        const randomNumber = parseInt(randomBytes.toString("hex"), 16);
        const sixDigitNumber = String(randomNumber).padEnd(6, "0");
        return parseInt(sixDigitNumber.slice(0, 6));
    }
    static generateToken(data, expiresIn = envs_1.default.JWT_TOKEN_EXPIRY
        ? envs_1.default.JWT_TOKEN_EXPIRY
        : "1h") {
        return jsonwebtoken_1.default.sign(data, envs_1.default.JWT_SECRET, { expiresIn });
    }
    static decryptJwt(jwtString) {
        return jsonwebtoken_1.default.verify(jwtString, envs_1.default.JWT_SECRET);
    }
    static generateRandomNumber(length = 6) {
        if (length <= 0) {
            throw new Error("Length must be greater than 0");
        }
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static hashString(string) {
        return bcrypt_1.default.hashSync(string, 10);
    }
    static compareHash(string, hash) {
        return bcrypt_1.default.compareSync(string, hash);
    }
    static isValidPassword(password) {
        // Check if the password meets the criteria
        const hasMinLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        // Return true only if all conditions are met
        return (hasMinLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumber &&
            hasSpecialChar);
    }
}
exports.GenericHelper = GenericHelper;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelize = void 0;
const lodash_1 = __importDefault(require("lodash"));
const camelize = (obj) => {
    return lodash_1.default.transform(obj, (acc, value, key, target) => {
        const camelKey = lodash_1.default.isArray(target) ? key : lodash_1.default.camelCase(key);
        // Handle Date objects - convert to ISO string before camelizing
        if (value instanceof Date) {
            acc[camelKey] = value.toISOString();
        }
        else if (lodash_1.default.isObject(value) && !lodash_1.default.isArray(value)) {
            // Only recursively camelize if it's a plain object (not Date, not Array)
            acc[camelKey] = (0, exports.camelize)(value);
        }
        else {
            acc[camelKey] = value;
        }
        return acc;
    }, {});
};
exports.camelize = camelize;

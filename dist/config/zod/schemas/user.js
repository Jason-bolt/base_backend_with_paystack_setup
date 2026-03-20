"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordCheckSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const passwordSchema = zod_1.z.string().min(8, "Password must be at least 8 characters")
    .max(20, "Password cannot exceed 20 characters")
    .refine(val => /[A-Z]/.test(val), { message: "Must contain an uppercase letter" })
    .refine(val => /[a-z]/.test(val), { message: "Must contain a lowercase letter" })
    .refine(val => /[0-9]/.test(val), { message: "Must contain a number" })
    .refine(val => /[!@#$%^&*]/.test(val), { message: "Must contain a special character" });
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.email("Invalid email address"),
    password: passwordSchema.optional(),
    confirmPassword: passwordSchema.optional(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
exports.passwordCheckSchema = zod_1.z.object({
    password: passwordSchema.optional(),
    confirmPassword: passwordSchema.optional(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = exports.userRoleEnum = void 0;
const zod_1 = require("zod");
exports.userRoleEnum = zod_1.z.enum([
    'admin',
    'panel_manager',
    'call_center_agent',
    'field_executive',
]);
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Please enter a valid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    role: exports.userRoleEnum,
    regionId: zod_1.z.string().uuid().nullable().optional(),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    email: zod_1.z.string().email().optional(),
    role: exports.userRoleEnum.optional(),
    isActive: zod_1.z.boolean().optional(),
    regionId: zod_1.z.string().uuid().nullable().optional(),
});

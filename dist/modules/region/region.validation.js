"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRegionSchema = exports.createRegionSchema = void 0;
const zod_1 = require("zod");
exports.createRegionSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    code: zod_1.z.string().min(2, 'Code must be at least 2 characters').toUpperCase(),
    state: zod_1.z.string().min(2, 'State must be at least 2 characters'),
});
exports.updateRegionSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    code: zod_1.z.string().min(2).toUpperCase().optional(),
    state: zod_1.z.string().min(2).optional(),
    isActive: zod_1.z.boolean().optional(),
});

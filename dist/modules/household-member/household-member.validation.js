"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHouseholdMemberSchema = exports.createHouseholdMemberSchema = exports.genderEnum = void 0;
const zod_1 = require("zod");
exports.genderEnum = zod_1.z.enum(['male', 'female', 'other']);
exports.createHouseholdMemberSchema = zod_1.z.object({
    householdId: zod_1.z.string().uuid('Valid household ID is required'),
    name: zod_1.z.string().min(1, 'Name is required'),
    age: zod_1.z.coerce.number().int().min(0, 'Age must be non-negative').max(125),
    gender: exports.genderEnum,
    relationshipToRespondent: zod_1.z.string().min(1, 'Relationship is required'),
});
exports.updateHouseholdMemberSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    age: zod_1.z.coerce.number().int().min(0).max(125).optional(),
    gender: exports.genderEnum.optional(),
    relationshipToRespondent: zod_1.z.string().min(1).optional(),
});

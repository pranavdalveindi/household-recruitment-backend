"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNoteSchema = exports.noteTypeEnum = void 0;
const zod_1 = require("zod");
exports.noteTypeEnum = zod_1.z.enum([
    'general',
    'contact_instruction',
    'installation_instruction',
    'other',
]);
exports.createNoteSchema = zod_1.z.object({
    householdId: zod_1.z.string().uuid('Valid household ID is required'),
    noteType: exports.noteTypeEnum,
    content: zod_1.z.string().min(1, 'Content is required'),
});

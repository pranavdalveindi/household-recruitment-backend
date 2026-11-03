"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuestionSchema = exports.createQuestionnaireVersionSchema = exports.questionTypeEnum = void 0;
const zod_1 = require("zod");
exports.questionTypeEnum = zod_1.z.enum([
    'text',
    'number',
    'boolean',
    'single_choice',
    'multiple_choice',
    'date',
]);
exports.createQuestionnaireVersionSchema = zod_1.z.object({
    title: zod_1.z.string().min(2, 'Title is required'),
    description: zod_1.z.string().optional(),
});
exports.createQuestionSchema = zod_1.z.object({
    questionnaireVersionId: zod_1.z.string().uuid(),
    questionText: zod_1.z.string().min(2, 'Question text is required'),
    questionType: exports.questionTypeEnum,
    options: zod_1.z.array(zod_1.z.string()).optional(),
    isRequired: zod_1.z.boolean().default(true),
    displayOrder: zod_1.z.coerce.number().int().default(1),
});

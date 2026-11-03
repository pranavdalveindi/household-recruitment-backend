"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDisplayDate = exports.toIsoUtc = void 0;
const toIsoUtc = (date = new Date()) => {
    return date.toISOString();
};
exports.toIsoUtc = toIsoUtc;
const formatDisplayDate = (date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};
exports.formatDisplayDate = formatDisplayDate;

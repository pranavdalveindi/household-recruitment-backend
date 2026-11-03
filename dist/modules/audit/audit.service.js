"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditService = exports.AuditService = void 0;
const connection_1 = require("../../database/connection");
class AuditService {
    async list(filters) {
        const conditions = [];
        const params = [];
        let paramIndex = 1;
        if (filters.entityType) {
            conditions.push(`a.entity_type = $${paramIndex}`);
            params.push(filters.entityType);
            paramIndex++;
        }
        if (filters.entityId) {
            conditions.push(`a.entity_id = $${paramIndex}`);
            params.push(filters.entityId);
            paramIndex++;
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const limit = Math.max(1, Math.min(200, filters.limit || 50));
        params.push(limit);
        const query = `
      SELECT a.id, a.user_id as "userId", u.name as "userName", a.action,
             a.entity_type as "entityType", a.entity_id as "entityId",
             a.previous_values as "previousValues", a.new_values as "newValues",
             a.metadata, a.created_at as "createdAt"
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      ${whereClause}
      ORDER BY a.created_at DESC
      LIMIT $${paramIndex}
    `;
        const result = await connection_1.db.query(query, params);
        return result.rows;
    }
    async record(userId, action, entityType, entityId, previousValues, newValues, metadata) {
        await connection_1.db.query(`INSERT INTO audit_logs (user_id, action, entity_type, entity_id, previous_values, new_values, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
            userId,
            action,
            entityType,
            entityId,
            previousValues ? JSON.stringify(previousValues) : null,
            newValues ? JSON.stringify(newValues) : null,
            metadata ? JSON.stringify(metadata) : null,
        ]);
    }
}
exports.AuditService = AuditService;
exports.auditService = new AuditService();

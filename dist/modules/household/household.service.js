"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.householdService = exports.HouseholdService = void 0;
const connection_1 = require("../../database/connection");
class HouseholdService {
    async list(filters, _actor) {
        const page = Math.max(1, filters.page || 1);
        const limit = Math.max(1, Math.min(100, filters.limit || 20));
        const offset = (page - 1) * limit;
        const conditions = [];
        const params = [];
        let paramIndex = 1;
        if (filters.search) {
            conditions.push(`(h.hhid ILIKE $${paramIndex} OR h.respondent_name ILIKE $${paramIndex} OR h.contact_number ILIKE $${paramIndex})`);
            params.push(`%${filters.search}%`);
            paramIndex++;
        }
        if (filters.regionId) {
            conditions.push(`h.region_id = $${paramIndex}`);
            params.push(filters.regionId);
            paramIndex++;
        }
        if (filters.recruitmentStatus) {
            conditions.push(`h.recruitment_status = $${paramIndex}`);
            params.push(filters.recruitmentStatus);
            paramIndex++;
        }
        if (filters.sec !== undefined) {
            conditions.push(`h.sec = $${paramIndex}`);
            params.push(filters.sec);
            paramIndex++;
        }
        if (filters.mosr !== undefined) {
            conditions.push(`h.mosr = $${paramIndex}`);
            params.push(filters.mosr);
            paramIndex++;
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const countResult = await connection_1.db.query(`SELECT COUNT(*) as total FROM households h ${whereClause}`, params);
        const totalItems = parseInt(countResult.rows[0].total, 10);
        const totalPages = Math.ceil(totalItems / limit);
        const query = `
      SELECT h.id, h.hhid, h.respondent_name as "respondentName", h.contact_number as "contactNumber",
             h.alternate_contact_number as "alternateContactNumber", h.address, h.landmark, h.city,
             h.region_id as "regionId", r.name as "regionName", h.location, h.sec, h.mosr,
             h.recruitment_status as "recruitmentStatus", h.created_at as "createdAt", h.updated_at as "updatedAt"
      FROM households h
      LEFT JOIN regions r ON h.region_id = r.id
      ${whereClause}
      ORDER BY h.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
        params.push(limit, offset);
        const result = await connection_1.db.query(query, params);
        return {
            households: result.rows,
            meta: {
                page,
                limit,
                totalItems,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }
    async getById(id) {
        const result = await connection_1.db.query(`SELECT h.id, h.hhid, h.respondent_name as "respondentName", h.contact_number as "contactNumber",
              h.alternate_contact_number as "alternateContactNumber", h.address, h.landmark, h.city,
              h.region_id as "regionId", r.name as "regionName", h.location, h.sec, h.mosr,
              h.recruitment_status as "recruitmentStatus", h.created_at as "createdAt", h.updated_at as "updatedAt"
       FROM households h
       LEFT JOIN regions r ON h.region_id = r.id
       WHERE h.id = $1 OR h.hhid = $1`, [id]);
        if (result.rowCount === 0) {
            const error = new Error('Household not found');
            error.statusCode = 404;
            throw error;
        }
        return result.rows[0];
    }
    async create(data, _actor) {
        const existing = await connection_1.db.query('SELECT id FROM households WHERE hhid = $1', [data.hhid]);
        if ((existing.rowCount ?? 0) > 0) {
            const error = new Error(`Household with HHID '${data.hhid}' already exists`);
            error.statusCode = 409;
            throw error;
        }
        const result = await connection_1.db.query(`INSERT INTO households (hhid, respondent_name, contact_number, alternate_contact_number, address, landmark, city, region_id, location, sec, mosr, recruitment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'not_contacted')
       RETURNING id, hhid, respondent_name as "respondentName", contact_number as "contactNumber",
                 alternate_contact_number as "alternateContactNumber", address, landmark, city,
                 region_id as "regionId", location, sec, mosr, recruitment_status as "recruitmentStatus",
                 created_at as "createdAt", updated_at as "updatedAt"`, [
            data.hhid,
            data.respondentName,
            data.contactNumber,
            data.alternateContactNumber || null,
            data.address,
            data.landmark || null,
            data.city,
            data.regionId,
            data.location || null,
            data.sec,
            data.mosr,
        ]);
        return result.rows[0];
    }
}
exports.HouseholdService = HouseholdService;
exports.householdService = new HouseholdService();

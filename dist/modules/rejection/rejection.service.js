"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectionService = exports.RejectionService = void 0;
const connection_1 = require("../../database/connection");
class RejectionService {
    async list() {
        const result = await connection_1.db.query(`SELECT r.id, r.household_id as "householdId", h.hhid,
              r.rejected_by as "rejectedBy", u.name as "rejectedByName",
              r.reason, r.demographic_snapshot as "demographicSnapshot",
              r.rejection_date as "rejectionDate", r.created_at as "createdAt"
       FROM household_rejections r
       JOIN households h ON r.household_id = h.id
       LEFT JOIN users u ON r.rejected_by = u.id
       ORDER BY r.rejection_date DESC`);
        return result.rows;
    }
    async rejectPermanently(input, actor) {
        return connection_1.db.transaction(async (client) => {
            // 1. Fetch household and demographic info
            const hhResult = await client.query(`SELECT h.id, h.hhid, h.region_id, r.name as region_name, h.sec, h.mosr, h.recruitment_status
         FROM households h
         LEFT JOIN regions r ON h.region_id = r.id
         WHERE h.id = $1`, [input.householdId]);
            if (hhResult.rowCount === 0) {
                const error = new Error('Household not found');
                error.statusCode = 404;
                throw error;
            }
            const hh = hhResult.rows[0];
            if (hh.recruitment_status === 'rejected') {
                const error = new Error('Household is already permanently rejected');
                error.statusCode = 400;
                throw error;
            }
            // 2. Fetch members to construct demographic snapshot
            const membersResult = await client.query(`SELECT age, gender FROM household_members WHERE household_id = $1`, [input.householdId]);
            const members = membersResult.rows;
            const ages = members.map((m) => m.age);
            const genderCounts = members.reduce((acc, m) => {
                acc[m.gender] = (acc[m.gender] || 0) + 1;
                return acc;
            }, {});
            const snapshot = {
                regionId: hh.region_id,
                regionName: hh.region_name,
                sec: hh.sec,
                mosr: hh.mosr,
                memberCount: members.length,
                ageComposition: {
                    min: ages.length > 0 ? Math.min(...ages) : 0,
                    max: ages.length > 0 ? Math.max(...ages) : 0,
                    avg: ages.length > 0 ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0,
                },
                genderComposition: genderCounts,
            };
            // 3. Insert into household_rejections
            const insertResult = await client.query(`INSERT INTO household_rejections (household_id, rejected_by, reason, demographic_snapshot, rejection_date)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING id, household_id as "householdId", rejected_by as "rejectedBy", reason,
                   demographic_snapshot as "demographicSnapshot", rejection_date as "rejectionDate",
                   created_at as "createdAt"`, [input.householdId, actor.id, input.reason, JSON.stringify(snapshot)]);
            // 4. Update household status to 'rejected'
            await client.query(`UPDATE households SET recruitment_status = 'rejected', updated_at = NOW() WHERE id = $1`, [input.householdId]);
            // 5. Add to audit log
            await client.query(`INSERT INTO household_status_history (household_id, previous_status, new_status, changed_by, notes)
         VALUES ($1, $2, 'rejected', $3, $4)`, [input.householdId, hh.recruitment_status, actor.id, `Permanent rejection: ${input.reason}`]);
            const rejection = insertResult.rows[0];
            rejection.hhid = hh.hhid;
            return rejection;
        });
    }
    async findReplacements(householdId) {
        // 1. Get the rejected household snapshot or attributes
        const targetHhResult = await connection_1.db.query(`SELECT h.id, h.hhid, h.region_id, h.sec, h.mosr,
              (SELECT COUNT(*) FROM household_members WHERE household_id = h.id) as member_count
       FROM households h
       WHERE h.id = $1`, [householdId]);
        if (targetHhResult.rowCount === 0) {
            const error = new Error('Household not found');
            error.statusCode = 404;
            throw error;
        }
        const target = targetHhResult.rows[0];
        // Find candidate households with 'not_contacted' status in same region or matching SEC/MOSR
        const candidates = await connection_1.db.query(`SELECT h.id, h.hhid, h.respondent_name as "respondentName", h.contact_number as "contactNumber",
              h.address, h.city, h.sec, h.mosr, r.name as "regionName",
              (SELECT COUNT(*) FROM household_members WHERE household_id = h.id) as "memberCount",
              (
                CASE WHEN h.region_id = $1 THEN 40 ELSE 0 END +
                CASE WHEN h.sec = $2 THEN 30 ELSE 0 END +
                CASE WHEN ABS(h.mosr - $3) <= 1 THEN 20 ELSE 0 END +
                CASE WHEN (SELECT COUNT(*) FROM household_members WHERE household_id = h.id) = $4 THEN 10 ELSE 0 END
              ) as "matchScore"
       FROM households h
       LEFT JOIN regions r ON h.region_id = r.id
       WHERE h.recruitment_status = 'not_contacted' AND h.id != $5
       ORDER BY "matchScore" DESC, h.created_at ASC
       LIMIT 10`, [target.region_id, target.sec, target.mosr, parseInt(target.member_count, 10), householdId]);
        return candidates.rows;
    }
}
exports.RejectionService = RejectionService;
exports.rejectionService = new RejectionService();

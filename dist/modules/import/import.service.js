"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importService = exports.ImportService = void 0;
const sync_1 = require("csv-parse/sync");
const connection_1 = require("../../database/connection");
class ImportService {
    async tableHasColumn(tableName, columnName) {
        const result = await connection_1.db.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name = $1
        AND column_name = $2
    `, [tableName, columnName]);
        return result.rows.length > 0;
    }
    async listBatches() {
        const hasImportedBy = await this.tableHasColumn('import_batches', 'imported_by');
        const result = await connection_1.db.query(hasImportedBy
            ? `SELECT b.id, b.filename, b.total_rows as "totalRows", b.successful_rows as "successfulRows",
              b.failed_rows as "failedRows", b.imported_by as "importedBy", u.name as "importedByName",
              b.created_at as "createdAt"
       FROM import_batches b
       LEFT JOIN users u ON b.imported_by = u.id
       ORDER BY b.created_at DESC`
            : `SELECT b.id, b.filename, b.total_rows as "totalRows", b.successful_rows as "successfulRows",
              b.failed_rows as "failedRows", NULL as "importedBy", NULL as "importedByName",
              b.created_at as "createdAt"
       FROM import_batches b
       ORDER BY b.created_at DESC`);
        return result.rows;
    }
    async validateCsv(buffer) {
        const records = (0, sync_1.parse)(buffer, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });
        // Fetch existing regions for validation
        const regionResult = await connection_1.db.query('SELECT id, name FROM regions');
        const regionMap = new Map();
        regionResult.rows.forEach((r) => regionMap.set(r.name.toLowerCase(), r.id));
        // Fetch existing HHIDs
        const existingHhResult = await connection_1.db.query('SELECT hhid FROM households');
        const existingHhids = new Set(existingHhResult.rows.map((r) => r.hhid.toUpperCase()));
        const seenFileHhids = new Set();
        const parsedRows = [];
        for (let i = 0; i < records.length; i++) {
            const row = records[i];
            const errors = [];
            const hhid = (row.hhid || '').trim().toUpperCase();
            if (!hhid) {
                errors.push('HHID is required');
            }
            else if (existingHhids.has(hhid)) {
                errors.push(`HHID '${hhid}' already exists in database`);
            }
            else if (seenFileHhids.has(hhid)) {
                errors.push(`Duplicate HHID '${hhid}' found in uploaded file`);
            }
            else {
                seenFileHhids.add(hhid);
            }
            const respondentName = (row.respondent_name || row.respondant_name || '').trim();
            if (!respondentName)
                errors.push('Respondent name is required');
            const normalizedRow = {
                ...row,
                respondent_name: respondentName,
            };
            if (!normalizedRow.respondent_name?.trim())
                errors.push('Respondent name is required');
            if (!row.contact_number?.trim())
                errors.push('Contact number is required');
            if (!row.address?.trim())
                errors.push('Address is required');
            if (!row.city?.trim())
                errors.push('City is required');
            const regionName = (row.region || '').trim();
            if (!regionName) {
                errors.push('Region is required');
            }
            else if (!regionMap.has(regionName.toLowerCase())) {
                errors.push(`Region '${regionName}' not recognized`);
            }
            const sec = parseInt(row.sec, 10);
            if (isNaN(sec) || sec < 1)
                errors.push('SEC must be a positive integer');
            const mosr = parseInt(row.mosr, 10);
            if (isNaN(mosr) || mosr < 0)
                errors.push('MOSR must be a non-negative integer');
            // Parse members 1 through 10
            const members = [];
            for (let m = 1; m <= 10; m++) {
                const name = (row[`member_${m}_name`] || '').trim();
                const ageStr = (row[`member_${m}_age`] || '').trim();
                const gender = (row[`member_${m}_gender`] || '').trim().toLowerCase();
                const rel = (row[`member_${m}_relationship_to_respondent`] || '').trim();
                const hasAnyField = name || ageStr || gender || rel;
                const hasAllFields = name && ageStr && gender && rel;
                if (hasAnyField && !hasAllFields) {
                    errors.push(`Member ${m} is partially completed. All fields are required if member is present.`);
                }
                else if (hasAllFields) {
                    const age = parseInt(ageStr, 10);
                    if (isNaN(age) || age < 0 || age > 125) {
                        errors.push(`Member ${m} age is invalid`);
                    }
                    if (!['male', 'female', 'other'].includes(gender)) {
                        errors.push(`Member ${m} gender must be male, female, or other`);
                    }
                    members.push({
                        name,
                        age: isNaN(age) ? 0 : age,
                        gender: gender,
                        relationshipToRespondent: rel,
                    });
                }
            }
            parsedRows.push({
                rowIndex: i + 1,
                hhid,
                respondentName: normalizedRow.respondent_name || '',
                contactNumber: row.contact_number || '',
                alternateContactNumber: row.alternate_contact_number || undefined,
                address: row.address || '',
                landmark: row.landmark || undefined,
                city: row.city || '',
                region: regionName,
                location: row.location || undefined,
                sec: isNaN(sec) ? 0 : sec,
                mosr: isNaN(mosr) ? 0 : mosr,
                members,
                isValid: errors.length === 0,
                errors,
            });
        }
        const validCount = parsedRows.filter((r) => r.isValid).length;
        return {
            totalRows: parsedRows.length,
            validRowsCount: validCount,
            invalidRowsCount: parsedRows.length - validCount,
            preview: parsedRows,
        };
    }
    async confirmImport(filename, validRows, actor) {
        return connection_1.db.transaction(async (client) => {
            // 1. Resolve region names
            const regionResult = await client.query('SELECT id, name FROM regions');
            const regionMap = new Map();
            regionResult.rows.forEach((r) => regionMap.set(r.name.toLowerCase(), r.id));
            const hasImportedBy = await this.tableHasColumn('import_batches', 'imported_by');
            // 2. Create import batch record
            const batchInsertSql = hasImportedBy
                ? `INSERT INTO import_batches (filename, total_rows, successful_rows, failed_rows, imported_by)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id`
                : `INSERT INTO import_batches (filename, total_rows, successful_rows, failed_rows)
           VALUES ($1, $2, $3, $4)
           RETURNING id`;
            const batchParams = hasImportedBy
                ? [filename, validRows.length, validRows.length, 0, actor.id]
                : [filename, validRows.length, validRows.length, 0];
            const batchResult = await client.query(batchInsertSql, batchParams);
            const batchId = batchResult.rows[0].id;
            // 3. Insert each household and its members
            for (const row of validRows) {
                const regionId = regionMap.get(row.region.toLowerCase());
                if (!regionId) {
                    throw new Error(`Region '${row.region}' could not be resolved`);
                }
                const hhInsert = await client.query(`INSERT INTO households (
            hhid, respondent_name, contact_number, alternate_contact_number,
            address, landmark, city, region_id, location, sec, mosr, recruitment_status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'not_contacted')
          RETURNING id`, [
                    row.hhid,
                    row.respondentName,
                    row.contactNumber,
                    row.alternateContactNumber || null,
                    row.address,
                    row.landmark || null,
                    row.city,
                    regionId,
                    row.location || null,
                    row.sec,
                    row.mosr,
                ]);
                const householdId = hhInsert.rows[0].id;
                // Insert members
                for (const member of row.members) {
                    await client.query(`INSERT INTO household_members (household_id, name, age, gender, relationship_to_respondent)
             VALUES ($1, $2, $3, $4, $5)`, [householdId, member.name, member.age, member.gender, member.relationshipToRespondent]);
                }
                // Record batch row
                await client.query(`INSERT INTO import_batch_rows (import_batch_id, household_id, row_index, hhid, is_successful)
           VALUES ($1, $2, $3, $4, true)`, [batchId, householdId, row.rowIndex, row.hhid]);
            }
            return {
                batchId,
                importedCount: validRows.length,
            };
        });
    }
}
exports.ImportService = ImportService;
exports.importService = new ImportService();

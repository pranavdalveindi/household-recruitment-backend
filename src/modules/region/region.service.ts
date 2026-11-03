import { db } from '../../database/connection';
import { CreateRegionInput, Region, UpdateRegionInput } from './region.types';

export class RegionService {
  async getAll(): Promise<Region[]> {
    const result = await db.query<Region>(
      `SELECT id, name, code, state, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"
       FROM regions 
       ORDER BY name ASC`
    );
    return result.rows;
  }

  async getById(id: string): Promise<Region> {
    const result = await db.query<Region>(
      `SELECT id, name, code, state, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"
       FROM regions 
       WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      const error: any = new Error('Region not found');
      error.statusCode = 404;
      throw error;
    }

    return result.rows[0];
  }

  async create(input: CreateRegionInput): Promise<Region> {
    const existing = await db.query('SELECT id FROM regions WHERE LOWER(code) = LOWER($1)', [input.code]);
    if ((existing.rowCount ?? 0) > 0) {
      const error: any = new Error(`Region with code '${input.code}' already exists`);
      error.statusCode = 409;
      throw error;
    }

    const result = await db.query<Region>(
      `INSERT INTO regions (name, code, state)
       VALUES ($1, $2, $3)
       RETURNING id, name, code, state, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"`,
      [input.name, input.code, input.state]
    );

    return result.rows[0];
  }

  async update(id: string, input: UpdateRegionInput): Promise<Region> {
    const region = await this.getById(id);

    const name = input.name ?? region.name;
    const code = input.code ?? region.code;
    const state = input.state ?? region.state;
    const isActive = input.isActive ?? region.isActive;

    const result = await db.query<Region>(
      `UPDATE regions 
       SET name = $1, code = $2, state = $3, is_active = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING id, name, code, state, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"`,
      [name, code, state, isActive, id]
    );

    return result.rows[0];
  }
}

export const regionService = new RegionService();


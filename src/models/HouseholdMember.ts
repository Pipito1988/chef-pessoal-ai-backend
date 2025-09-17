import pool from '../config/database';
import { HouseholdMember } from '../types';

export class HouseholdMemberModel {
  
  static async addMember(
    userId: string, 
    householdId: string, 
    role: 'owner' | 'member' = 'member'
  ): Promise<HouseholdMember> {
    const query = `
      INSERT INTO household_members (user_id, household_id, role)
      VALUES ($1, $2, $3)
      RETURNING user_id, household_id, role, joined_at
    `;
    
    const result = await pool.query(query, [userId, householdId, role]);
    return result.rows[0];
  }
  
  static async findByUserId(userId: string): Promise<HouseholdMember | null> {
    const query = `
      SELECT user_id, household_id, role, joined_at
      FROM household_members
      WHERE user_id = $1
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  }
  
  static async isMember(userId: string, householdId: string): Promise<boolean> {
    const query = `
      SELECT 1 FROM household_members
      WHERE user_id = $1 AND household_id = $2
      LIMIT 1
    `;
    
    const result = await pool.query(query, [userId, householdId]);
    return result.rows.length > 0;
  }
  
  static async getHouseholdMembers(householdId: string): Promise<HouseholdMember[]> {
    const query = `
      SELECT user_id, household_id, role, joined_at
      FROM household_members
      WHERE household_id = $1
      ORDER BY joined_at ASC
    `;
    
    const result = await pool.query(query, [householdId]);
    return result.rows;
  }
  
  static async removeMember(userId: string, householdId: string): Promise<boolean> {
    const query = `
      DELETE FROM household_members
      WHERE user_id = $1 AND household_id = $2
    `;
    
    const result = await pool.query(query, [userId, householdId]);
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  static async getUserHousehold(userId: string): Promise<string | null> {
    const query = `
      SELECT household_id
      FROM household_members
      WHERE user_id = $1
      LIMIT 1
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows[0]?.household_id || null;
  }
}

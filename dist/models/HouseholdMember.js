"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HouseholdMemberModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class HouseholdMemberModel {
    static async addMember(userId, householdId, role = 'member') {
        const query = `
      INSERT INTO household_members (user_id, household_id, role)
      VALUES ($1, $2, $3)
      RETURNING user_id, household_id, role, joined_at
    `;
        const result = await database_1.default.query(query, [userId, householdId, role]);
        return result.rows[0];
    }
    static async findByUserId(userId) {
        const query = `
      SELECT user_id, household_id, role, joined_at
      FROM household_members
      WHERE user_id = $1
    `;
        const result = await database_1.default.query(query, [userId]);
        return result.rows[0] || null;
    }
    static async isMember(userId, householdId) {
        const query = `
      SELECT 1 FROM household_members
      WHERE user_id = $1 AND household_id = $2
      LIMIT 1
    `;
        const result = await database_1.default.query(query, [userId, householdId]);
        return result.rows.length > 0;
    }
    static async getHouseholdMembers(householdId) {
        const query = `
      SELECT user_id, household_id, role, joined_at
      FROM household_members
      WHERE household_id = $1
      ORDER BY joined_at ASC
    `;
        const result = await database_1.default.query(query, [householdId]);
        return result.rows;
    }
    static async removeMember(userId, householdId) {
        const query = `
      DELETE FROM household_members
      WHERE user_id = $1 AND household_id = $2
    `;
        const result = await database_1.default.query(query, [userId, householdId]);
        return result.rowCount !== null && result.rowCount > 0;
    }
    static async getUserHousehold(userId) {
        const query = `
      SELECT household_id
      FROM household_members
      WHERE user_id = $1
      LIMIT 1
    `;
        const result = await database_1.default.query(query, [userId]);
        return result.rows[0]?.household_id || null;
    }
}
exports.HouseholdMemberModel = HouseholdMemberModel;
//# sourceMappingURL=HouseholdMember.js.map
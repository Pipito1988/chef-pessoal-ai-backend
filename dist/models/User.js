"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = __importDefault(require("../config/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../config");
class UserModel {
    static async create(name, email, password) {
        const passwordHash = await bcrypt_1.default.hash(password, config_1.config.saltRounds);
        const query = `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, password_hash, created_at, updated_at
    `;
        const result = await database_1.default.query(query, [name, email, passwordHash]);
        return result.rows[0];
    }
    static async findByEmail(email) {
        const query = `
      SELECT id, name, email, password_hash, created_at, updated_at
      FROM users
      WHERE email = $1
    `;
        const result = await database_1.default.query(query, [email]);
        return result.rows[0] || null;
    }
    static async findById(id) {
        const query = `
      SELECT id, name, email, password_hash, created_at, updated_at
      FROM users
      WHERE id = $1
    `;
        const result = await database_1.default.query(query, [id]);
        return result.rows[0] || null;
    }
    static async verifyPassword(plainPassword, hashedPassword) {
        return bcrypt_1.default.compare(plainPassword, hashedPassword);
    }
    static toResponse(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    }
    static async emailExists(email) {
        const query = `SELECT 1 FROM users WHERE email = $1 LIMIT 1`;
        const result = await database_1.default.query(query, [email]);
        return result.rows.length > 0;
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=User.js.map
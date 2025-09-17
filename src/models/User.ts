import pool from '../config/database';
import bcrypt from 'bcrypt';
import { config } from '../config';
import { User, UserResponse } from '../types';

export class UserModel {
  
  static async create(name: string, email: string, password: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, config.saltRounds);
    
    const query = `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, password_hash, created_at, updated_at
    `;
    
    const result = await pool.query(query, [name, email, passwordHash]);
    return result.rows[0];
  }
  
  static async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, name, email, password_hash, created_at, updated_at
      FROM users
      WHERE email = $1
    `;
    
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }
  
  static async findById(id: string): Promise<User | null> {
    const query = `
      SELECT id, name, email, password_hash, created_at, updated_at
      FROM users
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
  
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
  
  static toResponse(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
  
  static async emailExists(email: string): Promise<boolean> {
    const query = `SELECT 1 FROM users WHERE email = $1 LIMIT 1`;
    const result = await pool.query(query, [email]);
    return result.rows.length > 0;
  }
}

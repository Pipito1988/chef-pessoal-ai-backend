import pool from '../config/database';
import { Household, AppState, UserResponse, HouseholdResponse } from '../types';

export class HouseholdModel {
  
  static async create(name: string, initialAppState: AppState): Promise<Household> {
    const query = `
      INSERT INTO households (name, app_state)
      VALUES ($1, $2)
      RETURNING id, name, app_state, created_at, updated_at
    `;
    
    const result = await pool.query(query, [name, JSON.stringify(initialAppState)]);
    const household = result.rows[0];
    
    // Parse JSON back to object
    household.app_state = JSON.parse(household.app_state);
    
    return household;
  }
  
  static async findById(id: string): Promise<Household | null> {
    const query = `
      SELECT id, name, app_state, created_at, updated_at
      FROM households
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    
    const household = result.rows[0];
    household.app_state = JSON.parse(household.app_state);
    
    return household;
  }
  
  static async updateAppState(householdId: string, appState: AppState): Promise<boolean> {
    const query = `
      UPDATE households
      SET app_state = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `;
    
    const result = await pool.query(query, [JSON.stringify(appState), householdId]);
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  static async getMembers(householdId: string): Promise<UserResponse[]> {
    const query = `
      SELECT u.id, u.name, u.email, hm.role, hm.joined_at
      FROM users u
      JOIN household_members hm ON u.id = hm.user_id
      WHERE hm.household_id = $1
      ORDER BY hm.joined_at ASC
    `;
    
    const result = await pool.query(query, [householdId]);
    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
    }));
  }
  
  static async toResponse(household: Household): Promise<HouseholdResponse> {
    const members = await this.getMembers(household.id);
    
    return {
      id: household.id,
      name: household.name,
      members,
    };
  }
  
  static getInitialAppState(): AppState {
    return {
      profile: {
        isConfigured: false,
        objetivo: '',
        restricoes: [],
        orcamento_por_jantar_eur: 10,
        equipamento: [],
        pessoas: 4,
        sobras_almoco: true,
        idioma_listas: ['pt-PT', 'fr-FR'],
        refeicoes_a_planear: ['jantar'],
        preferencias_conveniencia: {},
        staples: [],
      },
      inventory: [],
      semana_atual: null,
      historico: [],
      lista_compras: null,
      recipes: [],
      batchPrepPlan: null,
      cookNowSuggestions: null,
    };
  }
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HouseholdModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class HouseholdModel {
    static async create(name, initialAppState) {
        const query = `
      INSERT INTO households (name, app_state)
      VALUES ($1, $2)
      RETURNING id, name, app_state, created_at, updated_at
    `;
        const result = await database_1.default.query(query, [name, JSON.stringify(initialAppState)]);
        const household = result.rows[0];
        household.app_state = JSON.parse(household.app_state);
        return household;
    }
    static async findById(id) {
        const query = `
      SELECT id, name, app_state, created_at, updated_at
      FROM households
      WHERE id = $1
    `;
        const result = await database_1.default.query(query, [id]);
        if (result.rows.length === 0)
            return null;
        const household = result.rows[0];
        household.app_state = JSON.parse(household.app_state);
        return household;
    }
    static async updateAppState(householdId, appState) {
        const query = `
      UPDATE households
      SET app_state = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `;
        const result = await database_1.default.query(query, [JSON.stringify(appState), householdId]);
        return result.rowCount !== null && result.rowCount > 0;
    }
    static async getMembers(householdId) {
        const query = `
      SELECT u.id, u.name, u.email, hm.role, hm.joined_at
      FROM users u
      JOIN household_members hm ON u.id = hm.user_id
      WHERE hm.household_id = $1
      ORDER BY hm.joined_at ASC
    `;
        const result = await database_1.default.query(query, [householdId]);
        return result.rows.map(row => ({
            id: row.id,
            name: row.name,
            email: row.email,
        }));
    }
    static async toResponse(household) {
        const members = await this.getMembers(household.id);
        return {
            id: household.id,
            name: household.name,
            members,
        };
    }
    static getInitialAppState() {
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
exports.HouseholdModel = HouseholdModel;
//# sourceMappingURL=Household.js.map
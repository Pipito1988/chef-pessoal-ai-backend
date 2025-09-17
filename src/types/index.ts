// Tipos baseados no frontend da aplicação Chef Pessoal AI

export interface Profile {
  isConfigured: boolean;
  objetivo: 'manutencao' | 'defice' | 'ganho' | '';
  restricoes: string[];
  orcamento_por_jantar_eur: number;
  equipamento: string[];
  pessoas: number;
  sobras_almoco: boolean;
  idioma_listas: string[];
  refeicoes_a_planear: ('pequeno-almoço' | 'lanche' | 'jantar')[];
  preferencias_conveniencia: {
    [key: string]: 'fazer-em-casa' | 'comprar-pronto';
  };
  staples: string[];
}

export interface InventoryItem {
  item: string;
  quantidade: number;
  unidade: string;
  validade: string; // YYYY-MM-DD
  prioridade: number; // 1=high, 2=medium, 3=low
}

export interface Meal {
  id: string; // Unique ID, e.g., "2024-07-29-jantar"
  tipo: 'pequeno-almoço' | 'almoço' | 'lanche' | 'jantar';
  receita_id: string | null;
  descricao?: string; // e.g., "Sobras" ou "Jantar fora"
  porcoes: number;
  sobras_previstas: number;
  estado: 'planeado' | 'cozinhado';
}

export interface DayPlan {
  dia: string; // YYYY-MM-DD
  refeicoes: Meal[];
}

export interface WeekPlan {
  semana_iso: string;
  dias: DayPlan[];
}

export interface RecipeIngredient {
  item: string;
  qtd: number;
  un: string;
  formato_compra?: string;
}

export interface RecipeMacros {
  kcal: number;
  P: number; // Proteína
  C: number; // Carboidratos
  G: number; // Gordura
}

export interface Recipe {
  id: string;
  nome: string;
  tempo_ativo_min: number;
  tempo_total_min: number;
  dificuldade: string;
  rendimento_porcoes: number;
  ingredientes: RecipeIngredient[];
  utensilios: string[];
  mise_en_place: string[];
  passos: string[];
  acabamento: string;
  macros_por_porção: RecipeMacros;
  custo_eur: number;
  sobras: {
    porcoes: number;
    conservacao: string;
    reaquecimento: string;
  };
  substituicoes: { se: string; usar: string }[];
  notas: string;
}

export interface ShoppingListItem {
  id: string;
  categoria: string;
  pt: string;
  fr: string;
  quantidade_total: string;
  formato: string;
  preco_estimado_eur: number;
  origem: 'comprar' | 'inventario' | 'diferença' | 'custom';
  checked: boolean;
}

export interface CategoriaSubtotal {
  categoria: string;
  subtotal: number;
}

export interface ShoppingList {
  itens: ShoppingListItem[];
  subtotal_por_categoria: CategoriaSubtotal[];
  total: number;
}

export interface DailyPrep {
  day: string;
  task: string;
}

export interface BatchPrepPlan {
  preparacao_domingo: string[];
  micro_tarefas_diarias: DailyPrep[];
}

// Estado da aplicação (sem session - isso é gerido pelo backend)
export interface AppState {
  profile: Profile;
  inventory: InventoryItem[];
  semana_atual: WeekPlan | null;
  historico: any[]; // Define more strictly if needed
  lista_compras: ShoppingList | null;
  recipes: Recipe[];
  batchPrepPlan: BatchPrepPlan | null;
  cookNowSuggestions: Recipe[] | null;
}

// Tipos específicos do backend
export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface Household {
  id: string;
  name: string;
  app_state: AppState;
  created_at: Date;
  updated_at: Date;
}

export interface HouseholdMember {
  user_id: string;
  household_id: string;
  role: 'owner' | 'member';
  joined_at: Date;
}

// Tipos para respostas da API
export interface UserResponse {
  id: string;
  name: string;
  email: string;
}

export interface HouseholdResponse {
  id: string;
  name: string;
  members: UserResponse[];
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
  household: HouseholdResponse;
}

// Tipos para requests
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface InviteRequest {
  email: string;
}

// JWT Payload
export interface JWTPayload {
  sub: string; // user_id
  household_id: string;
  email: string;
  iat: number;
  exp: number;
}

// Tipos para erros
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

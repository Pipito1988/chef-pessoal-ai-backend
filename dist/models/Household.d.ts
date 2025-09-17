import { Household, AppState, UserResponse, HouseholdResponse } from '../types';
export declare class HouseholdModel {
    static create(name: string, initialAppState: AppState): Promise<Household>;
    static findById(id: string): Promise<Household | null>;
    static updateAppState(householdId: string, appState: AppState): Promise<boolean>;
    static getMembers(householdId: string): Promise<UserResponse[]>;
    static toResponse(household: Household): Promise<HouseholdResponse>;
    static getInitialAppState(): AppState;
}
//# sourceMappingURL=Household.d.ts.map
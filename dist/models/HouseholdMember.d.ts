import { HouseholdMember } from '../types';
export declare class HouseholdMemberModel {
    static addMember(userId: string, householdId: string, role?: 'owner' | 'member'): Promise<HouseholdMember>;
    static findByUserId(userId: string): Promise<HouseholdMember | null>;
    static isMember(userId: string, householdId: string): Promise<boolean>;
    static getHouseholdMembers(householdId: string): Promise<HouseholdMember[]>;
    static removeMember(userId: string, householdId: string): Promise<boolean>;
    static getUserHousehold(userId: string): Promise<string | null>;
}
//# sourceMappingURL=HouseholdMember.d.ts.map
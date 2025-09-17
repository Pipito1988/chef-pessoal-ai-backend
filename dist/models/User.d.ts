import { User, UserResponse } from '../types';
export declare class UserModel {
    static create(name: string, email: string, password: string): Promise<User>;
    static findByEmail(email: string): Promise<User | null>;
    static findById(id: string): Promise<User | null>;
    static verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
    static toResponse(user: User): UserResponse;
    static emailExists(email: string): Promise<boolean>;
}
//# sourceMappingURL=User.d.ts.map
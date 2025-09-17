import { Request, Response, NextFunction } from 'express';
export declare const isValidEmail: (email: string) => boolean;
export declare const isValidPassword: (password: string) => boolean;
export declare const validateSignup: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateLogin: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateInvite: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateAppState: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validation.d.ts.map
import { Role } from './role';

export class User {
    id: number;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
    token?: string;
    pwdExpiry?: boolean;
    refreshToken?: string;
    roleIds?: string;
    signUpDone?: boolean;
    signUpDoneOn?: string;
    email?: string;
    mobile?: string;
    active?: boolean;
    fromFileUpload?: boolean;
    lastLoginTime?: any;
    tenantId?: string;
    tenantName?: string;
    createdOn?: string;
    updatedOn?: string;
    createdBy?: number;
}

export interface SessionUser {
    firstName: string;
    lastName: string;
    pwdExpiry: boolean;
    refreshToken: string;
    roleIds: number;
    signUpDone: boolean;
    tenantId: string;
    token: string;
    userName: string;
    userId: number;
}

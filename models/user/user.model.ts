export interface MeResponse {
    id: string;
    email: string;
    isActive: boolean;
}

export interface CreateUserModel {
    email:string,
    firstName:string,
    lastName:string,
}

export interface UpdateUserModel {
    firstName:string,
    lastName:string,
    isActive?:boolean
}
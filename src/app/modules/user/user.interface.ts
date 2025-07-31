
export enum Role {
    ADMIN = "ADMIN",
    SENDER = "SENDER",
    RECEIVER = "RECEIVER"
}
export interface IUser {
    _id: string
    name: string;
    email: string;
    password: string;
    phone: string;
    role: Role;
    isBlock?: boolean;
    isActive?: boolean;
    createdAt?: Date;
}
  

 

  
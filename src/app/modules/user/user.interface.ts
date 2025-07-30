
export enum Role {
    ADMIN = "ADMIN",
    SENDER = "SENDER",
    RECEIVER = "RECEIVER"
}
export interface Address {
    city: string,
    street: string,
    zip: string
}
export interface IUser {
    _id: string
    name: string;
    email: string;
    password: string;
    phone: string;
    address: Address;
    role: Role;
    isActive?: boolean;
    createdAt?: Date;
}

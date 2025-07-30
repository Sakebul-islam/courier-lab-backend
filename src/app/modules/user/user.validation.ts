
import { z } from "zod";
import { Role } from "./user.interface";


export const addressSchema = z.object({
    city: z.string().min(2, "City is required"),
    street: z.string().min(2, "Street is required"),
    zip: z.string().min(3, "ZIP is required"),
});

export const createUserZodSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().min(11, "Phone must be valid"),
    address: addressSchema,
    role: z.enum(Object.values(Role)),
    isActive: z.boolean().optional(),
});

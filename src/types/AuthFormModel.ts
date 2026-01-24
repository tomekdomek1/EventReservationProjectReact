import { z } from "zod";

export const LoginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean()
});

export const RegisterSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    phone: z.string()
        .regex(/^\+?[1-9]\d{9,14}$/, "Invalid Phone Number Format (min 10 digits, e.g., 9765967148)"),
    country: z.string().min(2, "Country is required")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const UpdateProfileSchema = z.object({
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    phone: z.string()
        .regex(/^\+?[1-9]\d{9,14}$/, "Invalid Phone Number Format (min 10 digits, e.g., 9765967148)"),
    country: z.string().min(2, "Country is required"),
});

export const ChangePasswordSchema = z.object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmNewPassword: z.string().min(6, "Confirm new password must be at least 6 characters")
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
});


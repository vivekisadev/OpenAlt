import { z } from "zod";

export const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 20 characters").regex(/^[a-zA-Z0-9_]+$/, "Username must only contain letters, numbers, and underscores"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password is too long"),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const submitToolSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
    category: z.string().min(2, "Category is required"),
    description: z.string().min(10, "Description must be at least 10 characters").max(160, "Short description is too long"),
    longDescription: z.string().optional(),
    url: z.string().url("Invalid URL"),
    githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
    tags: z.union([z.string(), z.array(z.string())]).optional(),
    logo: z.string().url("Invalid logo URL").optional().or(z.literal("")),
    image: z.string().url("Invalid image URL").optional().or(z.literal("")),
    features: z.union([z.string(), z.array(z.string())]).optional(),
    paidAlternative: z.string().optional(),
    pricing: z.enum(["Free / Open Source", "Free Tier Available", "Paid", "Enterprise"]),
});

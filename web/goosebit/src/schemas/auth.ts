import { z } from "zod";

export const LoginFormSchema = z.object({
  username: z.string().min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(5, { message: "Password must be at least 5 characters" }),
});

export type LoginForm = z.infer<typeof LoginFormSchema>;

export const RegisterFormSchema = z
  .object({
    username: z
      .string()
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(5, { message: "Password must be at least 5 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Password confirmation is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterForm = z.infer<typeof RegisterFormSchema>;

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export type RegisterResponse = {
  id: string;
  username: string;
  enabled: boolean;
};

export type SetupStatusResponse = {
  needsSetup: boolean;
};

export type User = {
  username: string;
};

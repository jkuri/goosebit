import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { api } from "@/api/client";
import { Logo } from "@/components/shared/logo";
import { PasswordInput } from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSetupStatus } from "@/hooks/use-setup-status";
import {
  type LoginForm,
  LoginFormSchema,
  type LoginResponse,
} from "@/schemas/auth";
import { useAuthStore } from "@/stores/auth";

const loginUser = async (credentials: LoginForm): Promise<LoginResponse> => {
  try {
    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    return await api.request<LoginResponse>(
      "/login",
      { method: "POST", body: formData },
      true,
    );
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Login failed");
  }
};

export function Login() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);
  const { data: setupStatus } = useSetupStatus();

  const usernameId = useId();
  const passwordId = useId();

  const form = useForm<LoginForm>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: { username: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setToken(data);
      navigate("/devices");
    },
    onError: () => {
      form.resetField("password");
    },
  });

  useEffect(() => {
    if (token) {
      navigate("/devices", { replace: true });
    } else if (setupStatus?.needsSetup) {
      navigate("/register", { replace: true });
    }
  }, [token, navigate, setupStatus?.needsSetup]);

  const onSubmit = (data: LoginForm) => {
    mutation.mutate(data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="flex min-h-dvh w-full flex-wrap items-center justify-center sm:items-start sm:pt-36">
      <div className="flex w-full flex-col gap-6 px-6 sm:w-96">
        <div className="flex justify-center">
          <Logo className="h-18" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {mutation.error && (
            <div className="rounded-md border border-red-500/60 px-4 py-3 text-red-600">
              <p className="text-sm">
                <AlertCircle
                  className="-mt-0.5 me-3 inline-flex h-4 w-4 opacity-60"
                  aria-hidden="true"
                />
                {mutation.error.message}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor={usernameId} className="font-medium text-sm">
              Email
            </label>
            <Input
              id={usernameId}
              type="text"
              placeholder="admin@goosebit.local"
              disabled={mutation.isPending}
              aria-invalid={!!errors.username}
              {...register("username")}
            />
            {errors.username?.message && (
              <p className="text-red-600 text-sm">{errors.username.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={passwordId} className="font-medium text-sm">
              Password
            </label>
            <PasswordInput
              id={passwordId}
              placeholder="******"
              disabled={mutation.isPending}
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password?.message && (
              <p className="text-red-600 text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="mt-2 w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}

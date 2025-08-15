import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { api } from "@/api/client";
import { Loading } from "@/components/shared/loading";
import { Logo } from "@/components/shared/logo";
import { PasswordInput } from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSetupStatus } from "@/hooks/use-setup-status";
import {
  type LoginResponse,
  type RegisterForm,
  RegisterFormSchema,
} from "@/schemas/auth";
import { useAuthStore } from "@/stores/auth";

const registerUser = async (
  credentials: RegisterForm,
): Promise<LoginResponse> => {
  try {
    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    return await api.request<LoginResponse>(
      "/setup",
      { method: "POST", body: formData },
      true,
    );
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Registration failed");
  }
};

export function Register() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);
  const { data: setupStatus, isLoading, error } = useSetupStatus();

  const usernameId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: { username: "", password: "", confirmPassword: "" },
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setToken(data);
      navigate("/devices");
    },
    onError: () => {
      form.resetField("password");
      form.resetField("confirmPassword");
    },
  });

  useEffect(() => {
    if (token) {
      navigate("/devices", { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    if (setupStatus && !setupStatus.needsSetup) {
      navigate("/login", { replace: true });
    }
  }, [setupStatus, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh w-full flex-wrap items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex min-h-svh items-center justify-center">
        <p className="text-sm">Error loading setup status: {error.message}</p>
      </div>
    );
  }

  const onSubmit = (data: RegisterForm) => {
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

        <div className="rounded-md border px-4 py-3">
          <p className="text-center font-medium text-sm">
            Welcome to Goosebit. Create an admin user.
          </p>
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
              type="email"
              placeholder="user@goosebit.local"
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

          <div className="flex flex-col gap-2">
            <label htmlFor={confirmPasswordId} className="font-medium text-sm">
              Confirm Password
            </label>
            <PasswordInput
              id={confirmPasswordId}
              placeholder="******"
              disabled={mutation.isPending}
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword?.message && (
              <p className="text-red-600 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="mt-2 w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </div>
    </div>
  );
}

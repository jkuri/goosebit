import { Navigate, useLocation } from "react-router";
import { useSetupStatus } from "@/hooks/use-setup-status";
import { useAuthStore } from "@/stores/auth";
import { Loading } from "./shared/loading";

interface SetupGuardProps {
  children: React.ReactNode;
}

export function SetupGuard({ children }: SetupGuardProps) {
  const { data: setupStatus, isLoading, error } = useSetupStatus();
  const token = useAuthStore((state) => state.token);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="relative flex min-h-svh items-center justify-center">
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

  if (setupStatus?.needsSetup && !token && location.pathname !== "/register") {
    return <Navigate to="/register" replace />;
  }

  return <>{children}</>;
}

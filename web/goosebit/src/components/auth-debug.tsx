import { useUser } from "@/hooks/use-user";
import { useAuthStore } from "@/stores/auth";

/**
 * Debug component to show auth store and user hook states
 * Useful for debugging authentication issues
 */
export function AuthDebug() {
  const token = useAuthStore((state) => state.token);
  const { user, isAuthenticated: userHookAuth } = useUser();

  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
      <h3 className="mb-2 font-semibold text-yellow-800">Auth Debug Info</h3>
      <div className="space-y-1 text-sm">
        <div>
          <strong>Auth Store - Has Token:</strong>{" "}
          <span className={token ? "text-green-600" : "text-red-600"}>
            {token ? "Yes" : "No"}
          </span>
        </div>
        <div>
          <strong>Auth Store - Is Authenticated:</strong>{" "}
          <span className={token ? "text-green-600" : "text-red-600"}>
            {token ? "Yes" : "No"}
          </span>
        </div>
        <div>
          <strong>User Hook - Has User:</strong>{" "}
          <span className={user ? "text-green-600" : "text-red-600"}>
            {user ? "Yes" : "No"}
          </span>
        </div>
        <div>
          <strong>User Hook - Is Authenticated:</strong>{" "}
          <span className={userHookAuth ? "text-green-600" : "text-red-600"}>
            {userHookAuth ? "Yes" : "No"}
          </span>
        </div>
        {token && (
          <div>
            <strong>Token (first 20 chars):</strong>{" "}
            <code className="text-xs">{token.substring(0, 20)}...</code>
          </div>
        )}
      </div>
    </div>
  );
}

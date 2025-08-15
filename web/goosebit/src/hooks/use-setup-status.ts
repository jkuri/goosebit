import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import type { SetupStatusResponse } from "@/schemas/auth";

const fetchSetupStatus = async (): Promise<SetupStatusResponse> => {
  const response = await api.get<{ needsSetup: boolean }>("/setup", {}, true);

  return {
    needsSetup: response.needsSetup,
  };
};

export const useSetupStatus = () => {
  return useQuery({
    queryKey: ["setup-status"],
    queryFn: fetchSetupStatus,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

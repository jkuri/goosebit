import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/api/client";
import type {
  DeviceColumnConfig,
  DeviceDeleteRequest,
  DevicesResponse,
  DeviceUpdateRequest,
  SoftwareOption,
} from "@/schemas/devices";
import { useDevicesStore } from "@/stores/devices";

// API functions
const fetchDevices = async (params?: {
  start?: number;
  length?: number;
  search?: string;
  order?: { column: number; dir: "asc" | "desc" };
}): Promise<DevicesResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.start !== undefined) {
    searchParams.append("start", params.start.toString());
  }
  if (params?.length !== undefined) {
    searchParams.append("length", params.length.toString());
  }
  if (params?.search) {
    searchParams.append("search[value]", params.search);
  }
  if (params?.order) {
    searchParams.append(`order[0][column]`, params.order.column.toString());
    searchParams.append(`order[0][dir]`, params.order.dir);
  }

  const url = `/ui/bff/devices${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  return api.get<DevicesResponse>(url);
};

const fetchDeviceColumns = async (): Promise<DeviceColumnConfig> => {
  return api.get<DeviceColumnConfig>("/ui/bff/devices/columns");
};

const updateDevices = async (data: DeviceUpdateRequest): Promise<void> => {
  return api.patch<void>("/ui/bff/devices", data);
};

const deleteDevices = async (data: DeviceDeleteRequest): Promise<void> => {
  return api.delete<void>("/ui/bff/devices", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

const fetchSoftwareOptions = async (): Promise<SoftwareOption[]> => {
  return api.get<SoftwareOption[]>("/ui/bff/software");
};

// Hooks
export const useDevices = (params?: {
  start?: number;
  length?: number;
  search?: string;
  order?: { column: number; dir: "asc" | "desc" };
}) => {
  const setDevices = useDevicesStore((state) => state.setDevices);
  const setLoading = useDevicesStore((state) => state.setLoading);
  const setError = useDevicesStore((state) => state.setError);

  const query = useQuery<DevicesResponse>({
    queryKey: ["devices", params],
    queryFn: () => fetchDevices(params),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  });

  // Update store when data changes using useEffect
  useEffect(() => {
    if (query.data && !query.isLoading) {
      setDevices(query.data.data);
      setLoading(false);
      setError(null);
    } else if (query.error) {
      setError(
        query.error instanceof Error
          ? query.error.message
          : "Failed to fetch devices",
      );
      setLoading(false);
    } else if (query.isLoading) {
      setLoading(true);
    }
  }, [
    query.data,
    query.error,
    query.isLoading,
    setDevices,
    setLoading,
    setError,
  ]);

  return query;
};

export const useDeviceColumns = () => {
  return useQuery<DeviceColumnConfig>({
    queryKey: ["device-columns"],
    queryFn: fetchDeviceColumns,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateDevices = () => {
  const queryClient = useQueryClient();
  const clearSelection = useDevicesStore((state) => state.clearSelection);

  return useMutation({
    mutationFn: updateDevices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      clearSelection();
      toast.success("Devices updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update devices",
      );
    },
  });
};

export const useDeleteDevices = () => {
  const queryClient = useQueryClient();
  const clearSelection = useDevicesStore((state) => state.clearSelection);

  return useMutation({
    mutationFn: deleteDevices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      clearSelection();
      toast.success("Devices deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete devices",
      );
    },
  });
};

export const useSoftwareOptions = () => {
  return useQuery<SoftwareOption[]>({
    queryKey: ["software-options"],
    queryFn: async () => {
      try {
        return await fetchSoftwareOptions();
      } catch (error) {
        // Return empty array if software endpoint is not available
        if (error instanceof Error && error.message.includes("404")) {
          console.warn("Software endpoint not available");
          return [];
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on 404
  });
};

import { useState } from "react";
import { DeviceConfigModal } from "@/components/devices/device-config-modal";
import { DevicesDataTable } from "@/components/devices/devices-data-table";
import { DevicesToolbar } from "@/components/devices/devices-toolbar";
import { useDevices } from "@/hooks/use-devices";

export function Devices() {
  const [tableParams] = useState({
    start: 0,
    length: 50,
    search: "",
    order: { column: 0, dir: "asc" as const },
  });
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const { data: devicesResponse, isLoading, error } = useDevices(tableParams);

  const devices = devicesResponse?.data || [];

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-xl">Devices</h1>
        <div className="rounded-md border border-destructive bg-destructive/10 p-4">
          <p className="text-destructive">
            Error loading devices:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-xl">Devices</h1>
        <div className="text-muted-foreground text-sm">
          {devices.length} device{devices.length !== 1 ? "s" : ""}
        </div>
      </div>

      <DevicesToolbar onConfigureDevices={() => setIsConfigModalOpen(true)} />

      <DevicesDataTable data={devices} isLoading={isLoading} />

      <DeviceConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />
    </div>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSoftwareOptions, useUpdateDevices } from "@/hooks/use-devices";
import { useDevicesStore } from "@/stores/devices";

const DeviceConfigSchema = z.object({
  name: z.string().min(1, "Name is required"),
  feed: z.string().nullable(),
  software: z.string().nullable(),
});

type DeviceConfigForm = z.infer<typeof DeviceConfigSchema>;

interface DeviceConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeviceConfigModal({ isOpen, onClose }: DeviceConfigModalProps) {
  const [configType, setConfigType] = useState<"name" | "manual" | "latest">(
    "name",
  );

  const { getSelectedDevicesData } = useDevicesStore();
  const selectedDevices = getSelectedDevicesData();
  const selectedDevice = selectedDevices[0];

  const { data: softwareOptions = [] } = useSoftwareOptions();
  const updateDevicesMutation = useUpdateDevices();

  const form = useForm<DeviceConfigForm>({
    resolver: zodResolver(DeviceConfigSchema),
    defaultValues: {
      name: selectedDevice?.name || "",
      feed: selectedDevice?.feed || null,
      software: selectedDevice?.software || null,
    },
  });

  const handleSubmit = async (data: DeviceConfigForm) => {
    const deviceIds = selectedDevices.map((device) => device.id);

    try {
      switch (configType) {
        case "name":
          await updateDevicesMutation.mutateAsync({
            devices: deviceIds,
            name: data.name,
          });
          break;

        case "manual":
          await updateDevicesMutation.mutateAsync({
            devices: deviceIds,
            feed: null,
            software: data.software,
          });
          break;
        case "latest":
          await updateDevicesMutation.mutateAsync({
            devices: deviceIds,
            feed: null,
            software: "latest",
          });
          break;
      }
      onClose();
    } catch (error) {
      console.error("Failed to update devices:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configure Devices</DialogTitle>
          <DialogDescription>
            Configuring {selectedDevices.length} device
            {selectedDevices.length !== 1 ? "s" : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 flex space-x-2">
          <Button
            variant={configType === "name" ? "default" : "outline"}
            size="sm"
            onClick={() => setConfigType("name")}
          >
            Name
          </Button>

          <Button
            variant={configType === "manual" ? "default" : "outline"}
            size="sm"
            onClick={() => setConfigType("manual")}
          >
            Manual
          </Button>
          <Button
            variant={configType === "latest" ? "default" : "outline"}
            size="sm"
            onClick={() => setConfigType("latest")}
          >
            Latest
          </Button>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {configType === "name" && (
            <div>
              <label htmlFor="name" className="block font-medium text-sm">
                Device Name
              </label>
              <Input
                {...form.register("name")}
                placeholder="Enter device name"
              />
              {form.formState.errors.name && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
          )}

          {configType === "manual" && (
            <div>
              <Label className="block font-medium text-sm">
                Software Version
              </Label>
              <Select
                value={form.watch("software") || ""}
                onValueChange={(value) => form.setValue("software", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select software version" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(softwareOptions) &&
                  softwareOptions.length > 0 ? (
                    softwareOptions.map((software) => (
                      <SelectItem key={software.id} value={software.id}>
                        {software.name} - {software.version}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No software versions available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {configType === "latest" && (
            <div className="text-muted-foreground text-sm">
              This will configure the selected devices to use the latest
              available software version.
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateDevicesMutation.isPending}>
              {updateDevicesMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

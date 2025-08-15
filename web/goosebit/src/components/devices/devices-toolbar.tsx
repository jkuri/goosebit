import {
  CheckIcon,
  PenIcon,
  PinIcon,
  TrashIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteDevices, useUpdateDevices } from "@/hooks/use-devices";
import { useDevicesStore } from "@/stores/devices";

interface DevicesToolbarProps {
  onConfigureDevices?: () => void;
}

export function DevicesToolbar({ onConfigureDevices }: DevicesToolbarProps) {
  const { selectedDevices, selectAllDevices, clearSelection } =
    useDevicesStore();

  const updateDevicesMutation = useUpdateDevices();
  const deleteDevicesMutation = useDeleteDevices();

  const hasSelection = selectedDevices.size > 0;

  const handleSelectAll = () => {
    selectAllDevices();
  };

  const handleClearSelection = () => {
    clearSelection();
  };

  const handleConfigureDevices = () => {
    if (onConfigureDevices) {
      onConfigureDevices();
    }
  };

  const handleForceUpdate = async () => {
    if (hasSelection) {
      const deviceIds = Array.from(selectedDevices);
      await updateDevicesMutation.mutateAsync({
        devices: deviceIds,
        force_update: true,
      });
    }
  };

  const handlePinDevices = async () => {
    if (hasSelection) {
      const deviceIds = Array.from(selectedDevices);
      await updateDevicesMutation.mutateAsync({
        devices: deviceIds,
        pinned: true,
      });
    }
  };

  const handleDeleteDevices = async () => {
    if (hasSelection) {
      const deviceIds = Array.from(selectedDevices);
      await deleteDevicesMutation.mutateAsync({
        devices: deviceIds,
      });
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          className="h-8"
        >
          <CheckIcon className="size-4" />
          Select All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearSelection}
          disabled={!hasSelection}
          className="h-8"
        >
          <XIcon className="size-4" />
          Clear
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleConfigureDevices}
          disabled={!hasSelection}
          className="h-8"
        >
          <PenIcon className="size-4" />
          Configure
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleForceUpdate}
          disabled={!hasSelection}
          className="h-8"
        >
          <UploadIcon className="size-4" />
          Force Update
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePinDevices}
          disabled={!hasSelection}
          className="h-8"
        >
          <PinIcon className="size-4" />
          Pin Version
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              disabled={!hasSelection}
              className="h-8"
            >
              <TrashIcon className="size-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Devices</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedDevices.size} device
                {selectedDevices.size !== 1 ? "s" : ""}? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteDevices}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

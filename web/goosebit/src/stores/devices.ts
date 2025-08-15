import { create } from "zustand";
import type { Device } from "@/schemas/devices";

type DevicesStoreState = {
  selectedDevices: Set<string>;
  devices: Device[];
  isLoading: boolean;
  error: string | null;
};

type DevicesStoreActions = {
  setSelectedDevices: (deviceIds: Set<string>) => void;
  selectDevice: (deviceId: string) => void;
  deselectDevice: (deviceId: string) => void;
  selectAllDevices: () => void;
  clearSelection: () => void;
  toggleDeviceSelection: (deviceId: string) => void;
  setDevices: (devices: Device[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  getSelectedDevicesData: () => Device[];
};

export const useDevicesStore = create<
  DevicesStoreState & DevicesStoreActions
>()((set, get) => ({
  selectedDevices: new Set(),
  devices: [],
  isLoading: false,
  error: null,

  setSelectedDevices: (deviceIds) => {
    set({ selectedDevices: new Set(deviceIds) });
  },

  selectDevice: (deviceId) => {
    const { selectedDevices } = get();
    const newSelection = new Set(selectedDevices);
    newSelection.add(deviceId);
    set({ selectedDevices: newSelection });
  },

  deselectDevice: (deviceId) => {
    const { selectedDevices } = get();
    const newSelection = new Set(selectedDevices);
    newSelection.delete(deviceId);
    set({ selectedDevices: newSelection });
  },

  selectAllDevices: () => {
    const { devices } = get();
    const allDeviceIds = new Set(devices.map((device) => device.id));
    set({ selectedDevices: allDeviceIds });
  },

  clearSelection: () => {
    set({ selectedDevices: new Set() });
  },

  toggleDeviceSelection: (deviceId) => {
    const { selectedDevices } = get();
    if (selectedDevices.has(deviceId)) {
      get().deselectDevice(deviceId);
    } else {
      get().selectDevice(deviceId);
    }
  },

  setDevices: (devices) => {
    set({ devices });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error });
  },

  getSelectedDevicesData: () => {
    const { devices, selectedDevices } = get();
    return devices.filter((device) => selectedDevices.has(device.id));
  },
}));

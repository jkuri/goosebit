import { z } from "zod";

export const DeviceSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  sw_version: z.string(),
  feed: z.string(),
  progress: z.number().nullable(),
  last_state: z.string(),
  update_mode: z.string(),
  force_update: z.boolean(),
  last_ip: z.string(),
  last_seen: z.number(),
  auth_token: z.string().nullable(),
  polling: z.boolean(),
  sw_target_version: z.string().nullable(),
  sw_assigned: z.string().nullable(),
  hw_model: z.string(),
  hw_revision: z.string(),
  poll_seconds: z.number(),
  // Legacy fields for compatibility
  pinned: z.boolean().optional(),
  software: z.string().nullable().optional(),
});

export type Device = z.infer<typeof DeviceSchema>;

export const DeviceColumnConfigSchema = z.object({
  columns: z.array(
    z.object({
      data: z.string(),
      title: z.string().optional(),
      orderable: z.boolean().optional(),
      searchable: z.boolean().optional(),
    }),
  ),
});

export type DeviceColumnConfig = z.infer<typeof DeviceColumnConfigSchema>;

export const DevicesResponseSchema = z.object({
  data: z.array(DeviceSchema),
  draw: z.number().optional(),
  recordsTotal: z.number(),
  recordsFiltered: z.number(),
});

export type DevicesResponse = z.infer<typeof DevicesResponseSchema>;

export const DeviceUpdateRequestSchema = z.object({
  devices: z.array(z.string()),
  name: z.string().optional(),
  feed: z.string().nullable().optional(),
  software: z.string().nullable().optional(),
  force_update: z.boolean().optional(),
  pinned: z.boolean().optional(),
});

export type DeviceUpdateRequest = z.infer<typeof DeviceUpdateRequestSchema>;

export const DeviceDeleteRequestSchema = z.object({
  devices: z.array(z.string()),
});

export type DeviceDeleteRequest = z.infer<typeof DeviceDeleteRequestSchema>;

export const SoftwareOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
});

export type SoftwareOption = z.infer<typeof SoftwareOptionSchema>;

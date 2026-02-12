import { z } from "zod";

export const barberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  bio: z.string().optional(),
  bioEt: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});

export const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nameEt: z.string().min(1, "Estonian name is required"),
  description: z.string().optional(),
  descriptionEt: z.string().optional(),
  category: z.string().optional(),
  categoryEt: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});

export const barberServiceSchema = z.object({
  barberId: z.string().min(1),
  serviceId: z.string().min(1),
  price: z.number().positive("Price must be positive"),
  duration: z.number().int().positive("Duration must be positive"),
  isActive: z.boolean().default(true),
});

export const scheduleSchema = z.object({
  barberId: z.string().min(1),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  isWorking: z.boolean(),
});

export const bookingSchema = z.object({
  barberId: z.string().min(1),
  serviceId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  clientName: z.string().min(1, "Name is required"),
  clientPhone: z.string().min(1, "Phone is required"),
  clientEmail: z.string().email().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export const salonSettingsSchema = z.object({
  salonName: z.string().min(1),
  salonNameEt: z.string().min(1),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  timeSlotInterval: z.number().int().min(5).max(60),
  bookingLeadTime: z.number().int().min(0),
  maxAdvanceDays: z.number().int().min(1).max(365),
});

export type BarberInput = z.infer<typeof barberSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type BarberServiceInput = z.infer<typeof barberServiceSchema>;
export type ScheduleInput = z.infer<typeof scheduleSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type SalonSettingsInput = z.infer<typeof salonSettingsSchema>;

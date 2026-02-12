import { prisma } from "@/lib/prisma";

interface TimeSlot {
  startTime: string; // "14:00"
  endTime: string; // "14:30"
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function slotsOverlap(
  s1Start: number,
  s1End: number,
  s2Start: number,
  s2End: number
): boolean {
  return s1Start < s2End && s1End > s2Start;
}

export async function getAvailableSlots(
  barberId: string,
  serviceId: string,
  date: Date
): Promise<TimeSlot[]> {
  const dayOfWeek = date.getDay(); // 0=Sunday ... 6=Saturday

  // 1. Get barber's schedule for this day
  const schedule = await prisma.workSchedule.findUnique({
    where: { barberId_dayOfWeek: { barberId, dayOfWeek } },
  });

  if (!schedule || !schedule.isWorking) return [];

  // 2. Get breaks for this day
  const breaks = await prisma.scheduleBreak.findMany({
    where: { barberId, dayOfWeek },
  });

  // 3. Get existing appointments (not cancelled)
  const appointments = await prisma.appointment.findMany({
    where: {
      barberId,
      date,
      status: { not: "CANCELLED" },
    },
  });

  // 4. Get service duration
  const barberService = await prisma.barberService.findUnique({
    where: { barberId_serviceId: { barberId, serviceId } },
  });

  if (!barberService) return [];

  // 5. Get salon settings
  const settings = await prisma.salonSettings.findUnique({
    where: { id: "default" },
  });

  const interval = settings?.timeSlotInterval ?? 15;
  const leadTime = settings?.bookingLeadTime ?? 60;
  const duration = barberService.duration;

  const schedStart = timeToMinutes(schedule.startTime);
  const schedEnd = timeToMinutes(schedule.endTime);

  // Current time + lead time in minutes
  const now = new Date();
  const today = new Date(date);
  today.setHours(0, 0, 0, 0);
  const nowDate = new Date(now);
  nowDate.setHours(0, 0, 0, 0);

  const isToday = today.getTime() === nowDate.getTime();
  const currentMinutes = isToday
    ? now.getHours() * 60 + now.getMinutes() + leadTime
    : 0;

  // Convert breaks and appointments to minute ranges
  const breakRanges = breaks.map((b) => ({
    start: timeToMinutes(b.startTime),
    end: timeToMinutes(b.endTime),
  }));

  const appointmentRanges = appointments.map((a) => ({
    start: timeToMinutes(a.startTime),
    end: timeToMinutes(a.endTime),
  }));

  // 6. Generate candidate slots
  const slots: TimeSlot[] = [];

  for (let slotStart = schedStart; slotStart + duration <= schedEnd; slotStart += interval) {
    const slotEnd = slotStart + duration;

    // Skip if too soon (today only)
    if (slotStart < currentMinutes) continue;

    // Check if overlaps any break
    const overlapsBreak = breakRanges.some((b) =>
      slotsOverlap(slotStart, slotEnd, b.start, b.end)
    );
    if (overlapsBreak) continue;

    // Check if overlaps any existing appointment
    const overlapsAppointment = appointmentRanges.some((a) =>
      slotsOverlap(slotStart, slotEnd, a.start, a.end)
    );
    if (overlapsAppointment) continue;

    slots.push({
      startTime: minutesToTime(slotStart),
      endTime: minutesToTime(slotEnd),
    });
  }

  return slots;
}

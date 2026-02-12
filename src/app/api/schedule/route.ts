import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const { barberId, schedules, breaks: scheduleBreaks } = body;

  // Upsert schedules for each day
  for (const schedule of schedules) {
    await prisma.workSchedule.upsert({
      where: {
        barberId_dayOfWeek: {
          barberId,
          dayOfWeek: schedule.dayOfWeek,
        },
      },
      update: {
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        isWorking: schedule.isWorking,
      },
      create: {
        barberId,
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        isWorking: schedule.isWorking,
      },
    });
  }

  // Replace breaks
  if (scheduleBreaks) {
    await prisma.scheduleBreak.deleteMany({ where: { barberId } });
    for (const brk of scheduleBreaks) {
      await prisma.scheduleBreak.create({
        data: {
          barberId,
          dayOfWeek: brk.dayOfWeek,
          startTime: brk.startTime,
          endTime: brk.endTime,
          label: brk.label,
        },
      });
    }
  }

  return NextResponse.json({ success: true });
}

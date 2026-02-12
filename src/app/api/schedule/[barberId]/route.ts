import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ barberId: string }> }
) {
  const { barberId } = await params;
  const [schedules, breaks] = await Promise.all([
    prisma.workSchedule.findMany({
      where: { barberId },
      orderBy: { dayOfWeek: "asc" },
    }),
    prisma.scheduleBreak.findMany({
      where: { barberId },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    }),
  ]);
  return NextResponse.json({ schedules, breaks });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { bookingSchema } from "@/lib/validators";
import { getAvailableSlots } from "@/lib/time-slots";

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const barberId = searchParams.get("barberId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (barberId) where.barberId = barberId;
  if (from || to) {
    where.date = {};
    if (from) (where.date as Record<string, unknown>).gte = new Date(from);
    if (to) (where.date as Record<string, unknown>).lte = new Date(to);
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: { barber: true, service: true },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });
  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { barberId, serviceId, date, startTime, clientName, clientPhone, clientEmail, notes } = parsed.data;
  const dateObj = new Date(date + "T00:00:00");

  // Verify slot is still available
  const slots = await getAvailableSlots(barberId, serviceId, dateObj);
  const slotAvailable = slots.find((s) => s.startTime === startTime);
  if (!slotAvailable) {
    return NextResponse.json(
      { error: "This time slot is no longer available" },
      { status: 409 }
    );
  }

  // Get service pricing
  const barberService = await prisma.barberService.findUnique({
    where: { barberId_serviceId: { barberId, serviceId } },
  });
  if (!barberService) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const appointment = await prisma.appointment.create({
    data: {
      barberId,
      serviceId,
      clientName,
      clientPhone,
      clientEmail: clientEmail || null,
      date: dateObj,
      startTime,
      endTime: slotAvailable.endTime,
      totalPrice: barberService.price,
      notes: notes || null,
    },
    include: { barber: true, service: true },
  });

  return NextResponse.json(appointment, { status: 201 });
}

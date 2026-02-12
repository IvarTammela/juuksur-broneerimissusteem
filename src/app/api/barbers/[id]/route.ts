import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { barberSchema } from "@/lib/validators";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const barber = await prisma.barber.findUnique({
    where: { id },
    include: {
      services: { include: { service: true } },
      schedules: { orderBy: { dayOfWeek: "asc" } },
      breaks: { orderBy: { dayOfWeek: "asc" } },
    },
  });
  if (!barber) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(barber);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const parsed = barberSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const barber = await prisma.barber.update({
    where: { id },
    data: parsed.data,
  });
  return NextResponse.json(barber);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  await prisma.barber.update({
    where: { id },
    data: { isActive: false },
  });
  return NextResponse.json({ success: true });
}

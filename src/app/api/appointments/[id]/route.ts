import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { barber: true, service: true },
  });
  if (!appointment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(appointment);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const { status, adminNotes } = body;

  const data: Record<string, unknown> = {};
  if (status) data.status = status;
  if (adminNotes !== undefined) data.adminNotes = adminNotes;

  const appointment = await prisma.appointment.update({
    where: { id },
    data,
    include: { barber: true, service: true },
  });
  return NextResponse.json(appointment);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  await prisma.appointment.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
  return NextResponse.json({ success: true });
}

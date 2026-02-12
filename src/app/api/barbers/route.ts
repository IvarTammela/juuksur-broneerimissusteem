import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { barberSchema } from "@/lib/validators";

export async function GET() {
  const barbers = await prisma.barber.findMany({
    orderBy: { sortOrder: "asc" },
    include: { services: { include: { service: true } } },
  });
  return NextResponse.json(barbers);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const parsed = barberSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const barber = await prisma.barber.create({ data: parsed.data });
  return NextResponse.json(barber, { status: 201 });
}

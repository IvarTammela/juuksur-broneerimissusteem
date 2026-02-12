import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { serviceSchema } from "@/lib/validators";

export async function GET() {
  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      barbers: {
        where: { isActive: true },
        include: { barber: true },
      },
    },
  });
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const service = await prisma.service.create({ data: parsed.data });
  return NextResponse.json(service, { status: 201 });
}

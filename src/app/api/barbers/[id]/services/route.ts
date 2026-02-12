import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const services = await prisma.barberService.findMany({
    where: { barberId: id, isActive: true },
    include: { service: true },
    orderBy: { service: { sortOrder: "asc" } },
  });
  return NextResponse.json(services);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const { serviceId, price, duration } = body;

  const barberService = await prisma.barberService.upsert({
    where: { barberId_serviceId: { barberId: id, serviceId } },
    update: { price, duration, isActive: true },
    create: { barberId: id, serviceId, price, duration },
  });
  return NextResponse.json(barberService);
}

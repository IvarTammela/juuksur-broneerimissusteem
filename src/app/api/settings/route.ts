import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { salonSettingsSchema } from "@/lib/validators";

export async function GET() {
  let settings = await prisma.salonSettings.findUnique({
    where: { id: "default" },
  });
  if (!settings) {
    settings = await prisma.salonSettings.create({
      data: { id: "default" },
    });
  }
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const parsed = salonSettingsSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const settings = await prisma.salonSettings.update({
    where: { id: "default" },
    data: parsed.data,
  });
  return NextResponse.json(settings);
}

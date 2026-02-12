import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/time-slots";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const barberId = searchParams.get("barberId");
  const serviceId = searchParams.get("serviceId");
  const dateStr = searchParams.get("date");

  if (!barberId || !serviceId || !dateStr) {
    return NextResponse.json(
      { error: "barberId, serviceId, and date are required" },
      { status: 400 }
    );
  }

  const date = new Date(dateStr + "T00:00:00");
  const slots = await getAvailableSlots(barberId, serviceId, date);
  return NextResponse.json(slots);
}

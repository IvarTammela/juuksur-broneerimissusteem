import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppointmentDetail } from "@/components/admin/appointment-detail";

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { barber: true, service: true },
  });

  if (!appointment) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Appointment Details</h1>
      <AppointmentDetail
        appointment={{
          id: appointment.id,
          clientName: appointment.clientName,
          clientPhone: appointment.clientPhone,
          clientEmail: appointment.clientEmail,
          date: appointment.date.toISOString(),
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          status: appointment.status,
          totalPrice: Number(appointment.totalPrice),
          notes: appointment.notes,
          adminNotes: appointment.adminNotes,
          barberName: appointment.barber.name,
          serviceName: appointment.service.name,
          createdAt: appointment.createdAt.toISOString(),
        }}
      />
    </div>
  );
}

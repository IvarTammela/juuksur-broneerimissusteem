import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BarberForm } from "@/components/admin/barber-form";
import { BarberServicesManager } from "@/components/admin/barber-services-manager";

export default async function EditBarberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const barber = await prisma.barber.findUnique({
    where: { id },
    include: {
      services: { include: { service: true } },
    },
  });

  if (!barber) notFound();

  const allServices = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Barber: {barber.name}</h1>
      <BarberForm barber={barber} />
      <BarberServicesManager
        barberId={barber.id}
        currentServices={barber.services.map((bs) => ({
          id: bs.id,
          serviceId: bs.serviceId,
          serviceName: bs.service.name,
          price: Number(bs.price),
          duration: bs.duration,
          isActive: bs.isActive,
        }))}
        allServices={allServices.map((s) => ({
          id: s.id,
          name: s.name,
          nameEt: s.nameEt,
        }))}
      />
    </div>
  );
}

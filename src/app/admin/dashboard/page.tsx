import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Scissors, Clock, DollarSign } from "lucide-react";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const [
    todayAppointments,
    weekAppointments,
    activeBarbers,
    activeServices,
    todayUpcoming,
  ] = await Promise.all([
    prisma.appointment.count({
      where: {
        date: { gte: todayStart, lte: todayEnd },
        status: { not: "CANCELLED" },
      },
    }),
    prisma.appointment.count({
      where: {
        date: { gte: weekStart, lte: weekEnd },
        status: { not: "CANCELLED" },
      },
    }),
    prisma.barber.count({ where: { isActive: true } }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.appointment.findMany({
      where: {
        date: { gte: todayStart, lte: todayEnd },
        status: "CONFIRMED",
      },
      include: { barber: true, service: true },
      orderBy: { startTime: "asc" },
      take: 10,
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weekAppointments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Barbers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBarbers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Services
            </CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeServices}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {todayUpcoming.length === 0 ? (
            <p className="text-muted-foreground">No appointments today.</p>
          ) : (
            <div className="space-y-3">
              {todayUpcoming.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-mono font-bold">
                      {apt.startTime}
                    </div>
                    <div>
                      <p className="font-medium">{apt.clientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {apt.service.name} with {apt.barber.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {Number(apt.totalPrice).toFixed(2)} EUR
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {apt.startTime} - {apt.endTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

interface Props {
  appointment: {
    id: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string | null;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    totalPrice: number;
    notes: string | null;
    adminNotes: string | null;
    barberName: string;
    serviceName: string;
    createdAt: string;
  };
}

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  CONFIRMED: "default",
  COMPLETED: "secondary",
  CANCELLED: "destructive",
  NO_SHOW: "outline",
};

export function AppointmentDetail({ appointment }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(appointment.status);
  const [adminNotes, setAdminNotes] = useState(appointment.adminNotes || "");
  const [saving, setSaving] = useState(false);

  async function updateAppointment(newStatus?: string) {
    setSaving(true);
    const res = await fetch(`/api/appointments/${appointment.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: newStatus || status,
        adminNotes,
      }),
    });
    setSaving(false);
    if (res.ok) {
      if (newStatus) setStatus(newStatus);
      toast.success("Appointment updated");
    } else {
      toast.error("Failed to update");
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Button variant="ghost" onClick={() => router.push("/admin/appointments")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to list
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Booking #{appointment.id.slice(-8)}</CardTitle>
          <Badge variant={STATUS_COLORS[status] || "secondary"}>{status}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-muted-foreground">Client</div>
            <div className="font-medium">{appointment.clientName}</div>

            <div className="text-muted-foreground">Phone</div>
            <div className="font-medium">{appointment.clientPhone}</div>

            {appointment.clientEmail && (
              <>
                <div className="text-muted-foreground">Email</div>
                <div className="font-medium">{appointment.clientEmail}</div>
              </>
            )}

            <Separator className="col-span-2" />

            <div className="text-muted-foreground">Barber</div>
            <div className="font-medium">{appointment.barberName}</div>

            <div className="text-muted-foreground">Service</div>
            <div className="font-medium">{appointment.serviceName}</div>

            <div className="text-muted-foreground">Date</div>
            <div className="font-medium">
              {new Date(appointment.date).toLocaleDateString("et-EE")}
            </div>

            <div className="text-muted-foreground">Time</div>
            <div className="font-medium">
              {appointment.startTime} - {appointment.endTime}
            </div>

            <div className="text-muted-foreground">Price</div>
            <div className="font-bold">{appointment.totalPrice.toFixed(2)} EUR</div>

            {appointment.notes && (
              <>
                <div className="text-muted-foreground">Client notes</div>
                <div>{appointment.notes}</div>
              </>
            )}

            <div className="text-muted-foreground">Booked at</div>
            <div className="text-xs">
              {new Date(appointment.createdAt).toLocaleString("et-EE")}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={3}
            placeholder="Add internal notes..."
          />
          <Button onClick={() => updateAppointment()} disabled={saving}>
            {saving ? "Saving..." : "Save Notes"}
          </Button>
        </CardContent>
      </Card>

      {status === "CONFIRMED" && (
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button onClick={() => updateAppointment("COMPLETED")}>
              Mark Complete
            </Button>
            <Button
              variant="outline"
              onClick={() => updateAppointment("NO_SHOW")}
            >
              No Show
            </Button>
            <Button
              variant="destructive"
              onClick={() => updateAppointment("CANCELLED")}
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

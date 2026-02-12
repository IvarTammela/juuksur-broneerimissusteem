"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";
import { Eye } from "lucide-react";

interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: string;
  barber: { name: string };
  service: { name: string };
}

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  CONFIRMED: "default",
  COMPLETED: "secondary",
  CANCELLED: "destructive",
  NO_SHOW: "outline",
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  function fetchAppointments() {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);

    fetch(`/api/appointments?${params}`)
      .then((res) => res.json())
      .then(setAppointments)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, dateFrom, dateTo]);

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success("Status updated");
      fetchAppointments();
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Appointments</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-40">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="NO_SHOW">No Show</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-40"
          placeholder="From"
        />
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="w-40"
          placeholder="To"
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="rounded-md border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Barber</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No appointments found
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell>
                      {new Date(apt.date).toLocaleDateString("et-EE")}
                    </TableCell>
                    <TableCell>
                      {apt.startTime} - {apt.endTime}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{apt.clientName}</p>
                        <p className="text-xs text-muted-foreground">
                          {apt.clientPhone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{apt.barber.name}</TableCell>
                    <TableCell>{apt.service.name}</TableCell>
                    <TableCell>
                      {Number(apt.totalPrice).toFixed(2)} EUR
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_COLORS[apt.status] || "secondary"}>
                        {apt.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Link href={`/admin/appointments/${apt.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {apt.status === "CONFIRMED" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateStatus(apt.id, "COMPLETED")}
                              className="text-xs"
                            >
                              Complete
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateStatus(apt.id, "CANCELLED")}
                              className="text-xs text-destructive"
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

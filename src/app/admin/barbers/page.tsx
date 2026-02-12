"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";

interface Barber {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  services: { service: { name: string } }[];
}

export default function BarbersPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/barbers")
      .then((res) => res.json())
      .then(setBarbers)
      .finally(() => setLoading(false));
  }, []);

  async function toggleActive(id: string, isActive: boolean) {
    const res = await fetch(`/api/barbers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    if (res.ok) {
      setBarbers((prev) =>
        prev.map((b) => (b.id === id ? { ...b, isActive: !isActive } : b))
      );
      toast.success("Barber updated");
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Barbers</h1>
        <Link href="/admin/barbers/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Barber
          </Button>
        </Link>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {barbers.map((barber) => (
              <TableRow key={barber.id}>
                <TableCell className="font-medium">{barber.name}</TableCell>
                <TableCell>{barber.email || "-"}</TableCell>
                <TableCell>{barber.phone || "-"}</TableCell>
                <TableCell>{barber.services.length} services</TableCell>
                <TableCell>
                  <Badge
                    variant={barber.isActive ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => toggleActive(barber.id, barber.isActive)}
                  >
                    {barber.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link href={`/admin/barbers/${barber.id}`}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

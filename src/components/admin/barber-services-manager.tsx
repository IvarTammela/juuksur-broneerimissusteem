"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface BarberServiceItem {
  id: string;
  serviceId: string;
  serviceName: string;
  price: number;
  duration: number;
  isActive: boolean;
}

interface ServiceOption {
  id: string;
  name: string;
  nameEt: string;
}

interface Props {
  barberId: string;
  currentServices: BarberServiceItem[];
  allServices: ServiceOption[];
}

export function BarberServicesManager({
  barberId,
  currentServices,
  allServices,
}: Props) {
  const [services, setServices] = useState(currentServices);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  const availableServices = allServices.filter(
    (s) => !services.some((cs) => cs.serviceId === s.id)
  );

  async function addService() {
    if (!selectedServiceId || !price || !duration) {
      toast.error("Please fill all fields");
      return;
    }

    const res = await fetch(`/api/barbers/${barberId}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: selectedServiceId,
        price: parseFloat(price),
        duration: parseInt(duration),
      }),
    });

    if (res.ok) {
      const svc = allServices.find((s) => s.id === selectedServiceId)!;
      const result = await res.json();
      setServices((prev) => [
        ...prev,
        {
          id: result.id,
          serviceId: selectedServiceId,
          serviceName: svc.name,
          price: parseFloat(price),
          duration: parseInt(duration),
          isActive: true,
        },
      ]);
      setSelectedServiceId("");
      setPrice("");
      setDuration("");
      toast.success("Service added");
    }
  }

  async function removeService(serviceId: string) {
    const res = await fetch(`/api/barbers/${barberId}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId,
        price: 0,
        duration: 0,
        isActive: false,
      }),
    });

    if (res.ok) {
      setServices((prev) => prev.filter((s) => s.serviceId !== serviceId));
      toast.success("Service removed");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Services & Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Price (EUR)</TableHead>
              <TableHead>Duration (min)</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((svc) => (
              <TableRow key={svc.serviceId}>
                <TableCell>{svc.serviceName}</TableCell>
                <TableCell>{svc.price.toFixed(2)}</TableCell>
                <TableCell>{svc.duration}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeService(svc.serviceId)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {availableServices.length > 0 && (
          <div className="flex items-end gap-3 pt-4 border-t">
            <div className="flex-1 space-y-2">
              <Label>Service</Label>
              <Select
                value={selectedServiceId}
                onValueChange={setSelectedServiceId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {availableServices.map((svc) => (
                    <SelectItem key={svc.id} value={svc.id}>
                      {svc.name} / {svc.nameEt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-28 space-y-2">
              <Label>Price (EUR)</Label>
              <Input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="25.00"
              />
            </div>
            <div className="w-28 space-y-2">
              <Label>Duration</Label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
              />
            </div>
            <Button onClick={addService}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

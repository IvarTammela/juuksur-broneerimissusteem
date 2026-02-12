"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { barberSchema, type BarberInput } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BarberFormProps {
  barber?: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    bio: string | null;
    bioEt: string | null;
    imageUrl: string | null;
    isActive: boolean;
    sortOrder: number;
  };
}

export function BarberForm({ barber }: BarberFormProps) {
  const router = useRouter();
  const isEditing = !!barber;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BarberInput>({
    resolver: zodResolver(barberSchema),
    defaultValues: {
      name: barber?.name || "",
      email: barber?.email || "",
      phone: barber?.phone || "",
      bio: barber?.bio || "",
      bioEt: barber?.bioEt || "",
      imageUrl: barber?.imageUrl || "",
      isActive: barber?.isActive ?? true,
      sortOrder: barber?.sortOrder ?? 0,
    },
  });

  async function onSubmit(data: BarberInput) {
    const url = isEditing ? `/api/barbers/${barber.id}` : "/api/barbers";
    const method = isEditing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success(isEditing ? "Barber updated" : "Barber created");
      router.push("/admin/barbers");
      router.refresh();
    } else {
      toast.error("Something went wrong");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Barber" : "New Barber"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" {...register("imageUrl")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                type="number"
                {...register("sortOrder", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio (English)</Label>
            <Textarea id="bio" {...register("bio")} rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bioEt">Bio (Estonian)</Label>
            <Textarea id="bioEt" {...register("bioEt")} rows={3} />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              {...register("isActive")}
              className="h-4 w-4"
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/barbers")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

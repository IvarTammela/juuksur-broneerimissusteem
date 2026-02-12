"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema, type ServiceInput } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ServiceFormProps {
  service?: {
    id: string;
    name: string;
    nameEt: string;
    description: string | null;
    descriptionEt: string | null;
    category: string | null;
    categoryEt: string | null;
    isActive: boolean;
    sortOrder: number;
  };
}

export function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter();
  const isEditing = !!service;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: service?.name || "",
      nameEt: service?.nameEt || "",
      description: service?.description || "",
      descriptionEt: service?.descriptionEt || "",
      category: service?.category || "",
      categoryEt: service?.categoryEt || "",
      isActive: service?.isActive ?? true,
      sortOrder: service?.sortOrder ?? 0,
    },
  });

  async function onSubmit(data: ServiceInput) {
    const url = isEditing ? `/api/services/${service.id}` : "/api/services";
    const method = isEditing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success(isEditing ? "Service updated" : "Service created");
      router.push("/admin/services");
      router.refresh();
    } else {
      toast.error("Something went wrong");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Service" : "New Service"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name (English) *</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameEt">Name (Estonian) *</Label>
              <Input id="nameEt" {...register("nameEt")} />
              {errors.nameEt && (
                <p className="text-sm text-destructive">{errors.nameEt.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category (EN)</Label>
              <Input id="category" {...register("category")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryEt">Category (ET)</Label>
              <Input id="categoryEt" {...register("categoryEt")} />
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
            <Label htmlFor="description">Description (English)</Label>
            <Textarea id="description" {...register("description")} rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descriptionEt">Description (Estonian)</Label>
            <Textarea id="descriptionEt" {...register("descriptionEt")} rows={3} />
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
              onClick={() => router.push("/admin/services")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

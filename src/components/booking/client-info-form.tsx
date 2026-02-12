"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface ClientInfo {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes: string;
}

interface Props {
  onSubmit: (info: ClientInfo) => void;
  onBack: () => void;
}

export function ClientInfoForm({ onSubmit, onBack }: Props) {
  const t = useTranslations("booking");
  const ct = useTranslations("common");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientInfo>({
    defaultValues: {
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      notes: "",
    },
  });

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">{t("clientName")} *</Label>
            <Input
              id="clientName"
              {...register("clientName", { required: ct("required") })}
            />
            {errors.clientName && (
              <p className="text-sm text-destructive">
                {errors.clientName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientPhone">{t("clientPhone")} *</Label>
            <Input
              id="clientPhone"
              type="tel"
              {...register("clientPhone", { required: ct("required") })}
            />
            {errors.clientPhone && (
              <p className="text-sm text-destructive">
                {errors.clientPhone.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientEmail">{t("clientEmail")}</Label>
            <Input
              id="clientEmail"
              type="email"
              {...register("clientEmail")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t("notes")}</Label>
            <Textarea id="notes" {...register("notes")} rows={3} />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onBack}>
              {ct("back")}
            </Button>
            <Button type="submit">{ct("next")}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

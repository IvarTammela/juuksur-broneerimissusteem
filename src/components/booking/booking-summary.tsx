"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import type { BookingData } from "./booking-wizard";

interface Props {
  booking: BookingData;
  onBack: () => void;
}

export function BookingSummary({ booking, onBack }: Props) {
  const t = useTranslations("booking");
  const ct = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState("");

  async function confirmBooking() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barberId: booking.barberId,
          serviceId: booking.serviceId,
          date: booking.date,
          startTime: booking.startTime,
          clientName: booking.clientName,
          clientPhone: booking.clientPhone,
          clientEmail: booking.clientEmail,
          notes: booking.notes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBookingId(data.id);
        setConfirmed(true);
        toast.success(t("bookingConfirmed"));
      } else {
        const err = await res.json();
        toast.error(err.error || ct("error"));
      }
    } catch {
      toast.error(ct("error"));
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <Card className="text-center">
        <CardContent className="p-8">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">{t("bookingConfirmed")}</h2>
          <p className="text-muted-foreground mb-4">
            {t("bookingConfirmedMessage")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("bookingId")}: <span className="font-mono">{bookingId}</span>
          </p>
          <Button className="mt-6" onClick={() => router.push("/")}>
            {ct("back")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("summary")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-muted-foreground">{t("barber")}</div>
          <div className="font-medium">{booking.barberName}</div>

          <div className="text-muted-foreground">{t("service")}</div>
          <div className="font-medium">{booking.serviceName}</div>

          <div className="text-muted-foreground">{t("date")}</div>
          <div className="font-medium">{booking.date}</div>

          <div className="text-muted-foreground">{t("time")}</div>
          <div className="font-medium">
            {booking.startTime} - {booking.endTime}
          </div>

          <Separator className="col-span-2" />

          <div className="text-muted-foreground">{ct("name")}</div>
          <div className="font-medium">{booking.clientName}</div>

          <div className="text-muted-foreground">{ct("phone")}</div>
          <div className="font-medium">{booking.clientPhone}</div>

          {booking.clientEmail && (
            <>
              <div className="text-muted-foreground">{ct("email")}</div>
              <div className="font-medium">{booking.clientEmail}</div>
            </>
          )}

          <Separator className="col-span-2" />

          <div className="text-muted-foreground font-semibold">
            {t("total")}
          </div>
          <div className="font-bold text-lg">
            {booking.price.toFixed(2)} {ct("euro")}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onBack} disabled={submitting}>
            {ct("back")}
          </Button>
          <Button
            onClick={confirmBooking}
            disabled={submitting}
            className="flex-1"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {t("confirmBooking")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

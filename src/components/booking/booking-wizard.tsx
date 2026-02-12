"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BarberSelect } from "./barber-select";
import { ServiceSelect } from "./service-select";
import { DateTimePicker } from "./date-time-picker";
import { ClientInfoForm } from "./client-info-form";
import { BookingSummary } from "./booking-summary";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export interface BarberOption {
  id: string;
  name: string;
  bio: string | null;
  bioEt: string | null;
  imageUrl: string | null;
}

export interface ServiceOption {
  id: string;
  serviceId: string;
  service: {
    id: string;
    name: string;
    nameEt: string;
    description: string | null;
    descriptionEt: string | null;
  };
  price: number;
  duration: number;
}

export interface BookingData {
  barberId: string;
  barberName: string;
  serviceId: string;
  serviceName: string;
  price: number;
  duration: number;
  date: string;
  startTime: string;
  endTime: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes: string;
}

const STEPS = ["step1", "step2", "step3", "step4", "step5"] as const;

export function BookingWizard() {
  const t = useTranslations("booking");
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState<Partial<BookingData>>({});

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {STEPS.map((key, i) => (
          <div key={key} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                i <= step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 h-0.5 mx-1 ${
                  i < step ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-center mb-6">
        {t(STEPS[step])}
      </h2>

      {step > 0 && step < 4 && (
        <Button variant="ghost" size="sm" onClick={back} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t("selectBarber")}
        </Button>
      )}

      {step === 0 && (
        <BarberSelect
          onSelect={(barber) => {
            setBooking((b) => ({
              ...b,
              barberId: barber.id,
              barberName: barber.name,
            }));
            next();
          }}
        />
      )}

      {step === 1 && booking.barberId && (
        <ServiceSelect
          barberId={booking.barberId}
          onSelect={(service) => {
            setBooking((b) => ({
              ...b,
              serviceId: service.service.id,
              serviceName: service.service.name,
              price: service.price,
              duration: service.duration,
            }));
            next();
          }}
        />
      )}

      {step === 2 && booking.barberId && booking.serviceId && (
        <DateTimePicker
          barberId={booking.barberId}
          serviceId={booking.serviceId}
          onSelect={(date, startTime, endTime) => {
            setBooking((b) => ({ ...b, date, startTime, endTime }));
            next();
          }}
        />
      )}

      {step === 3 && (
        <ClientInfoForm
          onSubmit={(info) => {
            setBooking((b) => ({ ...b, ...info }));
            next();
          }}
          onBack={back}
        />
      )}

      {step === 4 && (
        <BookingSummary booking={booking as BookingData} onBack={back} />
      )}
    </div>
  );
}

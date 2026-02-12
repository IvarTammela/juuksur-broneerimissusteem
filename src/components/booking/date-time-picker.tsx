"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format, addDays } from "date-fns";

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface Props {
  barberId: string;
  serviceId: string;
  onSelect: (date: string, startTime: string, endTime: string) => void;
}

export function DateTimePicker({ barberId, serviceId, onSelect }: Props) {
  const t = useTranslations("booking");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const today = new Date();
  const maxDate = addDays(today, 30);

  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    fetch(
      `/api/availability?barberId=${barberId}&serviceId=${serviceId}&date=${dateStr}`
    )
      .then((res) => res.json())
      .then(setSlots)
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, barberId, serviceId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={(date) => date < today || date > maxDate}
          className="rounded-md border"
        />
      </div>

      {selectedDate && (
        <div>
          <h3 className="font-medium mb-3">
            {t("selectTime")} — {format(selectedDate, "dd.MM.yyyy")}
          </h3>
          {loadingSlots ? (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-10 rounded-md" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              {t("noSlotsAvailable")}
            </p>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {slots.map((slot) => (
                <Button
                  key={slot.startTime}
                  variant="outline"
                  onClick={() =>
                    onSelect(
                      format(selectedDate, "yyyy-MM-dd"),
                      slot.startTime,
                      slot.endTime
                    )
                  }
                  className="text-sm"
                >
                  {slot.startTime}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

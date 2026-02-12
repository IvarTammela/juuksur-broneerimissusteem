"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";
import type { BarberOption } from "./booking-wizard";

interface Props {
  onSelect: (barber: BarberOption) => void;
}

export function BarberSelect({ onSelect }: Props) {
  const locale = useLocale();
  const [barbers, setBarbers] = useState<BarberOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/barbers")
      .then((res) => res.json())
      .then((data) =>
        setBarbers(data.filter((b: BarberOption & { isActive: boolean }) => b.isActive))
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {barbers.map((barber) => (
        <Card
          key={barber.id}
          className="cursor-pointer transition-all hover:shadow-md hover:border-primary"
          onClick={() => onSelect(barber)}
        >
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {barber.imageUrl ? (
                <img
                  src={barber.imageUrl}
                  alt={barber.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{barber.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {locale === "et" ? barber.bioEt || barber.bio : barber.bio || barber.bioEt}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

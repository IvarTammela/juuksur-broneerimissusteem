"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ServiceOption } from "./booking-wizard";

interface Props {
  barberId: string;
  onSelect: (service: ServiceOption) => void;
}

export function ServiceSelect({ barberId, onSelect }: Props) {
  const t = useTranslations("common");
  const locale = useLocale();
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/barbers/${barberId}/services`)
      .then((res) => res.json())
      .then(setServices)
      .finally(() => setLoading(false));
  }, [barberId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {services.map((svc) => (
        <Card
          key={svc.id}
          className="cursor-pointer transition-all hover:shadow-md hover:border-primary"
          onClick={() => onSelect(svc)}
        >
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <h3 className="font-semibold">
                {locale === "et"
                  ? svc.service.nameEt || svc.service.name
                  : svc.service.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {locale === "et"
                  ? svc.service.descriptionEt || svc.service.description
                  : svc.service.description}
              </p>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="font-bold text-lg">
                {Number(svc.price).toFixed(2)} {t("euro")}
              </p>
              <p className="text-sm text-muted-foreground">
                {svc.duration} {t("minutes")}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

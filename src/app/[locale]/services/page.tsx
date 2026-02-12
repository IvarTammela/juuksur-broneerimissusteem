import { useTranslations, useLocale } from "next-intl";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    include: {
      barbers: {
        where: { isActive: true },
        include: { barber: true },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return <ServicesContent services={services} />;
}

function ServicesContent({
  services,
}: {
  services: {
    id: string;
    name: string;
    nameEt: string;
    description: string | null;
    descriptionEt: string | null;
    category: string | null;
    categoryEt: string | null;
    barbers: {
      price: unknown;
      duration: number;
      barber: { name: string };
    }[];
  }[];
}) {
  const t = useTranslations("services");
  const ct = useTranslations("common");
  const locale = useLocale();

  // Group by category
  const categories = new Map<string, typeof services>();
  for (const svc of services) {
    const cat =
      locale === "et"
        ? svc.categoryEt || svc.category || "Muud"
        : svc.category || svc.categoryEt || "Other";
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(svc);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">{t("title")}</h1>
      <p className="text-center text-muted-foreground mb-8">
        {t("subtitle")}
      </p>

      <div className="max-w-3xl mx-auto space-y-8">
        {Array.from(categories.entries()).map(([category, svcs]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {svcs.map((svc) => {
                const prices = svc.barbers.map((b) => Number(b.price));
                const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
                const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

                return (
                  <div
                    key={svc.id}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <div>
                      <h3 className="font-medium">
                        {locale === "et" ? svc.nameEt || svc.name : svc.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {locale === "et"
                          ? svc.descriptionEt || svc.description
                          : svc.description}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="font-semibold">
                        {minPrice === maxPrice
                          ? `${minPrice.toFixed(2)} ${ct("euro")}`
                          : `${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)} ${ct("euro")}`}
                      </p>
                      {svc.barbers[0] && (
                        <p className="text-sm text-muted-foreground">
                          {svc.barbers[0].duration} {ct("minutes")}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

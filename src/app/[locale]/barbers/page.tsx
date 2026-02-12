import { useTranslations, useLocale } from "next-intl";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

export default async function BarbersPage() {
  const barbers = await prisma.barber.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return <BarbersContent barbers={barbers} />;
}

function BarbersContent({
  barbers,
}: {
  barbers: {
    id: string;
    name: string;
    bio: string | null;
    bioEt: string | null;
    imageUrl: string | null;
  }[];
}) {
  const t = useTranslations("barbers");
  const locale = useLocale();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">{t("title")}</h1>
      <p className="text-center text-muted-foreground mb-8">
        {t("subtitle")}
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
        {barbers.map((barber) => (
          <Card key={barber.id}>
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center overflow-hidden">
                {barber.imageUrl ? (
                  <img
                    src={barber.imageUrl}
                    alt={barber.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2">{barber.name}</h3>
              <p className="text-sm text-muted-foreground">
                {locale === "et"
                  ? barber.bioEt || barber.bio
                  : barber.bio || barber.bioEt}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

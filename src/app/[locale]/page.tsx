import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Scissors, Clock, Star } from "lucide-react";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-primary/10 p-4">
              <Scissors className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
          <Link href="/booking">
            <Button size="lg" className="text-lg px-8">
              {t("ctaButton")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Scissors className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">{t("ourBarbers")}</h3>
            </div>
            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">{t("ctaButton")}</h3>
            </div>
            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Star className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {t("ourServices")}
              </h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { Scissors } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold">
            <Scissors className="h-4 w-4" />
            <span>Juuksurisalong</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Juuksurisalong.{" "}
            {t("rights")}.
          </p>
        </div>
      </div>
    </footer>
  );
}

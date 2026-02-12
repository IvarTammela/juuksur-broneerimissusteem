"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale() {
    const next = locale === "et" ? "en" : "et";
    router.replace(pathname, { locale: next });
  }

  return (
    <Button variant="ghost" size="sm" onClick={switchLocale}>
      {locale === "et" ? "EN" : "ET"}
    </Button>
  );
}

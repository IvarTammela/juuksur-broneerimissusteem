import { useTranslations } from "next-intl";
import { BookingWizard } from "@/components/booking/booking-wizard";

export default function BookingPage() {
  const t = useTranslations("booking");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">{t("title")}</h1>
      <BookingWizard />
    </div>
  );
}

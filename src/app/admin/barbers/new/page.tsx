import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { BarberForm } from "@/components/admin/barber-form";

export default async function NewBarberPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Barber</h1>
      <BarberForm />
    </div>
  );
}

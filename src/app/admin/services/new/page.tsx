import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ServiceForm } from "@/components/admin/service-form";

export default async function NewServicePage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Service</h1>
      <ServiceForm />
    </div>
  );
}

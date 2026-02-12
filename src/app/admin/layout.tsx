import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Allow access to login page without auth
  return (
    <div className="flex min-h-screen">
      {session && <AdminSidebar />}
      <div className="flex-1 flex flex-col">
        {session && <AdminHeader user={session.user} />}
        <main className="flex-1 p-6 bg-muted/30">{children}</main>
      </div>
    </div>
  );
}

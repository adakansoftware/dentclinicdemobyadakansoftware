import { getAdminFromSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminFromSession();

  if (!admin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <AdminSidebar adminName={admin.name} />
      <main className="flex-1 overflow-auto">
        <div className="p-5 md:p-8">{children}</div>
      </main>
    </div>
  );
}

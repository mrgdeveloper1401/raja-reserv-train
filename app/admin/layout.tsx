// app/admin/layout.tsx
import AdminSidebar from "../layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0f0d0a]">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Login must remain clean — no admin sidebar/header.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f1]">
      <AdminSidebar />

      <div className="lg:pl-[270px]">
        <AdminHeader />

        <main className="p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
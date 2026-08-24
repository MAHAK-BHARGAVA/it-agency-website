// export default function AdminLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <div className="min-h-screen bg-[#fcf8ff] text-[#1b1b23]">
//       {children}
//     </div>
//   );
// }

import AdminShell from "@/components/admin/UI/AdminShell";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminShell>{children}</AdminShell>;
}
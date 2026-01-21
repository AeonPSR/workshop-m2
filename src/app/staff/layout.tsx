import StaffSidebar from "@/components/staff/Sidebar";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-black h-full lg:min-h-screen">
      {/* Sidebar spécifique staff */}
      <div className="fixed top-0 left-0 h-screen w-64">
        <StaffSidebar />
      </div>

      {/* Contenu principal */}
      <main className="flex-1 ml-64 p-4 ">{children}</main>
    </div>
  );
}

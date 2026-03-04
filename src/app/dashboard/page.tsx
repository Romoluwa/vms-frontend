"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, LogOut, Loader2 } from "lucide-react"; // Using Lucide icons
import VisitService from "@/services/apidefinitions/visitService";
import DataCard from "@/components/atoms/DataCard";
import DefaultTable from "@/components/reusables/DefaultTable";
import { useVisitorData, Visitor } from "@/hooks/useVisitorData";
import { VisitorColumns } from "../../../constants/tables/visitorColumns";
import { VisitorDetailSheet } from "@/components/reusables/VisitorDetailSheet";
import WelcomeCard from "@/components/atoms/welcomeCard";

export default function DashboardPage() {
  const { visitors, metrics, loading, handleSearch } = useVisitorData();
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await VisitService.logout(); // Calls /api/v1/admin/logout
      localStorage.removeItem("adminAccessToken");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed, clearing session anyway", err);
      localStorage.removeItem("adminAccessToken");
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleRowClick = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setIsSheetOpen(true);
  };

  return (
    <div className="min-h-screen p-6 bg-[#F5F5FA] flex flex-col gap-8">
      {/* HEADER WITH LOGOUT */}
      <header className="flex justify-between items-center">
        <Image
          src="/images/logo2.png"
          alt="BluFontDesk"
          width={140}
          height={50}
          className="bg-white px-4 py-2 rounded-full shadow-sm"
          priority
        />

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#374151] hover:bg-gray-50 border border-gray-200 bg-white rounded-full transition-all shadow-sm disabled:opacity-50"
          >
            {isLoggingOut ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <LogOut size={16} className="text-[#1D2E5A]" />
            )}
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </header>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <WelcomeCard
          name="Admin"
          yesterdayCount={metrics.yesterdayCount} // From /metrics/yesterday
          loading={loading}
        />
        <DataCard
          title="Checked in Today"
          value={metrics.signedInCount} // Using API field names
          loading={loading}
        />
        <DataCard
          title="Checked out Today"
          value={metrics.signedOutCount} // Using API field names
          loading={loading}
        />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-[#111827]">Visits Log</h2>

          {/* SEARCH BAR WITH LUCIDE SEARCH ICON */}
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-4 text-[#A1ACB2]" />
            <input
              type="text"
              placeholder="Search visitors..."
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-11 pr-4 py-2 border border-gray-200 rounded-full text-sm outline-none w-80 focus:ring-1 focus:ring-[#1D2E5A] bg-[#F9FAFB]"
            />
          </div>
        </div>

        <DefaultTable
          columns={VisitorColumns}
          data={visitors}
          loading={loading}
          onRowClick={handleRowClick}
        />
      </div>

      <VisitorDetailSheet
        visitor={selectedVisitor}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </div>
  );
}

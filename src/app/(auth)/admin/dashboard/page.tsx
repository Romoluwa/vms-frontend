"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, LogOut, Loader2, Funnel, Download } from "lucide-react";
import DataCard from "@/components/atoms/DataCard";
import DefaultTable from "@/components/reusables/DefaultTable";
import { useVisitorData, Visitor } from "@/hooks/useVisitorData";
import { VisitorColumns } from "../../../../../constants/tables/visitorColumns";
import { VisitorDetailSheet } from "@/components/reusables/VisitorDetailSheet";
import WelcomeCard from "@/components/atoms/welcomeCard";
import VisitService from "@/services/apidefinitions/visitService";

const ADMIN_TOKEN_KEY = "adminAccessToken";

export default function DashboardPage() {
  const router = useRouter();
  const [loadingPage, setLoadingPage] = useState(true);
  const [adminName, setAdminName] = useState("Admin");
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Filter States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [entryTimeSortOrder, setEntryTimeSortOrder] = useState<
    Array<"asc" | "desc">
  >([]);
  const [exitTimeSortOrder, setExitTimeSortOrder] = useState<
    Array<"asc" | "desc">
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const filterRef = useRef<HTMLDivElement>(null);

  const { visitors, metrics, loading, filterVisitors } = useVisitorData();

  const toggleStatus = (status: string) => {
    setStatusFilter((prev) => (prev[0] === status ? [] : [status]));
  };

  const toggleEntryTimeSort = (order: "asc" | "desc") => {
    setEntryTimeSortOrder((prev) => (prev[0] === order ? [] : [order]));
  };

  const toggleExitTimeSort = (order: "asc" | "desc") => {
    setExitTimeSortOrder((prev) => (prev[0] === order ? [] : [order]));
  };

  // Close filter when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      router.push("/admin");
      return;
    }
    setLoadingPage(false);
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const statusParam =
        statusFilter.length === 1
          ? statusFilter[0] === "Signed In"
            ? "SIGNED_IN"
            : "SIGNED_OUT"
          : undefined;

      const entrySortDir =
        entryTimeSortOrder.length === 1 ? entryTimeSortOrder[0] : undefined;
      const exitSortDir =
        exitTimeSortOrder.length === 1 ? exitTimeSortOrder[0] : undefined;

      const sortBy = exitSortDir
        ? "signOutTime"
        : entrySortDir
          ? "signInTime"
          : undefined;
      const sortDir = exitSortDir || entrySortDir;

      filterVisitors({
        search: searchQuery.trim() || undefined,
        status: statusParam,
        from: fromDate || undefined,
        to: toDate || undefined,
        sortBy,
        sortDir,
        pageNo: 0,
        pageSize: 10,
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [
    searchQuery,
    statusFilter,
    entryTimeSortOrder,
    exitTimeSortOrder,
    fromDate,
    toDate,
    filterVisitors,
  ]);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const statusParam =
        statusFilter.length === 1
          ? statusFilter[0] === "Signed In"
            ? "SIGNED_IN"
            : "SIGNED_OUT"
          : undefined;

      const entrySortDir =
        entryTimeSortOrder.length === 1 ? entryTimeSortOrder[0] : undefined;
      const exitSortDir =
        exitTimeSortOrder.length === 1 ? exitTimeSortOrder[0] : undefined;

      const sortBy = exitSortDir
        ? "signOutTime"
        : entrySortDir
          ? "signInTime"
          : undefined;
      const sortDir = exitSortDir || entrySortDir;

      const blob = await VisitService.exportVisits({
        search: searchQuery.trim() || undefined,
        status: statusParam,
        from: fromDate || undefined,
        to: toDate || undefined,
        sortBy,
        sortDir,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateStamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `visits-export-${dateStamp}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem("admin_user");
    router.push("/admin");
    setIsLoggingOut(false);
  };

  if (loadingPage)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex flex-col gap-6 sm:gap-8 relative px-4 py-5 sm:p-6">
      <header className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Image
          src="/images/logo2.png"
          alt="Logo"
          width={140}
          height={50}
          priority
          className="w-[120px] sm:w-[140px] h-auto"
        />
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-4 py-2 border rounded-full bg-white shadow-sm w-full sm:w-auto"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <WelcomeCard
          name={adminName}
          yesterdayCount={metrics.yesterdayCount}
          loading={loading}
        />
        <DataCard
          title="Checked in Today"
          value={metrics.signedInCount}
          loading={loading}
        />
        <DataCard
          title="Checked out Today"
          value={metrics.signedOutCount}
          loading={loading}
        />
      </div>

      <div className="bg-white rounded-[20px] p-4 sm:p-6 shadow-sm border border-gray-100 min-h-[400px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5 sm:mb-6">
          <h2 className="text-lg font-bold">Visits Log</h2>

          <div
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 relative"
            ref={filterRef}
          >
            <div className="relative w-full sm:w-auto">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1ACB2]"
              />
              <input
                type="text"
                placeholder="Search visitors..."
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                className="pl-11 pr-4 py-2 border border-gray-200 rounded-full text-sm w-full sm:w-80 bg-[#F9FAFB]"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-full text-sm w-full sm:w-auto bg-[#F9FAFB]"
                aria-label="From date"
              />
              <span className="text-xs text-gray-400 hidden sm:inline">to</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                min={fromDate || undefined}
                className="px-3 py-2 border border-gray-200 rounded-full text-sm w-full sm:w-auto bg-[#F9FAFB]"
                aria-label="To date"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`p-2.5 border rounded-full transition-all ${
                  isFilterOpen
                    ? "bg-[#1D2E5A] text-white border-[#1D2E5A]"
                    : "bg-[#F9FAFB] text-[#A1ACB2] border-gray-200"
                }`}
              >
                <Funnel size={18} />
              </button>

              <button
                onClick={handleExport}
                disabled={isExporting}
                className={`p-2.5 border rounded-full transition-all ${
                  isExporting
                    ? "bg-[#1D2E5A] text-white border-[#1D2E5A] opacity-70"
                    : "bg-[#F9FAFB] text-[#A1ACB2] border-gray-200 hover:text-[#1D2E5A]"
                }`}
                aria-label="Export CSV"
              >
                {isExporting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Download size={18} />
                )}
              </button>
            </div>

            {/* FILTER DROPDOWN */}
            {isFilterOpen && (
              <div
                className="absolute top-12 right-0 left-0 sm:left-auto w-full sm:w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-[9999] p-4"
                style={{ filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.1))" }}
              >
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Filter
                </p>

                <div className="space-y-4">
                  {/* STATUS FILTER */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </p>
                    <div className="space-y-2">
                      {["Signed In", "Signed Out"].map((s) => (
                        <label
                          key={s}
                          className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-800"
                        >
                          <input
                            type="checkbox"
                            checked={statusFilter.includes(s)}
                            onChange={() => toggleStatus(s)}
                            className="rounded border-gray-300 text-[#1D2E5A] focus:ring-[#1D2E5A]"
                          />
                          {s}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* DIVIDER */}
                  <div className="h-px bg-gray-200"></div>

                  {/* ENTRY TIME SORT */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Entry Time
                    </p>
                    <div className="space-y-2">
                      {["Ascending Order", "Descending Order"].map((order) => {
                        const value =
                          order === "Ascending Order" ? "asc" : "desc";
                        return (
                          <label
                            key={order}
                            className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-800"
                          >
                            <input
                              type="checkbox"
                              checked={entryTimeSortOrder.includes(
                                value as "asc" | "desc",
                              )}
                              onChange={() =>
                                toggleEntryTimeSort(value as "asc" | "desc")
                              }
                              className="border-gray-300 text-[#1D2E5A] focus:ring-[#1D2E5A]"
                            />
                            {order}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* DIVIDER */}
                  <div className="h-px bg-gray-200"></div>

                  {/* EXIT TIME SORT */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Exit Time
                    </p>
                    <div className="space-y-2">
                      {["Ascending Order", "Descending Order"].map((order) => {
                        const value =
                          order === "Ascending Order" ? "asc" : "desc";
                        return (
                          <label
                            key={order}
                            className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-800"
                          >
                            <input
                              type="checkbox"
                              checked={exitTimeSortOrder.includes(
                                value as "asc" | "desc",
                              )}
                              onChange={() =>
                                toggleExitTimeSort(value as "asc" | "desc")
                              }
                              className="border-gray-300 text-[#1D2E5A] focus:ring-[#1D2E5A]"
                            />
                            {order}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="-mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto">
          <DefaultTable
            columns={VisitorColumns}
            data={visitors}
            loading={loading}
            onRowClick={(v) => {
              setSelectedVisitor(v);
              setIsSheetOpen(true);
            }}
          />
        </div>
      </div>

      <VisitorDetailSheet
        visitor={selectedVisitor}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </div>
  );
}

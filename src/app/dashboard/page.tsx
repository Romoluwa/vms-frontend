"use client";

import Image from "next/image";
import DataCard from "@/components/atoms/DataCard";
import DefaultTable from "@/components/reusables/DefaultTable";
import { useVisitorData, Visitor } from "@/hooks/useVisitorData";
import { VisitorColumns } from "../../../constants/tables/visitorColumns";
import { useState } from "react";
import { VisitorDetailSheet } from "@/components/reusables/VisitorDetailSheet";

export default function DashboardPage() {
  const { visitors, stats } = useVisitorData();

  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="min-h-screen w-full p-6 bg-[#F5F5FA] flex flex-col gap-8">
      <header className="flex justify-between items-center">
        <Image
          src="/images/Admin-logo.png"
          alt="VMS Logo"
          width={180}
          height={80}
          priority
        />
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-[#374151]">Good Day, Dami</p>
          <div className="w-10 h-10 rounded-full bg-[#1D2E5A] text-white flex items-center justify-center text-xs font-bold">
            DA
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DataCard title="Checked In Today" value={stats.checkedInCount} />
        <DataCard title="Checked Out Today" value={stats.checkedOutCount} />
        <DataCard title="Total Visitors" value={stats.totalCount} />
      </div>

      {/* Table Section matching Figma */}
      <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#111827]">Visits Log</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-4 pr-4 py-2 border border-gray-200 rounded-full text-sm outline-none focus:ring-1 focus:ring-[#1D2E5A]"
            />
          </div>
        </div>

        {/* Pass the columns and data here */}
        <DefaultTable
          columns={VisitorColumns}
          data={visitors}
          loading={false}
          onRowClick={(row) => {
            setSelectedVisitor(row);
            setIsSheetOpen(true);
          }}
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

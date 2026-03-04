"use client";

import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "@/components/reusables/StatusBadge";
import { Visitor } from "@/hooks/useVisitorData";

export const VisitorColumns: ColumnDef<Visitor>[] = [
  {
    accessorKey: "name",
    header: "Visitor",
    cell: ({ row }) => (
      <div className="flex items-center gap-3 py-1">
        <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[11px] font-bold text-[#374151] shrink-0">
          {(row.original.name || "U").charAt(0).toUpperCase()}
        </div>
        <span className="font-bold text-[#111827] text-sm">
          {row.original.name}
        </span>
      </div>
    ),
  },
  { accessorKey: "entryTime", header: "Entry Time" },
  {
    accessorKey: "whoToSee",
    header: "Who to see",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {/* Avatar background matches your header/primary blue */}
        <div className="w-6 h-6 rounded-full bg-[#1D2E5A] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
          {(row.original.whoToSee || "H").charAt(0).toUpperCase()}
        </div>
        {/* Changed from faint gray to bold dark text for readability */}
        <span className="text-[#111827] text-sm font-semibold">
          {row.original.whoToSee}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "purpose", // RESTORED PURPOSE
    header: "Purpose",
    cell: ({ row }) => (
      <span className="text-sm text-gray-500 italic">
        {row.original.purpose}
      </span>
    ),
  },
  {
    accessorKey: "exitTime", // RESTORED EXIT TIME
    header: "Exit Time",
  },
  {
    accessorKey: "status",
    header: "Exit Status",
    cell: ({ row }) => <StatusBadge value={row.original.status} />,
  },
];

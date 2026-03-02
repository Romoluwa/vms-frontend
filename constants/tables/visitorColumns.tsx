"use client";

import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "@/components/reusables/StatusBadge";
import { Visitor } from "@/hooks/useVisitorData";

const getInitial = (name: string) => name?.charAt(0).toUpperCase() || "";

export const VisitorColumns: ColumnDef<Visitor>[] = [
  {
    accessorKey: "name",
    header: "Visitor",
    cell: ({ row }) => (
      <div className="flex items-center gap-3 py-1">
        <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[11px] font-bold text-[#374151] shrink-0">
          {getInitial(row.original.name)}
        </div>
        <span className="font-bold text-[#111827] text-sm">
          {row.original.name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "entryTime",
    header: "Entry Time",
    cell: ({ row }) => (
      <span className="text-[#374151] font-medium text-sm">
        {row.original.entryTime}
      </span>
    ),
  },
  {
    accessorKey: "whoToSee",
    header: "Who to see",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#1D2E5A] flex items-center justify-center text-[10px] font-semibold text-white shrink-0">
          {getInitial(row.original.whoToSee)}
        </div>
        <span className="text-[#374151] text-sm font-medium">
          {row.original.whoToSee}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "purpose",
    header: "Purpose",
    cell: ({ row }) => (
      <span className="text-[#6B7280] text-sm truncate max-w-[200px] block">
        {row.original.purpose}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Exit Status",
    cell: ({ row }) => <StatusBadge value={row.original.status} />,
  },
];

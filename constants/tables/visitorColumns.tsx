"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User, Clock, UserCheck, FileText, LogOut, LogIn } from "lucide-react"; // Import the icons
import StatusBadge from "@/components/reusables/StatusBadge";
import { Visitor } from "@/hooks/useVisitorData";

// Helper component to keep the header code clean
const HeaderWithIcon = ({
  icon: Icon,
  title,
}: {
  icon: any;
  title: string;
}) => (
  <div className="flex items-center gap-2 text-[#6B7280] font-medium text-xs">
    <Icon size={16} strokeWidth={1.5} />
    <span>{title}</span>
  </div>
);

export const VisitorColumns: ColumnDef<Visitor>[] = [
  {
    accessorKey: "name",
    header: () => <HeaderWithIcon icon={User} title="Visitor" />,
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
  {
    accessorKey: "entryTime",
    header: () => <HeaderWithIcon icon={Clock} title="Entry Time" />,
  },
  {
    accessorKey: "whoToSee",
    header: () => <HeaderWithIcon icon={UserCheck} title="Who to see" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#1D2E5A] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
          {(row.original.whoToSee || "H").charAt(0).toUpperCase()}
        </div>
        <span className="text-[#111827] text-sm font-semibold">
          {row.original.whoToSee}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "purpose",
    header: () => <HeaderWithIcon icon={FileText} title="Purpose" />,
    cell: ({ row }) => (
      <span className="text-sm text-gray-500 italic">
        {row.original.purpose}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: () => <HeaderWithIcon icon={LogIn} title="Status" />, // Matching Figma "Status" header
    cell: ({ row }) => <StatusBadge value={row.original.status} />,
  },
  {
    accessorKey: "exitTime",
    header: () => <HeaderWithIcon icon={LogOut} title="Exit Time" />,
  },
];

"use client";

import { cn } from "@/lib/utils";
import React from "react";

type StatusBadgeProps = {
  value: string;
};

// 1. Map backend values to the exact Figma labels
const STATUS_LABELS: Record<string, string> = {
  signed_in: "Signed In",
  signed_out: "Signed Out",
  onhold: "On Hold",
};

const STATUS_STYLES: Record<
  string,
  {
    bg: string;
    text: string;
    dot: string;
  }
> = {
  // 2. "Signed In" Blue styles
  signed_in: {
    bg: "bg-[#EFF6FF]",
    text: "text-[#1D4ED8]",
    dot: "bg-[#2563EB]",
  },
  // 3. "Signed Out" Green styles
  signed_out: {
    bg: "bg-[#F0FDF4]",
    text: "text-[#166534]",
    dot: "bg-[#10B981]",
  },

  // Keep your existing styles below for other parts of the app
  active: {
    bg: "bg-[#ECFDF3]",
    text: "text-[#039855]",
    dot: "bg-[#12B76A]",
  },
  inactive: {
    bg: "bg-[#FEF3F2]",
    text: "text-[#D92D20]",
    dot: "bg-[#F04438]",
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ value }) => {
  const key = value?.toLowerCase();

  // Default fallback if status isn't found
  const style = STATUS_STYLES[key] ?? {
    bg: "bg-gray-100",
    text: "text-gray-700",
    dot: "bg-gray-400",
  };

  // Logic: Use custom label, then fallback to capitalized value
  const displayLabel =
    STATUS_LABELS[key] ??
    value?.charAt(0)?.toUpperCase() + value?.slice(1)?.toLowerCase();

  return (
    <div
      className={cn(
        "flex items-center gap-[6px] rounded-full w-fit py-[2px] px-[10px] text-[11px] font-medium border",
        style.bg,
        style.text,
        key === "signed_in" ? "border-[#DBEAFE]" : "border-[#DCFCE7]",
      )}
      aria-label={`Status: ${displayLabel}`}
    >
      <span
        className={cn("h-[6px] w-[6px] rounded-full", style.dot)}
        aria-hidden="true"
      ></span>
      {displayLabel}
    </div>
  );
};

export default StatusBadge;

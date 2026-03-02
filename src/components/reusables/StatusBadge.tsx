"use client";

import { cn } from "@/lib/utils";
import React from "react";

type StatusBadgeProps = {
  value: string;
};

// 1. Map backend values to the exact Figma labels
const STATUS_LABELS: Record<string, string> = {
  signed_in: "Still around",
  signed_out: "Left",
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
  // 2. "Still around" Orange Styles
  signed_in: {
    bg: "bg-[#FFFBEB]", // Light orange background
    text: "text-[#D97706]", // Dark orange text
    dot: "bg-[#F59E0B]", // Bright orange dot
  },
  // 3. "Left" Green Styles
  signed_out: {
    bg: "bg-[#F0FDF4]", // Light green background
    text: "text-[#166534]", // Dark green text
    dot: "bg-[#10B981]", // Bright green dot
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
        // Optional: add a very subtle border for extra polish as seen in Figma
        key === "signed_in" ? "border-[#FEF3C7]" : "border-[#DCFCE7]",
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

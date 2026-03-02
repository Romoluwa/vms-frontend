"use client";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  inputClassName?: string;
  size?: "sm" | "md" | "lg";
}

export default function SearchBar({
  placeholder = "Search...",
  value: controlledValue,
  onChange,
  className,
  inputClassName,
  size = "md",
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState("");
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) setInternalValue(newValue);
    onChange?.(newValue);
  };

  const sizeStyles = {
    sm: "h-8 text-sm pl-9 pr-10",
    md: "h-11 text-sm pl-11 pr-10",
    lg: "h-12 text-base pl-12 pr-12",
  };

  return (
    <div
      className={cn(
        "relative flex items-center w-full max-w-[320px]",
        className,
      )}
    >
      {/* Darker Icon (#4B5563) for visibility */}
      <Search
        size={18}
        className="absolute left-4 text-[#4B5563] pointer-events-none z-10"
      />

      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-full outline-none transition-all duration-200 shadow-sm",
          "bg-white border border-[#D1D5DB]", // High contrast border
          "text-[#111827] placeholder:text-[#6B7280]", // Dark text and readable placeholder
          "focus:border-[#1D2E5A] focus:ring-2 focus:ring-[#1D2E5A]/10", // Strong focus state
          sizeStyles[size],
          inputClassName,
        )}
      />

      {value && (
        <button
          onClick={() => {
            setInternalValue("");
            onChange?.("");
          }}
          className="absolute right-4 text-[#9CA3AF] hover:text-[#111827]"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

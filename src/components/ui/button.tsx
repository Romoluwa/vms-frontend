import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  compact?: boolean;
}

export const Button = ({
  children,
  isLoading = false,
  disabled = false,
  compact = false,
  className,
  ...props
}: ButtonProps) => (
  <button
    {...props}
    disabled={Boolean(disabled) || Boolean(isLoading)}
    className={`w-full bg-[#2B4592] text-white ${compact ? "py-3 text-sm" : "py-4"} rounded-lg font-bold transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2 ${className ?? ""}`}
  >
    {isLoading ? (
      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    ) : (
      children
    )}
  </button>
);

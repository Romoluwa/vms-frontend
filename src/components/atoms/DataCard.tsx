import { cn } from "@/lib/utils";
import Skeleton from "../reusables/Skeleton";
import MetricIcon from "../icons/metricIcon";
import { LogIn } from "lucide-react";

export default function DataCard({
  title,
  value,
  loading,
  className,
}: {
  title: string;
  value: number;
  loading?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full bg-white border border-[#F2F2F2] rounded-[12px] flex flex-col overflow-hidden shadow-sm h-[130px]",
        className,
      )}
    >
      {/* TOP PART: Faint Grey Background [#F2F2F2] */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#F2F2F2] border-b border-[#E5E7EB]">
        <div className="scale-75 origin-left text-[#3E484D]">
          <LogIn />
        </div>
        <h3 className="text-[#A1ACB2] font-medium text-[13px] whitespace-nowrap">
          {title}
        </h3>
      </div>

      {/* BOTTOM PART: White Background with Centered Value */}
      <div className="flex-1 flex items-center justify-center bg-white">
        {loading ? (
          <Skeleton width="30px" height="24px" />
        ) : (
          <p className="text-[20px] font-bold text-[#2E3133] font-orbitron">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

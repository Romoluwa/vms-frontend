import { cn } from "@/lib/utils";
import Skeleton from "../reusables/Skeleton";
import MetricIcon from "../icons/metricIcon";

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
        "w-full shadow-sm bg-[#FAFBFE] rounded-xl min-h-[100px] p-3 flex flex-col justify-between text-[#3E484D]",
        className,
      )}
    >
      <div className="flex items-center justify-between w-full">
        <h3 className="font-medium text-xs md:text-sm lg:text-normal text-dark-grey">
          {title}
        </h3>
        <MetricIcon />
      </div>
      {loading ? (
        <Skeleton width={"50"} height={"50px"} />
      ) : (
        <p className="text-xl font-orbitron font-semibold">{value}</p>
      )}
    </div>
  );
}

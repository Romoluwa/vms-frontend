import Skeleton from "../reusables/Skeleton";

export default function WelcomeCard({
  name,
  yesterdayCount,
  loading,
}: {
  name: string;
  yesterdayCount: number;
  loading?: boolean;
}) {
  return (
    <div className="w-full bg-white border border-[#F2F2F2] rounded-[12px] p-5 flex flex-col justify-between shadow-sm h-[130px]">
      {/* SOLID WHITE - No grey header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">☀️</span>
          <h3 className="text-[#3E484D] font-medium text-[15px]">
            Good Day, {name}
          </h3>
        </div>

        {loading ? (
          <Skeleton width="100%" height="20px" />
        ) : (
          <p className="text-[#A1ACB2] text-[13px] font-normal leading-tight">
            {yesterdayCount} guests were recorded yesterday
          </p>
        )}
      </div>

      <div className="flex items-center gap-1">
        <span className="text-[10px] opacity-70">⚡</span>
        <p className="text-[#A1ACB2] text-[11px] font-medium uppercase tracking-wider">
          Be Prepared
        </p>
      </div>
    </div>
  );
}

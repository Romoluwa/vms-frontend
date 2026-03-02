import clsx from "clsx";

export default function Skeleton({
  height,
  width,
  className,
}: {
  height?: string;
  width?: string;
  className?: string;
}) {
  return (
    <div
      className={clsx("bg-light-grey animate-pulse rounded-2xl", className)}
      style={{
        width: `${width ?? "50px"}`,
        height: `${height ?? "10px"}`,
      }}
    ></div>
  );
}

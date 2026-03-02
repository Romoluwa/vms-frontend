import Image from "next/image";

export default function ClipboardIcon({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  return (
    <Image
      src={"/images/clipboard.png"}
      alt="clipboard"
      width={width}
      height={height}
    />
  );
}

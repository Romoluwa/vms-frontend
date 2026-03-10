"use client";

import { Suspense, useEffect } from "react"; // Added useEffect
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation"; // Added useRouter

export default function SuccessSignOutPage() {
  return (
    <Suspense fallback={null}>
      <SuccessSignOutContent />
    </Suspense>
  );
}

function SuccessSignOutContent() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialize router
  const visitorName = searchParams.get("name") || "Visitor Name";

  useEffect(() => {
    // Set a timer for 10 seconds (10000ms)
    const timer = setTimeout(() => {
      router.push("/"); // Redirect to your landing/home page
    }, 5000);

    // Cleanup: if the user clicks away or the component closes, kill the timer
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative h-screen w-full flex items-center justify-center px-4 overflow-hidden">
      <video
        className="fixed inset-0 w-full h-full object-cover -z-10"
        src="/backgrounds/Success-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="flex flex-col items-center text-center gap-12 md:gap-10">
        <Image
          src="/images/logo.png"
          alt="Bluechip Technologies Logo"
          width={200}
          height={50}
          className="object-contain md:w-[160px]"
        />

        <p className="text-white text-xl md:text-lg font-medium">
          Goodbye from Bluechip Technologies
        </p>

        <div className="w-full max-w-[90%] md:max-w-[500px] min-h-[110px] md:min-h-[90px] flex items-center justify-center rounded-[16px] border border-white/30 bg-white/10 backdrop-blur-md shadow-2xl px-10">
          <h1 className="text-white text-4xl md:text-3xl lg:text-4xl font-serif italic tracking-wide">
            {visitorName}
          </h1>
        </div>

        <p className="text-gray-200 text-lg md:text-md">Do have a Good Day!</p>
      </div>
    </div>
  );
}

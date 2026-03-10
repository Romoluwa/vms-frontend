"use client";

import { Suspense, useEffect } from "react"; // 1. Import useEffect
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation"; // 2. Import useRouter

export default function SuccessSignInPage() {
  return (
    <Suspense fallback={null}>
      <SuccessSignInContent />
    </Suspense>
  );
}

function SuccessSignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter(); // 3. Initialize router
  const visitorName = searchParams.get("name") || "Visitor Name";

  // 4. Set up the redirect timer
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    // Cleanup the timer if the user leaves the page before it finishes
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative h-screen w-full flex items-center justify-center px-4 overflow-hidden">
      {/* Background Video */}
      <video
        className="fixed inset-0 w-full h-full object-cover -z-10"
        src="/backgrounds/Success-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Floating Content */}
      <div className="flex flex-col items-center text-center gap-12 md:gap-10">
        <Image
          src="/images/logo.png"
          alt="Bluechip Technologies Logo"
          width={200}
          height={50}
          className="object-contain md:w-[160px]"
        />

        <p className="text-white text-xl md:text-lg font-medium">
          Welcome to Bluechip Technologies
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

import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="relative h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden">
      {/* 1. Background video - kept as absolute */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/backgrounds/welcome-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Added z-10 to ensure content stays above video and adjusted gap */}
      <div className="relative z-10 flex flex-col items-center w-full px-4 sm:px-6 md:px-12 gap-6 md:gap-16">
        {/* Logo */}
        <header className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="VMS Logo"
            width={160}
            height={50}
            className="object-contain"
          />
        </header>

        {/* Heading - slightly smaller on mobile to save space */}
        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-serif italic drop-shadow-md text-center">
          Welcome
        </h1>

        {/* Interaction Cards */}
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl gap-6">
          {/* Sign In Button - Removed aspect-square for mobile, kept for md+ */}
          <Link href="/sign-in" className="w-full md:w-auto">
            <button className="flex flex-col items-center justify-center w-full md:w-80 p-8 md:aspect-square bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] hover:bg-white/20 transition-all gap-4 group">
              <span className="text-white text-xs sm:text-sm tracking-[0.3em] uppercase font-bold opacity-70">
                Sign In
              </span>
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image
                  src="/images/sign-in-icon.png"
                  alt="Sign In Icon"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            </button>
          </Link>

          {/* Sign Out Button */}
          <Link href="/sign-out" className="w-full md:w-auto">
            <button className="flex flex-col items-center justify-center w-full md:w-80 p-8 md:aspect-square bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] hover:bg-white/20 transition-all gap-4 group">
              <span className="text-white text-xs sm:text-sm tracking-[0.3em] uppercase font-bold opacity-70">
                Sign Out
              </span>
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image
                  src="/images/sign-out-icon.png"
                  alt="Sign Out Icon"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}

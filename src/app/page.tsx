import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* 1. Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/backgrounds/welcome-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="relative flex flex-col items-center w-full px-6 gap-12 md:gap-20">
        {/* Logo*/}
        <header className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="VMS Logo"
            width={160}
            height={50}
            className="object-contain"
          />
        </header>
        <h1 className="text-white text-6xl md:text-8xl font-serif italic drop-shadow-md">
          Welcome
        </h1>

        {/* 3. Interaction Cards  */}
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl gap-8">
          {/* Sign In Button  */}
          <Link href="/sign-in">
            <button className="flex flex-col items-center justify-center w-full md:w-80 aspect-square bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] hover:bg-white/20 transition-all gap-8 group">
              <span className="text-white text-xs tracking-[0.3em] uppercase font-bold opacity-70">
                Sign In
              </span>
              <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image
                  src="/images/sign-in-icon.png"
                  alt="Sign In Icon"
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
            </button>
          </Link>
          {/* Sign Out Button */}
          <Link href="/sign-out">
            <button className="flex flex-col items-center justify-center w-full md:w-80 aspect-square bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] hover:bg-white/20 transition-all gap-8 group">
              <span className="text-white text-xs tracking-[0.3em] uppercase font-bold opacity-70">
                Sign Out
              </span>
              <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image
                  src="/images/sign-out-icon.png"
                  alt="Sign Out Icon"
                  width={56}
                  height={56}
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

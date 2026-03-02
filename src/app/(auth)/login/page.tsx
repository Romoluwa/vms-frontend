"use client";

import Image from "next/image";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useAdminLoginController } from "@/hooks/useAdminLoginController";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const controller = useAdminLoginController();

  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <Image
          src="/images/admin-login.jpg" 
          alt="Building"
          fill
          className="object-cover"
          priority
        />
    
        <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply" />
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 bg-white">
        <div className="w-full max-w-[450px]">
          <div className="flex flex-col items-center mb-10">
            <Image
              src="/images/logo2.png" 
              alt="Bluechip Technologies"
              width={200}
              height={50}
              className="object-contain mb-4"
            />
            <h1 className="text-2xl font-bold text-[#1D2E5A] tracking-tight">
              Sign In
            </h1>
          </div>

          <form onSubmit={controller.onLogin} className="flex flex-col gap-5">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-500 ml-1">
                Email address
              </label>
              <Input
                name="Email"
                type="email"
                placeholder="Enter your email"
                register={controller.register}
                error={controller.errors.Email}
                className="w-full border-slate-200 h-[54px] rounded-lg px-4 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-500 ml-1">
                Password
              </label>
              <div className="relative">
                <Input
                  name="Password"
                  type={controller.showPassword ? "text" : "password"}
                  placeholder="Password"
                  register={controller.register}
                  error={controller.errors.Password}
                  className="w-full border-slate-200 h-[54px] rounded-lg px-4 pr-12 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700"
                />
                <button
                  type="button"
                  onClick={controller.togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {controller.showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password (if your Figma requires it for Sign Up/Reset) */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-500 ml-1">
                Confirm Password
              </label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                register={controller.register}
                className="w-full border-slate-200 h-[54px] rounded-lg px-4 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700"
              />
            </div>

            <Button
              type="submit"
              isLoading={controller.isSubmitting}
              className="w-full bg-[#3B5998] hover:bg-[#2D4373] text-white h-[56px] rounded-lg font-bold mt-6 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all active:scale-[0.99]"
            >
              <LockKeyhole size={18} />
              <span>Sign Up</span>
            </Button>

            <div className="mt-8 text-center">
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Having issues? Contact Support
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

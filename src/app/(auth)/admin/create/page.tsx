"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserPlus, Eye, EyeOff, ArrowLeft } from "lucide-react";

// import { adminCreateAccountSchema, AdminCreateAccountValues } from "@/schemas/adminSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VisitService from "@/services/apidefinitions/visitService";
import {
  adminCreateAccountSchema,
  AdminCreateAccountValues,
} from "@/schemas/visitorSchema";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminCreateAccountValues>({
    resolver: yupResolver(adminCreateAccountSchema),
    mode: "onTouched",
  });

  const onRegister = async (data: AdminCreateAccountValues) => {
    setServerError("");
    try {
      await VisitService.registerAdmin(data);
      router.push("/admin/login?registered=true");
    } catch (error: any) {
      setServerError(error.message || "An error occurred during registration");
    }
  };
  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* LEFT SIDE: BRAND IMAGE */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <Image
          src="/images/admin-login.jpg"
          alt="Bluechip Office"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply" />
      </div>

      {/* RIGHT SIDE: REGISTRATION FORM */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 lg:p-20 bg-white relative">
        {/* Mobile Back Navigation */}
        <Link
          href="/admin/login"
          className="absolute top-8 left-8 md:hidden text-slate-500"
        >
          <ArrowLeft size={24} />
        </Link>

        <div className="w-full max-w-[500px]">
          <div className="flex flex-col items-center mb-10">
            <Image
              src="/images/logo2.png"
              alt="Bluechip Technologies"
              width={180}
              height={45}
              className="object-contain mb-4"
            />
            <h1 className="text-2xl font-bold text-[#1D2E5A] tracking-tight text-center">
              Create Admin Account
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Sign up to access the VMS Dashboard
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onRegister)}
            className="flex flex-col gap-4"
          >
            {/* FIRST & LAST NAME ROW */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-[#7E878C] text-[10px] font-bold uppercase mb-1 block">
                  First Name
                </label>
                <Input
                  name="firstName"
                  placeholder="e.g. John"
                  register={register}
                  error={errors.firstName}
                  className="w-full border-slate-200 h-[54px] rounded-lg px-4"
                />
              </div>
              <div className="flex-1">
                <label className="text-[#7E878C] text-[10px] font-bold uppercase mb-1 block">
                  Last Name
                </label>
                <Input
                  name="lastName"
                  placeholder="e.g. Doe"
                  register={register}
                  error={errors.lastName}
                  className="w-full border-slate-200 h-[54px] rounded-lg px-4"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-[#7E878C] text-[10px] font-bold uppercase mb-1 block">
                Email Address
              </label>
              <Input
                name="email"
                type="email"
                shouldCapitalize={false}
                placeholder="admin@bluechip.com"
                register={register}
                error={errors.email}
                className="w-full border-slate-200 h-[54px] rounded-lg px-4"
              />
            </div>

            {/* PASSWORD WITH VISIBILITY TOGGLE */}
            <div className="relative">
              <label className="text-[#7E878C] text-[10px] font-bold uppercase mb-1 block">
                Password
              </label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  shouldCapitalize={false}
                  register={register}
                  error={errors.password}
                  className="w-full border-slate-200 h-[54px] rounded-lg px-4 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-[#7E878C] text-[10px] font-bold uppercase mb-1 block">
                Confirm Password
              </label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                shouldCapitalize={false}
                register={register}
                error={errors.confirmPassword}
                className="w-full border-slate-200 h-[54px] rounded-lg px-4"
              />
            </div>

            {/* GLOBAL ERROR (SERVER RESPONSE) */}
            {serverError && (
              <p className="text-red-500 text-[10px] font-bold uppercase mt-1 animate-pulse">
                {serverError}
              </p>
            )}

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full bg-[#3B5998] hover:bg-[#2D4373] text-white h-[56px] rounded-lg font-bold mt-4 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
            >
              <UserPlus size={18} />
              <span>Create Account</span>
            </Button>

            {/* FOOTER LINK BACK TO LOGIN */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/admin/login"
                  className="font-bold text-[#3B5998] hover:underline transition-all"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

"use client";

import { Controller, useForm } from "react-hook-form";
import { Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, UserRoundCheck, Laptop } from "lucide-react";

import { signInSchema } from "@/schemas/visitorSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phoneInput";
import { SignaturePad } from "@/components/ui/signaturePad";
import { useEffect, useState } from "react";
import VisitService from "@/services/apidefinitions/visitService";

export default function SignInPage() {
  const router = useRouter();
  type Department = {
    departmentCode: string;
    name: string;
  };
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);

  // State changed to boolean | null to track explicit Yes/No selection
  const [hasLaptop, setHasLaptop] = useState<boolean | null>(null);

  const fetchDepartments = async () => {
    setLoadingDepts(true);
    try {
      const response = await VisitService.fetchDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingDepts(false);
    }
  };

  const onSubmit = async (data: SignInFormValues) => {
    try {
      const response = await VisitService.signIn({
        visitorName: data.visitorName,
        phoneNumber: data.phoneNumber,
        hostName: data.hostName,
        departmentCode: data.department,
        purpose: data.purposeOfVisit,
        laptopModel: hasLaptop === true ? data.laptopModel : "",
        laptopSerialNumber: hasLaptop === true ? data.laptopSerialNumber : "",
        signatureBase64: data.signature,
      });

      const visitId = response?.data?.data?.visitId;
      if (visitId) {
        localStorage.setItem("visitId", visitId);
      }

      router.push(`/success?name=${encodeURIComponent(data.visitorName)}`);
    } catch (error: any) {
      console.error("Sign In Error:", error.response?.data || error);
      alert(
        "Sign in failed: " +
          (error.response?.data?.message || error.message || "Unknown error"),
      );
    }
  };

  type SignInFormValues = {
    visitorName: string;
    phoneNumber: string;
    hostName: string;
    department: string;
    purposeOfVisit: string;
    laptopModel?: string;
    laptopSerialNumber?: string;
    signature: string;
    countryCode?: string;
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: yupResolver(signInSchema) as Resolver<SignInFormValues>,
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      visitorName: "",
      phoneNumber: "",
      hostName: "",
      department: "",
      purposeOfVisit: "",
      laptopModel: "",
      laptopSerialNumber: "",
      signature: "",
    },
  });

  const showLoading = isSubmitting && Object.keys(errors).length === 0;

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="relative h-[100dvh] w-full flex flex-col items-center justify-start px-4 pt-2 md:pt-3 pb-2 gap-1.5 overflow-hidden">
      <video
        className="fixed inset-0 w-full h-full object-cover -z-10"
        src="/backgrounds/Form-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      <Link href="/">
        <div className="absolute left-4 top-3 md:left-6 md:top-4 bg-[#FFFFFF] text-[#7E878C] rounded-full px-3 py-1.5 flex items-center gap-2 cursor-pointer shadow-sm hover:bg-gray-50 transition-all active:scale-95">
          <ArrowLeft />
          <p>Back</p>
        </div>
      </Link>

      <div className="w-full flex flex-col items-center gap-1.5 origin-center [@media(max-height:900px)]:scale-[0.9] [@media(max-height:820px)]:scale-[0.86] [@media(max-height:760px)]:scale-[0.82]">
        <header className="relative w-full max-w-[600px] flex items-center justify-center">
          <Image
            src="/images/logo2.png"
            alt="VMS Logo"
            width={140}
            height={40}
            className="object-contain md:w-[160px]"
          />
        </header>

        <div className="relative w-full max-w-[600px] border border-[#F7FAFC] bg-[#FFFFFF] rounded-[18px] md:rounded-[20px] p-3 md:p-4 flex flex-col gap-2.5 md:gap-3 shadow-sm">
          <p className="text-center italic text-gray-400 text-[11px] md:text-xs">
            Welcome to Bluechip, Please fill out your details
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-2.5 md:gap-3"
          >
          <Input
            name="visitorName"
            placeholder="Visitor Name"
            register={register}
            error={errors.visitorName}
            compact
          />

          <PhoneInput
            name="phoneNumber"
            control={control}
            error={errors.phoneNumber}
            compact
          />

          <p className="text-[10px] md:text-xs text-[#A1ACB2]">
            Who are you here to see and why?
          </p>

            <div className="flex flex-col md:flex-row gap-2.5 md:gap-3 w-full">
              <div className="flex flex-col flex-1 gap-2">
              <label className="text-[#7E878C] text-[11px]">Host/Personnel</label>
              <Input
                name="hostName"
                placeholder="Host Name"
                register={register}
                error={errors.hostName}
                compact
              />
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <label className="text-[#7E878C] text-[11px]">Department</label>
              <div className="relative">
                <select
                  {...register("department")}
                  disabled={loadingDepts}
                  className="w-full h-[44px] bg-white border border-[#E2E8F0] rounded-lg px-3 text-xs md:text-sm"
                >
                  <option value="" disabled>
                    {loadingDepts ? "Loading..." : "Select Department"}
                  </option>
                  {departments.map((dept) => (
                    <option
                      key={dept.departmentCode}
                      value={dept.departmentCode}
                    >
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.department && (
                <span className="text-red-500 text-[10px] font-bold uppercase">
                  {errors.department.message}
                </span>
              )}
            </div>
          </div>

          <Input
            name="purposeOfVisit"
            placeholder="Purpose of Visit"
            register={register}
            error={errors.purposeOfVisit}
            compact
          />

          {/* LAPTOP SELECTION SECTION */}
            <div className="flex flex-col gap-2 border-t border-gray-50 pt-2">
              <div className="flex items-center gap-3 text-[#7E878C]">
                <Laptop size={18} />
              <span className="text-[11px] md:text-xs font-medium">
                Did you come with a laptop?
              </span>
            </div>

            <div className="flex gap-4 px-1">
              {/* YES CHECKBOX */}
              <button
                type="button"
                onClick={() => setHasLaptop(true)}
                className="flex items-center gap-3 group cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    hasLaptop === true
                      ? "bg-[#1D2E5A] border-[#1D2E5A]"
                      : "border-gray-300 group-hover:border-[#1D2E5A]"
                  }`}
                >
                  {hasLaptop === true && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </div>
                <span
                  className={`text-xs ${hasLaptop === true ? "text-[#1D2E5A] font-bold" : "text-[#7E878C]"}`}
                >
                  Yes
                </span>
              </button>

              {/* NO CHECKBOX */}
              <button
                type="button"
                onClick={() => setHasLaptop(false)}
                className="flex items-center gap-3 group cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    hasLaptop === false
                      ? "bg-[#1D2E5A] border-[#1D2E5A]"
                      : "border-gray-300 group-hover:border-[#1D2E5A]"
                  }`}
                >
                  {hasLaptop === false && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </div>
                <span
                  className={`text-xs ${hasLaptop === false ? "text-[#1D2E5A] font-bold" : "text-[#7E878C]"}`}
                >
                  No
                </span>
              </button>
            </div>

            {/* ROLL DOWN FIELDS */}
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                hasLaptop === true
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0 overflow-hidden"
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-1 pb-1">
                  <div className="flex-1">
                    <Input
                      name="laptopModel"
                      placeholder="Laptop Model"
                      register={register}
                      error={errors.laptopModel}
                      compact
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      name="laptopSerialNumber"
                      placeholder="Serial Number"
                      register={register}
                      error={errors.laptopSerialNumber}
                      compact
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#A1ACB2] text-xs italic">
              Confirm your Signature
            </label>
            <Controller
              name="signature"
              control={control}
              render={({ field: { onChange }, fieldState: { error } }) => (
                <SignaturePad
                  onChange={onChange}
                  // Using error from fieldState is more idiomatic in React Hook Form
                  error={error || errors.signature}
                  compact
                />
              )}
            />
          </div>

          <Button type="submit" isLoading={showLoading} compact>
            <span className="mr-2">
              <UserRoundCheck />
            </span>
            Sign In
          </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

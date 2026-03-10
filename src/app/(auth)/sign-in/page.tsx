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
    <div className="relative min-h-screen w-full flex flex-col items-center py-6 px-4 md:py-10 gap-6 overflow-x-hidden">
      <video
        className="fixed inset-0 w-full h-full object-cover -z-10"
        src="/backgrounds/Form-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      <header className="relative w-full flex items-center justify-center mb-8">
        <Link href="/">
          <div className="absolute left-0 md:left-4 bg-[#FFFFFF] text-[#7E878C] rounded-full px-5 py-2.5 flex items-center gap-2 cursor-pointer shadow-sm hover:bg-gray-50 transition-all active:scale-95">
            <ArrowLeft />
            <p>Back</p>
          </div>
        </Link>
        <Image
          src="/images/logo2.png"
          alt="VMS Logo"
          width={140}
          height={40}
          className="object-contain md:w-[160px]"
        />
      </header>

      <div className="relative w-full max-w-[654px] border border-[#F7FAFC] bg-[#FFFFFF] rounded-[20px] md:rounded-[24px] p-6 md:p-9 flex flex-col gap-6 md:gap-8 shadow-sm">
        <p className="text-center italic text-gray-400 text-sm">
          Welcome to Bluechip, Please fill out your details
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-5 md:gap-6"
        >
          <Input
            name="visitorName"
            placeholder="Visitor Name"
            register={register}
            error={errors.visitorName}
          />

          <PhoneInput
            name="phoneNumber"
            control={control}
            error={errors.phoneNumber}
          />

          <p className="text-sm text-[#A1ACB2]">
            Who are you here to see and why?
          </p>

          <div className="flex flex-col md:flex-row gap-5 md:gap-6 w-full">
            <div className="flex flex-col flex-1 gap-2">
              <label className="text-[#7E878C] text-xs">Host/Personnel</label>
              <Input
                name="hostName"
                placeholder="Host Name"
                register={register}
                error={errors.hostName}
              />
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <label className="text-[#7E878C] text-xs">Department</label>
              <div className="relative">
                <select
                  {...register("department")}
                  disabled={loadingDepts}
                  className="w-full h-[52px] bg-white border border-[#E2E8F0] rounded-lg px-4 text-sm"
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
          />

          {/* LAPTOP SELECTION SECTION */}
          <div className="flex flex-col gap-4 border-t border-gray-50 pt-4">
            <div className="flex items-center gap-3 text-[#7E878C]">
              <Laptop size={18} />
              <span className="text-sm font-medium">
                Did you come with a laptop?
              </span>
            </div>

            <div className="flex gap-8 px-1">
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
                  className={`text-sm ${hasLaptop === true ? "text-[#1D2E5A] font-bold" : "text-[#7E878C]"}`}
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
                  className={`text-sm ${hasLaptop === false ? "text-[#1D2E5A] font-bold" : "text-[#7E878C]"}`}
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
                <div className="flex flex-col md:flex-row gap-5 md:gap-6 pt-2 pb-2">
                  <div className="flex-1">
                    <Input
                      name="laptopModel"
                      placeholder="Laptop Model"
                      register={register}
                      error={errors.laptopModel}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      name="laptopSerialNumber"
                      placeholder="Serial Number"
                      register={register}
                      error={errors.laptopSerialNumber}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#A1ACB2] text-sm italic">
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
                />
              )}
            />
          </div>

          <Button type="submit" isLoading={showLoading}>
            <span className="mr-2">
              <UserRoundCheck />
            </span>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}

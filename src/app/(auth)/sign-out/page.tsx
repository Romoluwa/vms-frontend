"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignaturePad } from "@/components/ui/signaturePad";
import { PhoneInput } from "@/components/ui/phoneInput";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, UserRoundCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import VisitService from "@/services/apidefinitions/visitService";
import { signOutSchema, SignOutFormValues } from "@/schemas/visitorSchema";

type Visit = {
  visitId: string;
  visitorName: string;
  phoneNumber?: string;
};

export default function SignOutPage() {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignOutFormValues>({
    resolver: yupResolver(signOutSchema),
  });

  const [searchResults, setSearchResults] = useState<Visit[]>([]);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Search active visits
  const handleSearch = async (name: string) => {
    if (!name) {
      setSearchResults([]);
      return;
    }

    setLoadingSearch(true);

    try {
      const visits = await VisitService.searchActiveVisits(name);
      setSearchResults(Array.isArray(visits) ? visits : []);
    } catch (err) {
      console.log(err);
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  // Select visitor from dropdown
  const handleSelectVisit = (visit: Visit) => {
    setSelectedVisit(visit);

    setValue("visitorName", visit.visitorName);
    setValue("phoneNumber", visit.phoneNumber || "");

    setSearchResults([]);
  };

  // Submit sign out
  const onSubmit = async (data: SignOutFormValues) => {
    if (!selectedVisit) {
      alert("Please select a visitor");
      return;
    }

    try {
      await VisitService.signOut(selectedVisit.visitId, {
        visitorName: data.visitorName,
        phoneNumber: data.phoneNumber,
        signatureBase64: data.signature,
      });

      router.push(`/success_out?name=${encodeURIComponent(data.visitorName)}`);

      reset();
      setSelectedVisit(null);
      setSearchResults([]);
    } catch (error: any) {
      setError("phoneNumber", {
        type: "manual",
        message: error.message || "Phone number does not match",
      });
    }
  };

  return (
    <div className="relative min-h-screen px-4 py-6">
      {/* Background Video */}
      <video
        className="fixed inset-0 h-full w-full object-cover -z-10"
        src="/backgrounds/Form-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />

      <div className="relative z-10 flex w-full flex-col items-center gap-6">
        {/* Header */}
        <header className="w-full max-w-[654px]">
          <div className="flex items-center w-full">
            <Link href="/">
              <div className="bg-white rounded-full px-4 py-2 flex gap-2">
                <ArrowLeft /> Back
              </div>
            </Link>

            <Image
              src="/images/logo2.png"
              alt="VMS Logo"
              width={140}
              height={40}
              className="mx-auto"
            />
          </div>
        </header>

        {/* Form Card */}
        <div className="w-full max-w-[654px] bg-white rounded-2xl p-6 shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Visitor Search */}
          <div className="relative">
            <Input
              name="visitorName"
              register={register}
              placeholder="Search active visitor"
              error={errors.visitorName}
              onChange={(e) => handleSearch(e.target.value)}
            />

            {(searchResults.length > 0 || loadingSearch) && (
              <ul className="absolute z-50 w-full bg-white border rounded-lg shadow mt-1 max-h-48 overflow-y-auto">
                {loadingSearch && (
                  <li className="p-3 text-gray-500 text-sm">
                    Searching visitors...
                  </li>
                )}

                {searchResults.map((visit) => (
                  <li
                    key={visit.visitId}
                    className="p-3 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSelectVisit(visit)}
                  >
                    <div className="font-medium">{visit.visitorName}</div>
                    {visit.phoneNumber && (
                      <div className="text-sm text-gray-500">
                        {visit.phoneNumber}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Phone Number */}
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <PhoneInput
                {...field}
                control={control}
                error={errors.phoneNumber}
              />
            )}
          />

          {/* Signature */}
          <Controller
            name="signature"
            control={control}
            render={({ field }) => (
              <SignaturePad
                onChange={field.onChange}
                error={errors.signature}
              />
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!selectedVisit}
          >
            <UserRoundCheck />
            Sign Out
          </Button>
        </form>
        </div>
      </div>
    </div>
  );
}

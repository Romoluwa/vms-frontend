"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignaturePad } from "@/components/ui/signaturePad";
import { PhoneInput } from "@/components/ui/phoneInput"; // your phone input
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

  // Search active visits by visitorName
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

  // Select a visitor
  const handleSelectVisit = (visit: Visit) => {
    setSelectedVisit(visit);
    setValue("visitorName", visit.visitorName);
    setValue("phoneNumber", visit.phoneNumber || ""); // prefill phone if available
    setSearchResults([]);
  };

  // Submit sign out
  const onSubmit = async (data: SignOutFormValues) => {
    if (!selectedVisit) return alert("Please select a visitor");
    try {
      await VisitService.signOut(selectedVisit.visitId, {
        visitorName: data.visitorName,
        phoneNumber: data.phoneNumber,
        signatureBase64: data.signature,
      });

      router.push(`/success_out?name=${encodeURIComponent(data.visitorName)}`);
      reset();
      setSelectedVisit(null);
    } catch (error: any) {
      // Show backend error under phone input instead of alert
      setError("phoneNumber", {
        type: "manual",
        message: error.message || "Phone number does not match",
      });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center py-6 px-4 gap-6">
      <video
        className="fixed inset-0 w-full h-full object-cover -z-10"
        src="/backgrounds/Form-bg.mp4"
        autoPlay
        loop
        muted
      />

      <header className="relative w-full flex justify-center mb-8">
        <Link href="/">
          <div className="absolute left-0 bg-white rounded-full px-4 py-2 flex gap-2">
            <ArrowLeft /> Back
          </div>
        </Link>
        <Image src="/images/logo2.png" alt="VMS Logo" width={140} height={40} />
      </header>

      <div className="w-full max-w-[654px] bg-white rounded-2xl p-6 shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Search / Visitor Name */}
          <Input
            name="visitorName"
            placeholder="Search active visitor"
            register={register}
            error={errors.visitorName}
            onChange={(e) => handleSearch(e.target.value)}
          />

          {/* Search results dropdown */}
          {loadingSearch && <p>Searching...</p>}
          {searchResults.length > 0 && (
            <ul className="border rounded p-2 max-h-48 overflow-y-auto">
              {searchResults.map((visit) => (
                <li
                  key={visit.visitId}
                  className="p-2 cursor-pointer hover:bg-gray-200 rounded"
                  onClick={() => handleSelectVisit(visit)}
                >
                  {visit.visitorName}
                </li>
              ))}
            </ul>
          )}

          {/* Phone Number */}
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <PhoneInput
                {...field} // value, onChange, onBlur
                control={control} // ✅ required by PhoneInputProps
                error={errors.phoneNumber}
              />
            )}
          />

          {/* Signature pad */}
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

          {/* Submit button */}
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!selectedVisit}
          >
            <UserRoundCheck /> Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}

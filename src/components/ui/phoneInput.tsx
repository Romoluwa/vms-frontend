"use client";

import { useState, useMemo } from "react";
import { Controller } from "react-hook-form";
import { Control, FieldError, FieldValues, Path } from "react-hook-form";
import {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";
import CountryFlag from "react-country-flag";
import en from "react-phone-number-input/locale/en";
import { Search, ChevronDown } from "lucide-react";

const DEFAULT_COUNTRY = "NG";
const DEFAULT_CALLING_CODE = getCountryCallingCode(DEFAULT_COUNTRY);

type PhoneInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  error?: FieldError;
  countryCodeName?: Path<T>;
  compact?: boolean;
};

export const PhoneInput = <T extends FieldValues>({
  control,
  name,
  error,
  countryCodeName,
  compact = false,
}: PhoneInputProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const countries = useMemo(() => {
    return getCountries().map((code) => ({
      code,
      name: en[code as keyof typeof en] || code,
      callingCode: getCountryCallingCode(code),
    }));
  }, []);

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.callingCode.includes(searchQuery),
  );

  return (
    <div className="flex flex-col gap-1 w-full relative">
      <div
        className={`flex items-center border rounded-[12px] bg-white ${compact ? "h-[48px]" : "h-[56px]"} transition-all 
        ${error ? "border-red-500 bg-red-50" : "border-gray-100 focus-within:border-[#1D2E5A] shadow-sm"}`}
      >
        {/* COUNTRY PICKER */}
        <Controller
          name={(countryCodeName ?? ("countryCode" as Path<T>)) as Path<T>}
          control={control}
          defaultValue={DEFAULT_CALLING_CODE as never}
          render={({ field: { value, onChange } }) => {
            const currentCallingCode = value || DEFAULT_CALLING_CODE;
            const currentCountry =
              countries.find((c) => c.callingCode === currentCallingCode)
                ?.code || DEFAULT_COUNTRY;

            return (
              <>
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className={`flex items-center gap-2 bg-gray-50 border-r border-gray-100 ${compact ? "px-2 min-w-[96px]" : "px-3 min-w-[105px]"} h-full shrink-0 hover:bg-gray-100 transition-colors`}
                >
                  <CountryFlag
                    countryCode={currentCountry}
                    svg
                    style={{ width: "1.2em", height: "1.2em" }}
                  />
                  <span
                    className={`${compact ? "text-[12px]" : "text-[13px]"} font-bold text-[#374151]`}
                  >
                    +{currentCallingCode}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div
                    className={`absolute ${compact ? "top-[52px]" : "top-[60px]"} left-0 w-full md:w-[320px] bg-white border border-gray-200 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden`}
                  >
                    <div className="p-3 border-b border-gray-100 sticky top-0 bg-white">
                      <div className="relative flex items-center">
                        <Search
                          size={14}
                          className="absolute left-3 text-gray-400"
                        />
                        <input
                          autoFocus
                          placeholder="Search country..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg text-sm outline-none border-none focus:ring-1 focus:ring-[#1D2E5A]"
                        />
                      </div>
                    </div>
                    <div className="max-h-[250px] overflow-y-auto">
                      {filteredCountries.map((c) => (
                        <div
                          key={c.code}
                          onClick={() => {
                            onChange(c.callingCode);
                            setIsOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-none"
                        >
                          <div className="flex items-center gap-3">
                            <CountryFlag
                              countryCode={c.code}
                              svg
                              style={{ width: "1.2em" }}
                            />
                            <span className="text-sm text-gray-700">
                              {c.name}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-gray-400">
                            +{c.callingCode}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          }}
        />

        {/* INPUT FIELD */}
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <input
              type="tel"
              placeholder="Phone Number"
              value={value || ""}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, "");
                if (val.length === 11 && val.startsWith("0"))
                  val = val.substring(1);
                onChange(val.slice(0, 10));
              }}
              className={`w-full h-full ${compact ? "px-3 text-xs md:text-sm" : "px-4 text-sm"} outline-none bg-transparent text-[#1D2E5A] font-medium placeholder:text-gray-300`}
            />
          )}
        />
      </div>

      {/* ERROR MESSAGE - BOLD & UPPERCASE */}
      {error && (
        <span className="text-red-500 text-[10px] font-bold uppercase mt-1 px-1">
          {error.message || "PHONE NUMBER IS REQUIRED"}
        </span>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

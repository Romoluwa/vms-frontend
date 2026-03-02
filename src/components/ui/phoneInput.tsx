"use client";
import { Controller } from "react-hook-form";
import { Control, FieldError, FieldValues, Path } from "react-hook-form";
import {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";
import CountryFlag from "react-country-flag";

const DEFAULT_COUNTRY = "NG";
const DEFAULT_CALLING_CODE = getCountryCallingCode(DEFAULT_COUNTRY);

const getCountryFromCallingCode = (callingCode?: string) => {
  if (!callingCode) return DEFAULT_COUNTRY;

  const matchingCountry = getCountries().find(
    (country) => getCountryCallingCode(country) === callingCode
  );

  return matchingCountry || DEFAULT_COUNTRY;
};

type PhoneInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  error?: FieldError;
  countryCodeName?: Path<T>;
};

export const PhoneInput = <T extends FieldValues>({
  control,
  name,
  error,
  countryCodeName,
}: PhoneInputProps<T>) => (
  <div className="flex flex-col gap-2 w-full">
    <div
      className={`flex items-center border rounded-[12px] overflow-hidden transition-all bg-white
      ${error ? "border-red-500 bg-red-50" : "border-gray-100 focus-within:border-[#2B4592]"}`}
    >
      <Controller
        name={(countryCodeName ?? ("countryCode" as Path<T>)) as Path<T>}
        control={control}
        defaultValue={DEFAULT_CALLING_CODE as never}
        render={({ field: { value, onChange, ...field } }) => {
          const currentCode = value || DEFAULT_CALLING_CODE;

          return (
            <div className="flex items-center gap-2 bg-gray-50 border-r border-gray-100 px-3 py-4">
              <CountryFlag
                countryCode={getCountryFromCallingCode(currentCode)}
                svg
                style={{ width: "1.5em", height: "1.5em" }}
              />
              <select
                {...field}
                value={currentCode}
                onChange={(e) => onChange(e.target.value)}
                className="bg-transparent text-sm font-semibold outline-none cursor-pointer text-gray-700"
              >
                {getCountries().map((country) => {
                  const callingCode = getCountryCallingCode(country);
                  return (
                    <option key={country} value={callingCode}>
                      {country} (+{callingCode})
                    </option>
                  );
                })}
              </select>
            </div>
          );
        }}
      />

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <input
            type="tel"
            placeholder="Phone Number"
            value={value || ""}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 11);
              onChange(val);
            }}
            className="w-full p-4 outline-none bg-transparent text-sm text-black placeholder:text-gray-400"
          />
        )}
      />
    </div>
    {error && (
      <span className="text-red-500 text-[10px] font-bold uppercase">
        {error.message}
      </span>
    )}
  </div>
);


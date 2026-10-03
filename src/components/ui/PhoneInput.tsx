"use client";

import { useState } from "react";

type Country = {
  code: string;
  dialCode: string;
  name: string;
  maxLength: number;
};

export const countries: Country[] = [
  { code: "IN", dialCode: "+91", name: "India", maxLength: 10 },
  { code: "US", dialCode: "+1", name: "United States", maxLength: 10 },
  { code: "CA", dialCode: "+1", name: "Canada", maxLength: 10 },
  { code: "GB", dialCode: "+44", name: "United Kingdom", maxLength: 10 },
  { code: "AE", dialCode: "+971", name: "United Arab Emirates", maxLength: 9 },
  { code: "AU", dialCode: "+61", name: "Australia", maxLength: 9 },
  { code: "SG", dialCode: "+65", name: "Singapore", maxLength: 8 },
  { code: "DE", dialCode: "+49", name: "Germany", maxLength: 11 },
  { code: "FR", dialCode: "+33", name: "France", maxLength: 9 },
  { code: "NZ", dialCode: "+64", name: "New Zealand", maxLength: 10 },
  { code: "SA", dialCode: "+966", name: "Saudi Arabia", maxLength: 9 },
  { code: "QA", dialCode: "+974", name: "Qatar", maxLength: 8 },
];

type Props = {
  value: string;
  countryCode: string;
  onPhoneChange: (value: string) => void;
  onCountryChange: (dialCode: string) => void;
  dark?: boolean;
};

export default function PhoneInput({
  value,
  countryCode,
  onPhoneChange,
  onCountryChange,
  dark = false,
}: Props) {
  const selectedCountry =
    countries.find(
      (country) =>
        country.dialCode === countryCode
    ) ?? countries[0];

  const [isOpen, setIsOpen] = useState(false);

  function handleCountryChange(
    country: Country
  ) {
    onCountryChange(country.dialCode);
    onPhoneChange("");
    setIsOpen(false);
  }

  function handlePhoneChange(input: string) {
    const digits = input.replace(/\D/g, "");

    onPhoneChange(
      digits.slice(
        0,
        selectedCountry.maxLength
      )
    );
  }

  return (
    <div className="relative flex h-14 w-full overflow-visible">
      {/* COUNTRY SELECTOR */}

      <button
        type="button"
        onClick={() =>
          setIsOpen((previous) => !previous)
        }
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`flex min-w-[125px] items-center justify-between gap-2 rounded-l-2xl border px-4 text-sm font-bold transition ${
          dark
            ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
            : "border-black/10 bg-[#f6f6f2] text-black hover:bg-white"
        }`}
      >
        <span className="flex items-center gap-2">
          {/* ACTUAL COUNTRY FLAG */}

          <span
            className={`fi fi-${selectedCountry.code.toLowerCase()} text-base`}
          />

          <span>
            {selectedCountry.dialCode}
          </span>
        </span>

        <span
          className={`text-[10px] opacity-50 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {/* COUNTRY DROPDOWN */}

      {isOpen && (
        <div
          role="listbox"
          className={`absolute left-0 top-[62px] z-50 max-h-72 w-[320px] overflow-y-auto rounded-2xl border p-2 shadow-2xl ${
            dark
              ? "border-white/10 bg-[#171717] text-white"
              : "border-black/10 bg-white text-black"
          }`}
        >
          {countries.map((country) => (
            <button
              key={`${country.code}-${country.dialCode}`}
              type="button"
              role="option"
              aria-selected={
                selectedCountry.code ===
                country.code
              }
              onClick={() =>
                handleCountryChange(country)
              }
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition ${
                dark
                  ? "hover:bg-white/10"
                  : "hover:bg-black/5"
              }`}
            >
              {/* FLAG + COUNTRY */}

              <span className="flex items-center gap-3">
                <span
                  className={`fi fi-${country.code.toLowerCase()} text-base`}
                />

                <span>
                  {country.name}
                </span>
              </span>

              {/* DIAL CODE */}

              <span className="font-bold opacity-60">
                {country.dialCode}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* PHONE NUMBER */}

      <input
        type="tel"
        value={value}
        onChange={(event) =>
          handlePhoneChange(
            event.target.value
          )
        }
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="Enter phone number"
        className={`h-14 min-w-0 flex-1 rounded-r-2xl border border-l-0 px-5 outline-none transition ${
          dark
            ? "border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:bg-white/10"
            : "border-black/10 bg-[#f6f6f2] text-black placeholder:text-black/35 focus:bg-white"
        }`}
      />
    </div>
  );
}
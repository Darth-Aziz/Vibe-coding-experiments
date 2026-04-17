"use client";

import PhoneInput, {
  type Country,
  isSupportedCountry,
} from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import "react-phone-number-input/style.css";

import { cn } from "@/lib/utils";

export type TasheelPhoneInputProps = {
  value: string;
  onChange: (value: string | undefined) => void;
  /** ISO 3166-1 alpha-2 default when the field is empty. */
  defaultCountry?: string;
  disabled?: boolean;
  "aria-invalid"?: boolean;
  placeholder?: string;
  className?: string;
};

function resolveCountry(code: string | undefined): Country {
  const c = code?.toUpperCase() ?? "";
  if (c && isSupportedCountry(c)) return c;
  return "SA";
}

export function TasheelPhoneInput({
  value,
  onChange,
  defaultCountry,
  disabled,
  "aria-invalid": ariaInvalid,
  placeholder,
  className,
}: TasheelPhoneInputProps) {
  const country = resolveCountry(defaultCountry);

  return (
    <PhoneInput
      international
      flags={flags}
      defaultCountry={country}
      value={value || undefined}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      limitMaxLength
      className={cn(
        "PhoneInput flex h-9 w-full items-center gap-1 rounded-lg border border-input bg-background px-2 shadow-none transition-[color,box-shadow] focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/40 dark:bg-input/30",
        ariaInvalid &&
          "border-red-400 focus-within:border-red-400 focus-within:ring-red-200/50",
        disabled && "pointer-events-none cursor-not-allowed opacity-60",
        className
      )}
      numberInputProps={{
        "aria-invalid": ariaInvalid,
        className:
          "h-8 min-w-0 flex-1 border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm",
      }}
    />
  );
}

import type { Country } from "react-phone-number-input";

/** Curated defaults for form builder (ISO 3166-1 alpha-2 + flag emoji). */
export const PHONE_DEFAULT_COUNTRY_OPTIONS: { value: Country; label: string }[] = [
  { value: "SA", label: "🇸🇦 Saudi Arabia (+966)" },
  { value: "AE", label: "🇦🇪 United Arab Emirates (+971)" },
  { value: "KW", label: "🇰🇼 Kuwait (+965)" },
  { value: "BH", label: "🇧🇭 Bahrain (+973)" },
  { value: "QA", label: "🇶🇦 Qatar (+974)" },
  { value: "OM", label: "🇴🇲 Oman (+968)" },
  { value: "EG", label: "🇪🇬 Egypt (+20)" },
  { value: "JO", label: "🇯🇴 Jordan (+962)" },
  { value: "US", label: "🇺🇸 United States (+1)" },
  { value: "GB", label: "🇬🇧 United Kingdom (+44)" },
  { value: "FR", label: "🇫🇷 France (+33)" },
  { value: "DE", label: "🇩🇪 Germany (+49)" },
  { value: "IN", label: "🇮🇳 India (+91)" },
  { value: "PK", label: "🇵🇰 Pakistan (+92)" },
];

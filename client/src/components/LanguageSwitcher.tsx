import { useTranslation } from "react-i18next";
import { Select, SelectTrigger, SelectContent, SelectItem } from "./ui/select";

const LANGUAGES = [
  { code: "en", flag: "🇺🇸", labelKey: "English", fallback: "English" },
  { code: "zh", flag: "🇨🇳", labelKey: "中文", fallback: "中文" },
  { code: "es", flag: "🇪🇸", labelKey: "Español", fallback: "Español" },
  { code: "ko", flag: "🇰🇷", labelKey: "한국어", fallback: "한국어" },
  { code: "ja", flag: "🇯🇵", labelKey: "日本語", fallback: "日本語" },
] as const;

type LanguageCode = (typeof LANGUAGES)[number]["code"];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language as LanguageCode;

  const currentLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <Select value={lang} onValueChange={(lng) => i18n.changeLanguage(lng)}>
      <SelectTrigger className="w-14 sm:w-32 bg-white/90 border border-gray-200 rounded-md px-1.5 sm:px-4 py-1 shadow font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all h-8 text-xs sm:text-sm">
        <span className="flex items-center justify-center gap-2 sm:gap-2.5 h-full leading-none">
          <span
            role="img"
            aria-label={t(currentLang.labelKey) || currentLang.fallback}
            className="text-[18px] align-middle"
          >
            {currentLang.flag}
          </span>
          <span className="hidden sm:inline text-sm align-middle leading-none pl-1">
            {t(currentLang.labelKey) || currentLang.fallback}
          </span>
        </span>
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((l) => (
          <SelectItem value={l.code} key={l.code}>
            <div className="flex items-center gap-2.5 leading-none">
              <span
                role="img"
                aria-label={t(l.labelKey) || l.fallback}
                className="text-[18px] align-middle"
              >
                {l.flag}
              </span>
              <span className="text-sm align-middle tracking-wide">
                {t(l.labelKey) || l.fallback}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

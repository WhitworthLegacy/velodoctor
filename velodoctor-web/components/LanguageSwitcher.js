"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const translations = {
  "/": "/nl",
  "/services": "/nl/diensten",
  "/qui-sommes-nous": "/nl/over-ons",
  "/shop": "/nl/winkel",
  "/contact": "/nl/contact",
  "/booking": "/nl/afspraak",
  "/blog": "/nl/blog",
  "/reparation-velo-electrique-bruxelles": "/nl/elektrische-fiets-herstelling-brussel",
  "/blog/entretien-velo-electrique-bruxelles": "/nl/blog/onderhoud-elektrische-fiets-brussel",
  "/blog/reparation-trottinette-electrique-bruxelles": "/nl/blog/elektrische-step-reparatie-brussel",
  "/blog/batterie-velo-electrique-guide-complet": "/nl/blog/batterij-elektrische-fiets-gids",
};

const reverseTranslations = Object.fromEntries(
  Object.entries(translations).map(([fr, nl]) => [nl, fr])
);

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const isNl = pathname.startsWith("/nl");

  const getAlternateUrl = () => {
    if (isNl) {
      // NL -> FR
      return reverseTranslations[pathname] || "/";
    } else {
      // FR -> NL
      return translations[pathname] || "/nl";
    }
  };

  const alternateUrl = getAlternateUrl();
  const currentLang = isNl ? "NL" : "FR";
  const targetLang = isNl ? "FR" : "NL";

  return (
    <Link
      href={alternateUrl}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-vdBorder bg-white hover:bg-vdSurface transition text-sm font-medium text-vdDark"
      title={isNl ? "Passer au français" : "Overschakelen naar Nederlands"}
    >
      <span className="text-gray-400">{currentLang}</span>
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-400"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
      <span className="text-vdPrimary font-semibold">{targetLang}</span>
    </Link>
  );
}

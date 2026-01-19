"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import { routing, type Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;

    startTransition(() => {
      // Replace the current locale in the pathname with the new one
      const segments = pathname.split("/");
      segments[1] = newLocale;
      router.replace(segments.join("/"));
    });
  };

  return (
    <div className="flex gap-1 p-1 rounded-lg bg-surface border border-border">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          disabled={isPending}
          className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
            locale === loc
              ? "bg-accent text-white"
              : "hover:bg-border text-foreground"
          } ${isPending ? "opacity-50" : ""}`}
          aria-label={t("switch")}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

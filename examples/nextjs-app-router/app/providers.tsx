"use client";

import { ConsentProvider, CookieBanner } from "consentium";
import Link from "next/link";
import { consentConfig } from "../consent.config";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConsentProvider config={consentConfig} linkComponent={Link}>
      {children}
      <CookieBanner />
    </ConsentProvider>
  );
}

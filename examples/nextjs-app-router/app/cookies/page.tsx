"use client";

import { CookieDisclosureTable, CookieSettingsLink } from "consent-kit";

export default function CookiesPage() {
  return (
    <main
      style={{
        maxWidth: 880,
        margin: "4rem auto",
        padding: "0 1.5rem",
        fontFamily: "system-ui",
      }}
    >
      <h1>Cookie policy</h1>
      <p>
        This page lists the cookies and third-party processors declared in the
        config. Change your choice anytime: <CookieSettingsLink />.
      </p>
      <CookieDisclosureTable />
    </main>
  );
}

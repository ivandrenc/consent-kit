"use client";

import Link from "next/link";
import { useConsent, useConsentCategory, CookieSettingsLink } from "consentium";

export default function HomePage() {
  const { record } = useConsent();
  const analytics = useConsentCategory("analytics");
  const marketing = useConsentCategory("marketing");

  return (
    <main
      style={{
        maxWidth: 640,
        margin: "4rem auto",
        padding: "0 1.5rem",
        fontFamily: "system-ui",
      }}
    >
      <h1>consentium example</h1>
      <p>
        On first visit the banner appears in the corner. Choose an option and it
        disappears; your choice is stored in <code>localStorage</code> and shown
        live below.
      </p>

      <h2>Current consent</h2>
      <ul>
        <li>
          Status: <strong>{record.status}</strong>
        </li>
        <li>
          Analytics granted: <strong>{String(analytics)}</strong>
        </li>
        <li>
          Marketing granted: <strong>{String(marketing)}</strong>
        </li>
      </ul>

      <p>
        Change your mind: <CookieSettingsLink /> ·{" "}
        <Link href="/cookies">Cookie policy</Link>
      </p>
    </main>
  );
}

import type { ConsentConfig } from "consentium";
import { presetCategories } from "consentium";

/**
 * Demo configuration. The three things the store + banner actually need are
 * `storageKey`, `policyVersion`, and `categories`; the `processors` / `cookies`
 * below are optional metadata, shown here only to demo `CookieDisclosureTable`.
 */
export const consentConfig: ConsentConfig = {
  productName: "Acme",
  storageKey: "consentium_demo",
  policyVersion: 1,
  routes: { cookies: "#cookies", privacy: "#privacy" },

  // `analytics` and `marketing` are flagged respectDoNotTrack, so they are
  // forced off when the browser signals DNT / Global Privacy Control.
  categories: [presetCategories.analytics, presetCategories.marketing],

  processors: [
    {
      name: "Plausible",
      purpose: "Privacy-friendly, cookieless web analytics.",
      dataCategories: ["Page URL", "Referrer", "Country (from IP)"],
      region: "EU",
      lawfulBasis: "Consent (Analytics)",
      policyUrl: "https://plausible.io/privacy",
      gatedBy: "analytics",
    },
  ],

  cookies: [
    {
      name: "consentium_demo",
      type: "localStorage",
      provider: "Acme (first-party)",
      purpose: "Stores your consent choices so we don't re-ask every visit.",
      duration: "Until cleared",
      category: "essential",
    },
  ],
};

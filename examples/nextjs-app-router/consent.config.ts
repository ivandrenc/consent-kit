import type { ConsentConfig } from "consentium";
import { presetCategories } from "consentium";

/**
 * Example configuration. Replace the product details, processors, and cookie
 * inventory with your own — these are placeholders.
 */
export const consentConfig: ConsentConfig = {
  productName: "Example Co",
  contactEmail: "privacy@example.com",
  legalEntity: { status: "omitted" },
  storageKey: "example_consent",
  policyVersion: 1,
  routes: { privacy: "/privacy", cookies: "/cookies" },

  categories: [presetCategories.analytics, presetCategories.marketing],

  processors: [
    {
      name: "Plausible",
      purpose: "Privacy-friendly, cookieless web analytics.",
      dataCategories: ["Page URL", "Referrer", "Country (from IP, not stored)"],
      region: "EU",
      lawfulBasis: "Consent (Analytics)",
      policyUrl: "https://plausible.io/privacy",
      gatedBy: "analytics",
    },
  ],

  cookies: [
    {
      name: "example_consent",
      type: "localStorage",
      provider: "Example Co (first-party)",
      purpose: "Stores your consent choices so we don't re-ask every visit.",
      duration: "Until cleared",
      category: "essential",
    },
  ],

  retention: [{ dataType: "Analytics events", period: "12 months" }],

  effectiveDate: "2026-01-01",
  lastUpdated: "2026-01-01",
};

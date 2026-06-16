import type { ConsentCategory } from "./types";

/**
 * Ready-made category definitions for the three most common cases. Spread or
 * override them when building your config:
 *
 * ```ts
 * categories: [
 *   presetCategories.analytics,
 *   { ...presetCategories.marketing, description: "Custom copy…" },
 * ]
 * ```
 *
 * `analytics` and `marketing` are flagged `respectDoNotTrack` so they are
 * forced off under DNT / Global Privacy Control. `functional` is not, because
 * it covers user-requested conveniences rather than tracking.
 */
export const presetCategories: Record<
  "functional" | "analytics" | "marketing",
  ConsentCategory
> = {
  functional: {
    id: "functional",
    label: "Functional",
    description:
      "Remembers preferences such as language or region so the site behaves the way you expect.",
  },
  analytics: {
    id: "analytics",
    label: "Analytics",
    description:
      "Measures how the site is used so we can improve it. No data is sold or used for advertising.",
    respectDoNotTrack: true,
  },
  marketing: {
    id: "marketing",
    label: "Marketing",
    description: "Used to measure and personalise advertising across sites.",
    respectDoNotTrack: true,
  },
};

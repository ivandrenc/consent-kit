/**
 * Type definitions for consent-kit.
 *
 * The *core* of a config is small: `storageKey`, `policyVersion`, and
 * `categories` are all the store and banner need. Everything else
 * (`processors`, `cookies`, `retention`, `legalEntity`, …) is optional
 * metadata consumed only by the disclosure UI, so a minimal integration
 * can omit it.
 */

/**
 * A consent category the user can toggle.
 *
 * The implicit `"essential"` category is always present and locked on — do
 * NOT include it in {@link ConsentConfig.categories}.
 */
export type ConsentCategory = {
  /** Stable identifier, e.g. `"analytics"` or `"marketing"`. */
  id: string;
  /** Toggle label shown in the banner. */
  label: string;
  /** Short description shown under the toggle. */
  description: string;
  /**
   * When `true`, this category is forced off whenever the browser signals
   * Do Not Track (DNT) or Global Privacy Control (GPC) — even if the visitor
   * tries to enable it. Use for tracking/analytics categories. Default: `false`.
   */
  respectDoNotTrack?: boolean;
};

/**
 * Stored consent record. `categories` is keyed by category id; `"essential"`
 * is always present and `true`.
 */
export type ConsentRecord = {
  status: "pending" | "configured";
  categories: Record<string, boolean>;
  /** Unix epoch ms of the last decision, or `0` while pending. */
  ts: number;
  /** The `policyVersion` the decision was made against. */
  version: number;
};

/** A third-party data processor disclosed in the privacy / cookies UI. */
export type Processor = {
  name: string;
  purpose: string;
  dataCategories: string[];
  region: string;
  lawfulBasis: string;
  policyUrl: string;
  /** Category id that gates this processor, or `"essential"`. */
  gatedBy: string;
};

/** A single cookie / storage entry disclosed in the cookies UI. */
export type CookieDescriptor = {
  name: string;
  type: "Cookie" | "localStorage" | "sessionStorage";
  provider: string;
  purpose: string;
  duration: string;
  /** Category id this entry belongs to, or `"essential"`. */
  category: string;
};

/** A data-retention disclosure row. */
export type RetentionEntry = {
  /** What the data is, e.g. "Analytics events". */
  dataType: string;
  /** How long it is kept, e.g. "12 months". */
  period: string;
};

/** The operating legal entity, for the privacy notice. */
export type LegalEntity =
  | {
      status: "incorporated";
      legalName: string;
      jurisdiction: string;
      registeredAddress: string;
    }
  | { status: "pre-incorporation"; operatorName: string }
  | { status: "omitted" };

export type ConsentConfig = {
  // ── Core (required by the store + banner) ──────────────────────────────

  /** localStorage key the decision is persisted under. */
  storageKey: string;
  /**
   * Bump this when your cookie/privacy policy materially changes. Visitors
   * who consented against an older version are re-prompted, but their prior
   * category choices are preserved as the new defaults.
   */
  policyVersion: number;
  /** The optional, user-toggleable categories (never include `"essential"`). */
  categories: ConsentCategory[];

  // ── Optional metadata (consumed only by the disclosure UI) ─────────────

  /** Product / site name, surfaced in default banner copy and disclosures. */
  productName?: string;
  /** Privacy contact address shown in disclosures. */
  contactEmail?: string;
  legalEntity?: LegalEntity;
  /** Route paths for the policy links the banner / settings link point at. */
  routes?: { privacy?: string; cookies?: string };
  processors?: Processor[];
  cookies?: CookieDescriptor[];
  retention?: RetentionEntry[];
  /** ISO date the current policy took effect, e.g. "2026-01-01". */
  effectiveDate?: string;
  /** ISO date the policy was last updated. */
  lastUpdated?: string;
};

import type { ConsentCategory, ConsentConfig, ConsentRecord } from "./types";

/** Custom DOM event dispatched on `window` whenever consent changes. */
export const CONSENT_CHANGE_EVENT = "consent-kit:change";

/**
 * The implicit, always-on category. It never appears in
 * {@link ConsentConfig.categories}; the store always reports it `true`.
 */
export const ESSENTIAL_CATEGORY_ID = "essential";

/**
 * Detects the legacy Do Not Track browser signal.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/doNotTrack
 */
export function isDoNotTrackEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & {
    doNotTrack?: string;
    msDoNotTrack?: string;
  };
  const dnt =
    nav.doNotTrack ??
    nav.msDoNotTrack ??
    (window as unknown as { doNotTrack?: string }).doNotTrack;
  return dnt === "1" || dnt === "yes";
}

/**
 * Detects the Global Privacy Control signal — the modern, legally-recognized
 * successor to DNT (honored under CCPA/CPRA and increasingly under GDPR).
 * @see https://globalprivacycontrol.org/
 */
export function isGlobalPrivacyControlEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & {
    globalPrivacyControl?: boolean;
  };
  return nav.globalPrivacyControl === true;
}

/**
 * True when the visitor has expressed a do-not-track preference via either
 * the legacy DNT header or the modern Global Privacy Control signal.
 * Categories flagged `respectDoNotTrack` are forced off when this is true.
 */
export function isPrivacySignalEnabled(): boolean {
  return isDoNotTrackEnabled() || isGlobalPrivacyControlEnabled();
}

/** The set of category ids that should be forced off under a privacy signal. */
export function doNotTrackCategoryIds(config: ConsentConfig): Set<string> {
  return new Set(
    config.categories.filter((c) => c.respectDoNotTrack).map((c) => c.id),
  );
}

/** Builds the default "nothing decided yet" record. */
export function buildPendingRecord(
  optionalCategories: ConsentCategory[],
  policyVersion: number,
): ConsentRecord {
  const categories: Record<string, boolean> = { [ESSENTIAL_CATEGORY_ID]: true };
  for (const c of optionalCategories) categories[c.id] = false;
  return {
    status: "pending",
    categories,
    ts: 0,
    version: policyVersion,
  };
}

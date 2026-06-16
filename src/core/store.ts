import type { ConsentConfig, ConsentRecord } from "./types";
import {
  CONSENT_CHANGE_EVENT,
  ESSENTIAL_CATEGORY_ID,
  buildPendingRecord,
  doNotTrackCategoryIds,
  isPrivacySignalEnabled,
} from "./defaults";

/**
 * The framework-agnostic consent store. Reads and writes the decision to
 * `localStorage`, broadcasts changes via a `window` CustomEvent, and honors
 * Do Not Track / Global Privacy Control for categories that opt in.
 *
 * Every method is safe to call during SSR (no-ops / pending record off the
 * browser) so the same store can be created on the server and the client.
 */
export type ConsentStore = {
  /** Read the current record. Returns a pending record during SSR. */
  getConsent: () => ConsentRecord;
  /** Persist a (partial) set of category decisions and broadcast the change. */
  setConsent: (categories: Record<string, boolean>) => void;
  /** Grant every optional category. */
  acceptAll: () => void;
  /** Deny every optional category (essential stays on). */
  rejectAll: () => void;
  /** Whether a category is currently granted. `"essential"` is always `true`. */
  hasConsent: (categoryId: string) => boolean;
  /** Flip status back to `pending` (re-show the banner) without losing choices. */
  reopenBanner: () => void;
  /** Subscribe to changes. Returns an unsubscribe function. */
  subscribe: (listener: (rec: ConsentRecord) => void) => () => void;
};

function isBrowser(): boolean {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

export function createStore(config: ConsentConfig): ConsentStore {
  const dntGated = doNotTrackCategoryIds(config);

  const readRaw = (): ConsentRecord => {
    if (!isBrowser()) {
      return buildPendingRecord(config.categories, config.policyVersion);
    }
    try {
      const raw = window.localStorage.getItem(config.storageKey);
      if (!raw)
        return buildPendingRecord(config.categories, config.policyVersion);
      const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
      // Defensive: essential is always true and every configured category exists.
      const categories: Record<string, boolean> = {
        [ESSENTIAL_CATEGORY_ID]: true,
      };
      for (const c of config.categories) {
        categories[c.id] = Boolean(parsed.categories?.[c.id]);
      }
      const storedVersion =
        typeof parsed.version === "number"
          ? parsed.version
          : config.policyVersion;
      // Policy version bump: force re-prompt while preserving prior choices.
      const stale = storedVersion < config.policyVersion;
      return {
        status: stale
          ? "pending"
          : parsed.status === "configured"
            ? "configured"
            : "pending",
        categories,
        ts: typeof parsed.ts === "number" ? parsed.ts : 0,
        version: storedVersion,
      };
    } catch {
      return buildPendingRecord(config.categories, config.policyVersion);
    }
  };

  const write = (rec: ConsentRecord): void => {
    if (!isBrowser()) return;
    window.localStorage.setItem(config.storageKey, JSON.stringify(rec));
    window.dispatchEvent(
      new CustomEvent<ConsentRecord>(CONSENT_CHANGE_EVENT, { detail: rec }),
    );
  };

  const setConsent = (partial: Record<string, boolean>): void => {
    const current = readRaw();
    // Only accept keys for configured categories — ignore foreign keys so the
    // persisted blob can never contain anything outside your category list.
    const sanitized: Record<string, boolean> = {};
    for (const c of config.categories) {
      if (c.id in partial) sanitized[c.id] = Boolean(partial[c.id]);
    }
    // Honor DNT/GPC: never persist `true` for a privacy-gated category.
    if (isPrivacySignalEnabled()) {
      for (const id of dntGated) {
        if (sanitized[id] === true) sanitized[id] = false;
      }
    }
    const next: ConsentRecord = {
      status: "configured",
      categories: {
        ...current.categories,
        ...sanitized,
        [ESSENTIAL_CATEGORY_ID]: true,
      },
      ts: Date.now(),
      version: config.policyVersion,
    };
    write(next);
  };

  const acceptAll = (): void => {
    const all: Record<string, boolean> = {};
    for (const c of config.categories) all[c.id] = true;
    setConsent(all);
  };

  const rejectAll = (): void => {
    const none: Record<string, boolean> = {};
    for (const c of config.categories) none[c.id] = false;
    setConsent(none);
  };

  const hasConsent = (categoryId: string): boolean => {
    if (categoryId === ESSENTIAL_CATEGORY_ID) return true;
    if (dntGated.has(categoryId) && isPrivacySignalEnabled()) return false;
    const rec = readRaw();
    return rec.status === "configured" && rec.categories[categoryId] === true;
  };

  const reopenBanner = (): void => {
    write({ ...readRaw(), status: "pending" });
  };

  const subscribe = (listener: (rec: ConsentRecord) => void): (() => void) => {
    if (!isBrowser()) return () => {};
    const handler = (e: Event) => {
      listener((e as CustomEvent<ConsentRecord>).detail);
    };
    window.addEventListener(CONSENT_CHANGE_EVENT, handler);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, handler);
  };

  return {
    getConsent: readRaw,
    setConsent,
    acceptAll,
    rejectAll,
    hasConsent,
    reopenBanner,
    subscribe,
  };
}

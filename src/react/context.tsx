"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import type { ConsentConfig, ConsentRecord } from "../core/types";
import { createStore, type ConsentStore } from "../core/store";
import {
  ESSENTIAL_CATEGORY_ID,
  doNotTrackCategoryIds,
  isPrivacySignalEnabled,
} from "../core/defaults";
import { mergeCopy, type ConsentCopy, type PartialConsentCopy } from "./copy";

/**
 * Shape of the link component used for policy links inside the banner.
 * Matches both a plain `<a>` and frameworks like Next.js `<Link>`.
 */
export type LinkComponent = ComponentType<{
  href: string;
  className?: string;
  children: ReactNode;
}>;

type ConsentContextValue = {
  config: ConsentConfig;
  store: ConsentStore;
  record: ConsentRecord;
  copy: ConsentCopy;
  Link: LinkComponent;
  dntGated: Set<string>;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

const DefaultLink: LinkComponent = ({ href, className, children }) => (
  <a href={href} className={className}>
    {children}
  </a>
);

export type ConsentProviderProps = {
  config: ConsentConfig;
  children: ReactNode;
  /** Override any user-facing string (for translation or rewording). */
  copy?: PartialConsentCopy;
  /**
   * Link component for in-app navigation to your policy pages. Defaults to a
   * plain `<a>`. Pass your framework's link (e.g. Next.js `<Link>`) for SPA
   * navigation.
   */
  linkComponent?: LinkComponent;
};

export function ConsentProvider({
  config,
  children,
  copy,
  linkComponent,
}: ConsentProviderProps) {
  const store = useMemo(() => createStore(config), [config]);
  const [record, setRecord] = useState<ConsentRecord>(() => store.getConsent());

  // Resolve the record after mount to avoid a hydration mismatch: the server
  // always renders the pending record; localStorage is only read in the effect.
  useEffect(() => {
    setRecord(store.getConsent());
    return store.subscribe((next) => setRecord(next));
  }, [store]);

  const resolvedCopy = useMemo(() => mergeCopy(copy), [copy]);
  const dntGated = useMemo(() => doNotTrackCategoryIds(config), [config]);
  const Link = linkComponent ?? DefaultLink;

  const value = useMemo<ConsentContextValue>(
    () => ({ config, store, record, copy: resolvedCopy, Link, dntGated }),
    [config, store, record, resolvedCopy, Link, dntGated],
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used inside <ConsentProvider>");
  }
  return ctx;
}

/** Whether a given category is currently granted (reactive). */
export function useConsentCategory(id: string): boolean {
  const { record, dntGated } = useConsent();
  if (id === ESSENTIAL_CATEGORY_ID) return true;
  if (dntGated.has(id) && isPrivacySignalEnabled()) return false;
  return record.status === "configured" && record.categories[id] === true;
}

/** Current banner status: `"pending"` (undecided) or `"configured"`. */
export function useConsentStatus(): ConsentRecord["status"] {
  const { record } = useConsent();
  return record.status;
}

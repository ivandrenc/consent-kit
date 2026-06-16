"use client";

import { useEffect, useRef, useState } from "react";
import { useConsent } from "./context";
import { interpolate } from "./copy";

type Mode = "initial" | "customize";

/**
 * The consent banner. Renders only while the decision is `pending`, so it is
 * safe to mount unconditionally at the root of your layout. Styling comes from
 * `consent-kit/styles.css` (import it once); override the `--ck-*` CSS
 * variables to theme it.
 */
export function CookieBanner() {
  const { config, store, record, copy, Link } = useConsent();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("initial");
  const [draft, setDraft] = useState<Record<string, boolean>>(() => ({
    ...record.categories,
  }));
  const [error, setError] = useState<string | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => setMounted(true), []);

  // On reopen (status flips back to pending), reset to the initial view and
  // refresh the draft from the persisted choices.
  useEffect(() => {
    if (record.status === "pending") {
      setMode("initial");
      setDraft({ ...record.categories });
    }
  }, [record.status, record.categories]);

  // Move focus to the banner when it appears, for keyboard/screen-reader users.
  useEffect(() => {
    if (mounted && record.status === "pending") {
      headlineRef.current?.focus();
    }
  }, [mounted, record.status]);

  if (!mounted || record.status !== "pending") return null;

  const apply = (fn: () => void) => {
    try {
      fn();
      setError(null);
    } catch {
      setError(copy.banner.saveError);
    }
  };

  const cookiesHref = config.routes?.cookies;
  const body = interpolate(copy.banner.body, {
    product: config.productName ?? "this site",
  });
  const optionalCategories = config.categories.filter(
    (cat) => cat.id !== "essential",
  );

  return (
    <div
      className="ck-banner"
      role="region"
      aria-label={copy.banner.regionLabel}
      onKeyDown={(e) => {
        if (e.key === "Escape" && mode === "customize") setMode("initial");
      }}
    >
      <h2 ref={headlineRef} tabIndex={-1} className="ck-headline">
        {copy.banner.headline}
      </h2>

      {mode === "initial" ? (
        <>
          <p className="ck-body">{body}</p>
          {cookiesHref ? (
            <Link href={cookiesHref} className="ck-policy-link">
              {copy.banner.policyLink}
            </Link>
          ) : null}
          <div className="ck-actions">
            <button
              type="button"
              className="ck-btn ck-btn-ghost"
              onClick={() => setMode("customize")}
            >
              {copy.banner.customize}
            </button>
            <button
              type="button"
              className="ck-btn ck-btn-ghost"
              onClick={() => apply(() => store.rejectAll())}
            >
              {copy.banner.rejectAll}
            </button>
            <button
              type="button"
              className="ck-btn ck-btn-primary"
              onClick={() => apply(() => store.acceptAll())}
            >
              {copy.banner.acceptAll}
            </button>
          </div>
          {error ? <p className="ck-error">{error}</p> : null}
        </>
      ) : (
        <div className="ck-panel">
          <div className="ck-row">
            <div className="ck-row-text">
              <p className="ck-row-label">{copy.banner.essentialLabel}</p>
              <p className="ck-row-desc">{copy.banner.essentialDescription}</p>
            </div>
            <input
              type="checkbox"
              role="switch"
              className="ck-toggle"
              checked
              disabled
              aria-label={copy.banner.essentialAria}
              readOnly
            />
          </div>

          {optionalCategories.map((cat) => (
            <div key={cat.id} className="ck-row">
              <div className="ck-row-text">
                <p className="ck-row-label">{cat.label}</p>
                <p className="ck-row-desc">{cat.description}</p>
              </div>
              <input
                type="checkbox"
                role="switch"
                className="ck-toggle"
                checked={Boolean(draft[cat.id])}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, [cat.id]: e.target.checked }))
                }
                aria-label={cat.label}
              />
            </div>
          ))}

          <div className="ck-actions">
            <button
              type="button"
              className="ck-btn ck-btn-ghost"
              onClick={() => setMode("initial")}
            >
              {copy.banner.back}
            </button>
            <button
              type="button"
              className="ck-btn ck-btn-primary"
              onClick={() => apply(() => store.setConsent(draft))}
            >
              {copy.banner.savePreferences}
            </button>
          </div>
          {error ? <p className="ck-error">{error}</p> : null}
        </div>
      )}
    </div>
  );
}

"use client";

import type { CSSProperties, ReactNode } from "react";
import { useConsent } from "./context";

type Props = {
  className?: string;
  style?: CSSProperties;
  /** Override the label (defaults to `copy.settingsLink.label`). */
  children?: ReactNode;
};

/**
 * A button styled as a text link that re-opens the consent banner. Drop it in
 * a footer so visitors can change their choice at any time — a GDPR
 * requirement (consent must be as easy to withdraw as to give).
 */
export function CookieSettingsLink({ className, style, children }: Props) {
  const { store, copy } = useConsent();
  return (
    <button
      type="button"
      className={className}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        color: "inherit",
        font: "inherit",
        textDecoration: "underline",
        ...style,
      }}
      onClick={() => store.reopenBanner()}
    >
      {children ?? copy.settingsLink.label}
    </button>
  );
}

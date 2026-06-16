/**
 * All user-facing strings live here so the library carries no i18n dependency.
 * English defaults ship out of the box; pass a (partial) `copy` prop to
 * `ConsentProvider` to translate or reword anything. Wire it to next-intl,
 * react-i18next, or any other system by passing already-resolved strings.
 *
 * `{product}` in `banner.body` is interpolated with `config.productName`
 * (falls back to "this site").
 */
export type ConsentCopy = {
  banner: {
    /** aria-label for the banner region. */
    regionLabel: string;
    headline: string;
    /** Supports a `{product}` placeholder. */
    body: string;
    policyLink: string;
    acceptAll: string;
    rejectAll: string;
    customize: string;
    back: string;
    savePreferences: string;
    essentialLabel: string;
    essentialDescription: string;
    essentialAria: string;
    saveError: string;
  };
  settingsLink: {
    label: string;
  };
};

/** A deeply-partial version of {@link ConsentCopy} for overrides. */
export type PartialConsentCopy = {
  banner?: Partial<ConsentCopy["banner"]>;
  settingsLink?: Partial<ConsentCopy["settingsLink"]>;
};

export const defaultConsentCopy: ConsentCopy = {
  banner: {
    regionLabel: "Cookie consent",
    headline: "Your privacy choices",
    body: "{product} uses cookies for essential functionality and, with your consent, to understand how the site is used. You can change your choice at any time.",
    policyLink: "Cookie policy",
    acceptAll: "Accept all",
    rejectAll: "Reject all",
    customize: "Customize",
    back: "Back",
    savePreferences: "Save preferences",
    essentialLabel: "Essential",
    essentialDescription:
      "Required for the site to work — security, load balancing, and remembering your privacy choice. Always on.",
    essentialAria: "Essential cookies, always on",
    saveError:
      "We couldn't save your choice. Check that your browser allows storage and try again.",
  },
  settingsLink: {
    label: "Cookie settings",
  },
};

/** Merge a partial override over the English defaults. */
export function mergeCopy(override?: PartialConsentCopy): ConsentCopy {
  if (!override) return defaultConsentCopy;
  return {
    banner: { ...defaultConsentCopy.banner, ...override.banner },
    settingsLink: {
      ...defaultConsentCopy.settingsLink,
      ...override.settingsLink,
    },
  };
}

/** Replace `{product}` in a template string. */
export function interpolate(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in vars ? vars[key] : match,
  );
}

# GDPR & privacy notes

> **Not legal advice.** This document explains how consentium maps to common
> GDPR/ePrivacy expectations so you can reason about your setup. Whether your
> site is compliant depends on how you configure and integrate it, and on the
> rules in your jurisdiction. When in doubt, consult a qualified advisor.

## What consentium gives you

| Requirement (GDPR / ePrivacy / EDPB guidance)                       | How the kit helps                                                                                                                                          |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Prior consent** — no non-essential cookies/trackers before opt-in | The kit sets **no** cookies and loads **no** scripts itself. It records a decision; your gates (see [recipes](./recipes.md)) must wait for `hasConsent()`. |
| **Granular consent** — per purpose, not all-or-nothing              | Each category is independently toggleable in the customize panel.                                                                                          |
| **Reject as easy as accept**                                        | "Reject all" is one click, side by side with "Accept all" — neither hidden behind a sub-menu. See the note on visual weight below.                         |
| **No pre-ticked boxes**                                             | Optional toggles default to **off**; consent is opt-in.                                                                                                    |
| **Freely given / no bundling**                                      | Essential is separated and never tied to optional categories. The kit does not implement a cookie wall.                                                    |
| **Easy withdrawal** — as easy as giving                             | `CookieSettingsLink` re-opens the banner from anywhere (e.g. your footer).                                                                                 |
| **Specific & informed**                                             | Per-category descriptions, a policy link, and `CookieDisclosureTable` listing cookies and processors.                                                      |
| **Proof of consent**                                                | The stored record includes a timestamp (`ts`) and the `policyVersion` consented to.                                                                        |
| **Re-consent on change**                                            | Bumping `policyVersion` re-prompts returning visitors.                                                                                                     |
| **Honor browser privacy signals**                                   | Categories flagged `respectDoNotTrack` are forced off under Do Not Track **and** Global Privacy Control.                                                   |

### A note on button styling

By default "Accept all" is a filled button and "Reject all" is an outlined
(ghost) button. Both are a single click and sit side by side, which satisfies
the core requirement that rejecting be no harder than accepting. However, some
regulators (notably France's CNIL) scrutinise a visually louder "accept" as a
nudge. If your jurisdiction expects strictly equal visual weight, give both
buttons the same style via the `--ck-*` tokens or by overriding `.ck-btn-ghost`
— see [theming](./theming.md).

## What is still your responsibility

consentium is the consent **mechanism**. It cannot make these decisions for you:

1. **Actually gate your scripts.** The single most important step. If you load
   analytics/marketing tags before `hasConsent()` is `true`, you are
   non-compliant regardless of what the banner says. Use the
   [recipes](./recipes.md).
2. **Classify categories correctly.** Only genuinely necessary cookies belong to
   `essential`. Analytics, A/B testing, and ads are **not** essential under
   ePrivacy.
3. **Keep disclosures accurate.** The processors and cookies you list in the
   config must match what your site actually uses. Update them when you add a
   tool, and bump `policyVersion`.
4. **Write a privacy policy.** The kit links to your `/privacy` and `/cookies`
   routes but does not write the legal text.
5. **Server-side records, if you need them.** The kit stores the decision in the
   visitor's `localStorage` (client-side). If your accountability process
   requires a server-side audit log, capture the decision yourself by
   subscribing to the store and POSTing to your backend.
6. **Jurisdiction specifics.** GDPR (EU/EEA/UK), CCPA/CPRA (California), LGPD
   (Brazil), and others differ. The Global Privacy Control support helps with
   US "do not sell/share" signals, but you must confirm your obligations.

## On Do Not Track and Global Privacy Control

- **Do Not Track (DNT)** is a legacy header. It is widely ignored by ad-tech, but
  honoring it is privacy-protective and free, so the kit does.
- **Global Privacy Control (GPC)** is the modern signal and is **legally
  recognized** under CCPA/CPRA as a valid opt-out of sale/sharing; regulators
  increasingly treat it as a valid objection under GDPR too.

When either is set, any category with `respectDoNotTrack: true` reports `false`
from `hasConsent()` and is persisted as off — even if the visitor tries to
enable it. This is intentional: a clear browser-level opt-out should win.

## Data the kit stores

A single JSON object in `localStorage` under your `storageKey`, e.g.:

```json
{
  "status": "configured",
  "categories": { "essential": true, "analytics": false, "marketing": false },
  "ts": 1730000000000,
  "version": 1
}
```

No personal data, no identifiers, no network calls. It never leaves the browser.

# Configuration

Everything consentium does is driven by a single `ConsentConfig` object. Only
three fields are required; the rest is optional metadata used by the disclosure
UI.

```ts
import type { ConsentConfig } from "consentium";
```

## Minimal config

```ts
const config: ConsentConfig = {
  storageKey: "acme_consent",
  policyVersion: 1,
  categories: [
    {
      id: "analytics",
      label: "Analytics",
      description: "Usage metrics.",
      respectDoNotTrack: true,
    },
  ],
};
```

## Fields

### Core (required)

| Field           | Type                | Notes                                                                                                                |
| --------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `storageKey`    | `string`            | The `localStorage` key the decision is saved under. Use a stable, app-specific value.                                |
| `policyVersion` | `number`            | Bump when your policy materially changes — returning visitors are re-prompted (prior choices preserved as defaults). |
| `categories`    | `ConsentCategory[]` | Your optional categories. **Never include `essential`** — it's implicit and always on.                               |

### `ConsentCategory`

| Field               | Type       | Notes                                                                                                                                                                                                |
| ------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                | `string`   | Stable identifier, e.g. `"analytics"`. You pass this to `hasConsent(id)`.                                                                                                                            |
| `label`             | `string`   | Toggle label in the banner.                                                                                                                                                                          |
| `description`       | `string`   | One line shown under the toggle.                                                                                                                                                                     |
| `respectDoNotTrack` | `boolean?` | When `true`, the category is forced **off** if the browser signals Do Not Track or Global Privacy Control — even if the visitor toggles it on. Use it for any tracking/analytics/marketing category. |

### Optional metadata

Used only by the banner copy and `CookieDisclosureTable`. Safe to omit for a
minimal setup.

| Field                           | Type                      | Notes                                                    |
| ------------------------------- | ------------------------- | -------------------------------------------------------- |
| `productName`                   | `string?`                 | Interpolated into the default banner body (`{product}`). |
| `contactEmail`                  | `string?`                 | Surfaced in your own disclosure pages.                   |
| `legalEntity`                   | `LegalEntity?`            | Who operates the site (see below).                       |
| `routes`                        | `{ privacy?, cookies? }?` | Paths the banner's policy link and your footer point at. |
| `processors`                    | `Processor[]?`            | Third parties you disclose.                              |
| `cookies`                       | `CookieDescriptor[]?`     | Individual cookies/storage entries you disclose.         |
| `retention`                     | `RetentionEntry[]?`       | Data-retention rows.                                     |
| `effectiveDate` / `lastUpdated` | `string?`                 | ISO dates for your policy.                               |

### `LegalEntity`

```ts
type LegalEntity =
  | {
      status: "incorporated";
      legalName: string;
      jurisdiction: string;
      registeredAddress: string;
    }
  | { status: "pre-incorporation"; operatorName: string }
  | { status: "omitted" };
```

### `Processor`

```ts
type Processor = {
  name: string;
  purpose: string;
  dataCategories: string[];
  region: string;
  lawfulBasis: string;
  policyUrl: string;
  gatedBy: string; // category id, or "essential"
};
```

### `CookieDescriptor`

```ts
type CookieDescriptor = {
  name: string;
  type: "Cookie" | "localStorage" | "sessionStorage";
  provider: string;
  purpose: string;
  duration: string;
  category: string; // category id, or "essential"
};
```

## Presets

`presetCategories` gives you ready-made categories. `analytics` and `marketing`
are pre-flagged `respectDoNotTrack`.

```ts
import { presetCategories } from "consentium";

categories: [
  presetCategories.analytics,
  { ...presetCategories.marketing, description: "Custom wording…" },
];
```

## Policy versioning in practice

Start at `1`. When you add a processor or change what a category does, bump it:

```diff
- policyVersion: 1,
+ policyVersion: 2,
```

On their next visit, anyone who consented against v1 sees the banner again, with
their previous toggles pre-filled. New visitors are unaffected.

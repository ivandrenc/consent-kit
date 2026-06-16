# API reference

Everything is exported from the package root (`consentium`). The store and
detection helpers are also available from `consentium/core` (no React).

## Components

### `<ConsentProvider>`

Wraps your app and provides consent state to everything below.

| Prop            | Type                 | Default          | Notes                                              |
| --------------- | -------------------- | ---------------- | -------------------------------------------------- |
| `config`        | `ConsentConfig`      | —                | Required. See [configuration](./configuration.md). |
| `children`      | `ReactNode`          | —                | —                                                  |
| `copy`          | `PartialConsentCopy` | English defaults | Override any banner/link string.                   |
| `linkComponent` | `LinkComponent`      | `<a>`            | e.g. Next.js `<Link>` for SPA navigation.          |

### `<CookieBanner>`

The banner. Renders only while `status === "pending"`. No props. Mount it once,
inside the provider.

### `<CookieSettingsLink>`

A button styled as a link that re-opens the banner.

| Prop        | Type             | Notes                                                 |
| ----------- | ---------------- | ----------------------------------------------------- |
| `className` | `string?`        | —                                                     |
| `style`     | `CSSProperties?` | Merged over the default link styles.                  |
| `children`  | `ReactNode?`     | Custom label (defaults to `copy.settingsLink.label`). |

### `<CookieDisclosureTable>`

Renders `config.cookies` and `config.processors` as two tables.

| Prop     | Type                         | Notes                                 |
| -------- | ---------------------------- | ------------------------------------- |
| `labels` | `Partial<DisclosureLabels>?` | Translate the column/section headers. |

## Hooks

### `useConsent()`

Returns the context value:

```ts
{
  config: ConsentConfig;
  store: ConsentStore;
  record: ConsentRecord; // reactive
  copy: ConsentCopy; // resolved
  Link: LinkComponent;
  dntGated: Set<string>; // category ids forced off under DNT/GPC
}
```

### `useConsentCategory(id: string): boolean`

Reactive granted/denied for a category. Returns `true` for `"essential"`,
`false` for a DNT/GPC-gated category when a privacy signal is set.

### `useConsentStatus(): "pending" | "configured"`

Reactive banner status.

## Store (`consentium/core`)

### `createStore(config: ConsentConfig): ConsentStore`

| Method         | Signature                                       | Notes                                                   |
| -------------- | ----------------------------------------------- | ------------------------------------------------------- |
| `getConsent`   | `() => ConsentRecord`                           | Pending record during SSR.                              |
| `setConsent`   | `(categories: Record<string, boolean>) => void` | Partial; merges over current. DNT/GPC coercion applied. |
| `acceptAll`    | `() => void`                                    | All optional categories on.                             |
| `rejectAll`    | `() => void`                                    | All optional categories off.                            |
| `hasConsent`   | `(id: string) => boolean`                       | `"essential"` always `true`.                            |
| `reopenBanner` | `() => void`                                    | Status → `pending`, choices kept.                       |
| `subscribe`    | `(fn) => () => void`                            | Fires on every change; returns unsubscribe.             |

## Detection helpers (`consentium/core`)

| Export                            | Returns   | Notes                             |
| --------------------------------- | --------- | --------------------------------- |
| `isDoNotTrackEnabled()`           | `boolean` | Legacy DNT header.                |
| `isGlobalPrivacyControlEnabled()` | `boolean` | `navigator.globalPrivacyControl`. |
| `isPrivacySignalEnabled()`        | `boolean` | True if either of the above.      |

## Constants

| Export                  | Notes                                                  |
| ----------------------- | ------------------------------------------------------ |
| `CONSENT_CHANGE_EVENT`  | The `window` CustomEvent name (`"consentium:change"`). |
| `ESSENTIAL_CATEGORY_ID` | `"essential"`.                                         |
| `presetCategories`      | `{ functional, analytics, marketing }`.                |

## Copy

| Export               | Notes                                      |
| -------------------- | ------------------------------------------ |
| `defaultConsentCopy` | The full English default.                  |
| `mergeCopy(partial)` | Merge a partial override over the default. |

## Types

`ConsentConfig`, `ConsentCategory`, `ConsentRecord`, `ConsentStore`,
`Processor`, `CookieDescriptor`, `RetentionEntry`, `LegalEntity`, `ConsentCopy`,
`PartialConsentCopy`, `LinkComponent`, `ConsentProviderProps`,
`DisclosureLabels`.

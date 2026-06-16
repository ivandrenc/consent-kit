# consentium · Next.js App Router example

A minimal app that wires up `ConsentProvider`, `CookieBanner`, a live consent
readout, and a `/cookies` page built from `CookieDisclosureTable`.

## Run it

From the repo root, build the library once, then start the example:

```bash
# repo root
npm install            # builds consentium into dist/

cd examples/nextjs-app-router
npm install            # links the local package via file:../..
npm run dev            # http://localhost:3000
```

## What to look at

| File                   | Shows                                                                 |
| ---------------------- | --------------------------------------------------------------------- |
| `consent.config.ts`    | A complete `ConsentConfig` with categories, a processor, and a cookie |
| `app/providers.tsx`    | Mounting `ConsentProvider` + `CookieBanner`, with Next.js `<Link>`    |
| `app/layout.tsx`       | Importing `consentium/styles.css`                                     |
| `app/page.tsx`         | Reading consent live with `useConsent` / `useConsentCategory`         |
| `app/cookies/page.tsx` | `CookieDisclosureTable` + `CookieSettingsLink`                        |
| `app/globals.css`      | Theming via `--ck-*` overrides                                        |

> The config here is placeholder data. Swap in your real product details,
> processors, and cookies before shipping — and see
> [`docs/gdpr.md`](../../docs/gdpr.md).

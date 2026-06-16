# Next.js (App Router)

consentium is SSR-safe and works with the App Router out of the box. A full
runnable example is in [`examples/nextjs-app-router`](../examples/nextjs-app-router).

## 1. Provider in the root layout

`ConsentProvider` is a client component, so wrap it around your tree in the root
layout. Import the stylesheet here too.

```tsx
// app/layout.tsx
import "consentium/styles.css";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

```tsx
// app/providers.tsx
"use client";
import { ConsentProvider, CookieBanner } from "consentium";
import Link from "next/link";
import { consentConfig } from "@/consent.config";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConsentProvider config={consentConfig} linkComponent={Link}>
      {children}
      <CookieBanner />
    </ConsentProvider>
  );
}
```

Passing `linkComponent={Link}` makes the banner's policy link navigate
client-side. Without it, the banner falls back to a plain `<a>` (a full page
load), which is perfectly fine.

> Why no hydration warning? The provider renders the **pending** record on the
> server and only reads `localStorage` in a `useEffect` after mount. The banner
> itself returns `null` until mounted, so the server and first client render
> agree.

## 2. A `/cookies` page

Use `CookieDisclosureTable` to render the cookies and processors from your
config — no hand-maintained tables.

```tsx
// app/cookies/page.tsx
"use client";
import { CookieDisclosureTable, CookieSettingsLink } from "consentium";

export default function CookiesPage() {
  return (
    <main>
      <h1>Cookie policy</h1>
      <p>
        Change your choice anytime: <CookieSettingsLink />
      </p>
      <CookieDisclosureTable />
    </main>
  );
}
```

`CookieDisclosureTable` must be inside the `ConsentProvider` tree (it reads the
config from context), which the root layout already guarantees.

## 3. Gating analytics

Put your tracking loader in a client component that reads consent. See
[recipes.md](./recipes.md) for GA4, GTM Consent Mode, and PostHog.

## TypeScript path alias

The examples use `@/` — make sure your `tsconfig.json` has:

```json
{ "compilerOptions": { "paths": { "@/*": ["./*"] } } }
```

## Pages Router

It works there too — wrap `<ConsentProvider>` around `<Component />` in
`pages/_app.tsx` and render `<CookieBanner />` alongside it.

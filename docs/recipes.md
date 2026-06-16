# Recipes: gating real scripts

consent-kit records the decision; **you** decide what each category gates. The
golden rule: nothing that tracks should run before the matching `hasConsent`
returns `true`, and it should react when consent changes mid-session.

All recipes use the same two primitives:

```ts
const { store } = useConsent();
store.hasConsent("analytics"); // current state
store.subscribe((rec) => {
  /* runs on every change */
});
```

## PostHog

```tsx
"use client";
import { useEffect } from "react";
import posthog from "posthog-js";
import { useConsent } from "consent-kit";

export function PostHogGate() {
  const { store } = useConsent();

  useEffect(() => {
    let initialized = false;

    const init = () => {
      if (initialized) return;
      const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      if (!key) return;
      posthog.init(key, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
        persistence: "localStorage+cookie",
      });
      initialized = true;
    };

    if (store.hasConsent("analytics")) init();

    return store.subscribe(() => {
      const granted = store.hasConsent("analytics");
      if (granted && !initialized) init();
      else if (granted && initialized) posthog.opt_in_capturing();
      else if (!granted && initialized) posthog.opt_out_capturing();
    });
  }, [store]);

  return null;
}
```

> Read keys from environment variables (`NEXT_PUBLIC_*`), never hard-code them.

## Google Analytics 4 (gtag.js)

Load the tag only after consent, and stop on withdrawal:

```tsx
"use client";
import { useEffect } from "react";
import { useConsent } from "consent-kit";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function GoogleAnalyticsGate() {
  const { store } = useConsent();

  useEffect(() => {
    if (!GA_ID) return;
    const SCRIPT_ID = "ga-gtag";

    const load = () => {
      if (document.getElementById(SCRIPT_ID)) return;
      const s = document.createElement("script");
      s.id = SCRIPT_ID;
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(s);
      // @ts-expect-error gtag globals
      window.dataLayer = window.dataLayer || [];
      // @ts-expect-error gtag globals
      function gtag() {
        window.dataLayer.push(arguments);
      }
      // @ts-expect-error gtag globals
      gtag("js", new Date());
      // @ts-expect-error gtag globals
      gtag("config", GA_ID);
    };

    if (store.hasConsent("analytics")) load();

    return store.subscribe(() => {
      if (store.hasConsent("analytics")) load();
      else {
        // Tell GA to stop collecting for this property.
        // @ts-expect-error injected by gtag
        window[`ga-disable-${GA_ID}`] = true;
      }
    });
  }, [store]);

  return null;
}
```

## Google Consent Mode v2

If you prefer Google's Consent Mode (load gtag up front, but signal denied until
consent), push updates instead of loading scripts:

```tsx
"use client";
import { useEffect } from "react";
import { useConsent } from "consent-kit";

export function ConsentModeBridge() {
  const { store } = useConsent();

  useEffect(() => {
    // @ts-expect-error gtag globals
    window.dataLayer = window.dataLayer || [];
    // @ts-expect-error gtag globals
    function gtag() {
      window.dataLayer.push(arguments);
    }

    const update = () => {
      const analytics = store.hasConsent("analytics") ? "granted" : "denied";
      const marketing = store.hasConsent("marketing") ? "granted" : "denied";
      // @ts-expect-error gtag globals
      gtag("consent", "update", {
        analytics_storage: analytics,
        ad_storage: marketing,
        ad_user_data: marketing,
        ad_personalization: marketing,
      });
    };

    update();
    return store.subscribe(update);
  }, [store]);

  return null;
}
```

Set the **defaults to denied** in your base gtag snippet, before this bridge
runs:

```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
</script>
```

## Anything else

The pattern generalizes: on mount and on every `subscribe` callback, branch on
`store.hasConsent(categoryId)` to start or stop the integration. Because the
store also broadcasts across the page via a `window` event, multiple gates stay
in sync automatically.

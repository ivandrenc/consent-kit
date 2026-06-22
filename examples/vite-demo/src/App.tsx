import "consentium/styles.css";
import {
  ConsentProvider,
  CookieBanner,
  CookieSettingsLink,
  CookieDisclosureTable,
  useConsent,
  useConsentCategory,
} from "consentium";
import { consentConfig } from "./consent.config";

const accent = "#1c5b3d";
const danger = "#9a3b2f";

export function App() {
  return (
    <ConsentProvider config={consentConfig}>
      <Page />
      <CookieBanner />
    </ConsentProvider>
  );
}

function Page() {
  const { record } = useConsent();
  const analytics = useConsentCategory("analytics");
  const marketing = useConsentCategory("marketing");

  const reset = () => {
    localStorage.removeItem(consentConfig.storageKey);
    location.reload();
  };

  return (
    <main
      style={{
        maxWidth: 680,
        margin: "0 auto",
        padding: "3rem 1.5rem 6rem",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        color: "#131318",
        lineHeight: 1.6,
      }}
    >
      <h1
        style={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "2rem",
          margin: 0,
        }}
      >
        consentium
      </h1>
      <p style={{ color: "#3a3a44" }}>
        A live demo of the cookie-consent banner. On first load it slides in
        from the bottom-left — accept, reject, or open <em>Customize</em> for
        per-category toggles. Your choice persists in <code>localStorage</code>{" "}
        and the state below updates live.
      </p>

      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e4e3df",
          borderRadius: 12,
          padding: "1rem 1.25rem",
          margin: "1.5rem 0",
        }}
      >
        <h2 style={{ fontSize: "0.95rem", margin: "0 0 0.5rem" }}>
          Live consent state
        </h2>
        <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
          <li>
            Status: <strong>{record.status}</strong>
          </li>
          <li>
            Analytics granted:{" "}
            <strong style={{ color: analytics ? accent : danger }}>
              {String(analytics)}
            </strong>
          </li>
          <li>
            Marketing granted:{" "}
            <strong style={{ color: marketing ? accent : danger }}>
              {String(marketing)}
            </strong>
          </li>
        </ul>
      </section>

      <p>
        Change your mind: <CookieSettingsLink /> ·{" "}
        <button
          type="button"
          onClick={reset}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            color: accent,
            font: "inherit",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Reset (simulate a first-time visitor)
        </button>
      </p>

      <h2 id="cookies" style={{ fontSize: "0.95rem", marginTop: "2.5rem" }}>
        Disclosure tables
      </h2>
      <p style={{ color: "#3a3a44", marginTop: 0 }}>
        <code>&lt;CookieDisclosureTable /&gt;</code> renders the cookies and
        processors declared in your config — drop it on a <code>/cookies</code>{" "}
        page.
      </p>
      <CookieDisclosureTable />
    </main>
  );
}

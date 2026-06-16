"use client";

import { useConsent } from "./context";

export type DisclosureLabels = {
  cookiesHeading: string;
  cookieName: string;
  type: string;
  provider: string;
  purpose: string;
  duration: string;
  category: string;
  processorsHeading: string;
  processorName: string;
  region: string;
  lawfulBasis: string;
  dataCategories: string;
  policy: string;
  emptyCookies: string;
  emptyProcessors: string;
};

const DEFAULT_LABELS: DisclosureLabels = {
  cookiesHeading: "Cookies & local storage",
  cookieName: "Name",
  type: "Type",
  provider: "Provider",
  purpose: "Purpose",
  duration: "Duration",
  category: "Category",
  processorsHeading: "Third-party processors",
  processorName: "Service",
  region: "Region",
  lawfulBasis: "Lawful basis",
  dataCategories: "Data",
  policy: "Policy",
  emptyCookies: "No cookies are disclosed in the configuration.",
  emptyProcessors: "No processors are disclosed in the configuration.",
};

/**
 * Renders the cookies and processors declared in your `ConsentConfig` as two
 * accessible tables. Pure presentation of your own config data — drop it into
 * a `/cookies` page. Pass `labels` to translate the column headers.
 */
export function CookieDisclosureTable({
  labels: labelOverride,
}: {
  labels?: Partial<DisclosureLabels>;
}) {
  const { config } = useConsent();
  const labels = { ...DEFAULT_LABELS, ...labelOverride };
  const cookies = config.cookies ?? [];
  const processors = config.processors ?? [];

  return (
    <div className="ck-disclosure">
      <section>
        <h3 className="ck-disclosure-heading">{labels.cookiesHeading}</h3>
        {cookies.length === 0 ? (
          <p className="ck-disclosure-empty">{labels.emptyCookies}</p>
        ) : (
          <div className="ck-disclosure-scroll">
            <table className="ck-disclosure-table">
              <thead>
                <tr>
                  <th>{labels.cookieName}</th>
                  <th>{labels.type}</th>
                  <th>{labels.provider}</th>
                  <th>{labels.purpose}</th>
                  <th>{labels.duration}</th>
                  <th>{labels.category}</th>
                </tr>
              </thead>
              <tbody>
                {cookies.map((c) => (
                  <tr key={`${c.provider}:${c.name}`}>
                    <td>
                      <code>{c.name}</code>
                    </td>
                    <td>{c.type}</td>
                    <td>{c.provider}</td>
                    <td>{c.purpose}</td>
                    <td>{c.duration}</td>
                    <td>{c.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h3 className="ck-disclosure-heading">{labels.processorsHeading}</h3>
        {processors.length === 0 ? (
          <p className="ck-disclosure-empty">{labels.emptyProcessors}</p>
        ) : (
          <div className="ck-disclosure-scroll">
            <table className="ck-disclosure-table">
              <thead>
                <tr>
                  <th>{labels.processorName}</th>
                  <th>{labels.purpose}</th>
                  <th>{labels.dataCategories}</th>
                  <th>{labels.region}</th>
                  <th>{labels.lawfulBasis}</th>
                  <th>{labels.policy}</th>
                </tr>
              </thead>
              <tbody>
                {processors.map((p) => (
                  <tr key={p.name}>
                    <td>{p.name}</td>
                    <td>{p.purpose}</td>
                    <td>
                      <ul className="ck-disclosure-list">
                        {p.dataCategories.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    </td>
                    <td>{p.region}</td>
                    <td>{p.lawfulBasis}</td>
                    <td>
                      <a
                        href={p.policyUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {labels.policy}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

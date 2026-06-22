import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { ConsentProvider } from "../react/context";
import { CookieBanner } from "../react/CookieBanner";
import { CookieSettingsLink } from "../react/CookieSettingsLink";
import type { ConsentConfig } from "../core/types";

const CONFIG: ConsentConfig = {
  productName: "Acme",
  storageKey: "banner_test_consent",
  policyVersion: 1,
  routes: { cookies: "/cookies" },
  categories: [
    {
      id: "analytics",
      label: "Analytics",
      description: "Usage metrics",
      respectDoNotTrack: true,
    },
    { id: "marketing", label: "Marketing", description: "Ads" },
  ],
};

function Shell() {
  return (
    <ConsentProvider config={CONFIG}>
      <CookieBanner />
      <footer>
        <CookieSettingsLink />
      </footer>
    </ConsentProvider>
  );
}

describe("CookieBanner", () => {
  beforeEach(() => localStorage.clear());

  it("renders while pending and interpolates the product name", () => {
    render(<Shell />);
    expect(
      screen.getByRole("region", { name: /cookie consent/i }),
    ).toBeTruthy();
    expect(screen.getByText(/Acme uses cookies/i)).toBeTruthy();
  });

  it("hides after Accept all and persists the choice", () => {
    render(<Shell />);
    act(() => {
      fireEvent.click(screen.getByText("Accept all"));
    });
    expect(
      screen.queryByRole("region", { name: /cookie consent/i }),
    ).toBeNull();
    const stored = JSON.parse(localStorage.getItem("banner_test_consent")!);
    expect(stored.status).toBe("configured");
    expect(stored.categories.analytics).toBe(true);
    expect(stored.categories.marketing).toBe(true);
  });

  it("opens the customize panel and saves per-category choices", () => {
    render(<Shell />);
    act(() => {
      fireEvent.click(screen.getByText("Customize"));
    });
    // Essential toggle is present and disabled; optional toggles are editable.
    const toggles = screen.getAllByRole("switch") as HTMLInputElement[];
    expect(toggles[0].disabled).toBe(true);
    act(() => {
      fireEvent.click(toggles[1]); // enable analytics
    });
    act(() => {
      fireEvent.click(screen.getByText("Save preferences"));
    });
    const stored = JSON.parse(localStorage.getItem("banner_test_consent")!);
    expect(stored.categories.analytics).toBe(true);
    expect(stored.categories.marketing).toBe(false);
  });

  it("re-appears when the settings link reopens it", () => {
    render(<Shell />);
    act(() => {
      fireEvent.click(screen.getByText("Reject all"));
    });
    expect(
      screen.queryByRole("region", { name: /cookie consent/i }),
    ).toBeNull();
    act(() => {
      fireEvent.click(screen.getByText("Cookie settings"));
    });
    expect(
      screen.getByRole("region", { name: /cookie consent/i }),
    ).toBeTruthy();
  });

  it("returns focus to the element that opened it when closed", () => {
    render(<Shell />);
    // Dismiss the initial, auto-shown banner (no meaningful trigger to restore).
    act(() => {
      fireEvent.click(screen.getByText("Reject all"));
    });

    // Simulate a keyboard user focusing and activating the footer link.
    const settings = screen.getByText("Cookie settings") as HTMLButtonElement;
    act(() => {
      settings.focus();
      fireEvent.click(settings);
    });

    // The reopened banner takes focus to its headline…
    const heading = screen.getByRole("heading", {
      name: /your privacy choices/i,
    });
    expect(document.activeElement).toBe(heading);

    // …and closing it returns focus to the link that opened it.
    act(() => {
      fireEvent.click(screen.getByText("Reject all"));
    });
    expect(document.activeElement).toBe(settings);
  });
});

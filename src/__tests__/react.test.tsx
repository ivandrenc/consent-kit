import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import {
  ConsentProvider,
  useConsent,
  useConsentCategory,
  useConsentStatus,
} from "../react/context";
import type { ConsentConfig } from "../core/types";

const CONFIG: ConsentConfig = {
  storageKey: "react_test_consent",
  policyVersion: 1,
  categories: [
    {
      id: "analytics",
      label: "Analytics",
      description: "",
      respectDoNotTrack: true,
    },
  ],
};

function Probe() {
  const { record, store } = useConsent();
  const analytics = useConsentCategory("analytics");
  const status = useConsentStatus();
  return (
    <div>
      <div data-testid="status">{status}</div>
      <div data-testid="record-status">{record.status}</div>
      <div data-testid="analytics">{String(analytics)}</div>
      <button onClick={() => store.setConsent({ analytics: true })}>
        accept
      </button>
    </div>
  );
}

describe("ConsentProvider", () => {
  beforeEach(() => localStorage.clear());

  it("provides initial pending state", () => {
    render(
      <ConsentProvider config={CONFIG}>
        <Probe />
      </ConsentProvider>,
    );
    expect(screen.getByTestId("status").textContent).toBe("pending");
    expect(screen.getByTestId("analytics").textContent).toBe("false");
  });

  it("re-renders subscribers when consent changes", () => {
    render(
      <ConsentProvider config={CONFIG}>
        <Probe />
      </ConsentProvider>,
    );
    act(() => {
      screen.getByText("accept").click();
    });
    expect(screen.getByTestId("status").textContent).toBe("configured");
    expect(screen.getByTestId("analytics").textContent).toBe("true");
  });

  it("throws a helpful error when used outside the provider", () => {
    function Orphan() {
      useConsent();
      return null;
    }
    // Silence the expected React error boundary log noise.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Orphan />)).toThrow(
      /must be used inside <ConsentProvider>/,
    );
    spy.mockRestore();
  });
});

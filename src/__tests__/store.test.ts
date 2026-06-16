import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createStore } from "../core/store";
import type { ConsentConfig } from "../core/types";

const CONFIG: ConsentConfig = {
  storageKey: "test_consent",
  policyVersion: 1,
  categories: [
    {
      id: "analytics",
      label: "Analytics",
      description: "",
      respectDoNotTrack: true,
    },
    { id: "marketing", label: "Marketing", description: "" },
  ],
};

describe("consent store", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns a pending record when nothing is stored", () => {
    const store = createStore(CONFIG);
    const rec = store.getConsent();
    expect(rec.status).toBe("pending");
    expect(rec.categories.essential).toBe(true);
    expect(rec.categories.analytics).toBe(false);
    expect(rec.categories.marketing).toBe(false);
    expect(rec.version).toBe(1);
  });

  it("persists a configured record and reads it back", () => {
    const store = createStore(CONFIG);
    store.setConsent({ analytics: true, marketing: false });
    const rec = store.getConsent();
    expect(rec.status).toBe("configured");
    expect(rec.categories.essential).toBe(true);
    expect(rec.categories.analytics).toBe(true);
    expect(rec.categories.marketing).toBe(false);
    expect(rec.ts).toBeGreaterThan(0);
  });

  it("acceptAll sets every optional category true", () => {
    const store = createStore(CONFIG);
    store.acceptAll();
    const rec = store.getConsent();
    expect(rec.categories.analytics).toBe(true);
    expect(rec.categories.marketing).toBe(true);
    expect(rec.status).toBe("configured");
  });

  it("rejectAll sets every optional category false but keeps essential", () => {
    const store = createStore(CONFIG);
    store.rejectAll();
    const rec = store.getConsent();
    expect(rec.categories.essential).toBe(true);
    expect(rec.categories.analytics).toBe(false);
    expect(rec.categories.marketing).toBe(false);
    expect(rec.status).toBe("configured");
  });

  it("hasConsent returns true for essential always, false for unknown ids", () => {
    const store = createStore(CONFIG);
    expect(store.hasConsent("essential")).toBe(true);
    expect(store.hasConsent("analytics")).toBe(false);
    expect(store.hasConsent("nonexistent")).toBe(false);
  });

  it("partial setConsent preserves categories not mentioned", () => {
    const store = createStore(CONFIG);
    store.setConsent({ analytics: true, marketing: true });
    store.setConsent({ analytics: false }); // marketing untouched
    const rec = store.getConsent();
    expect(rec.categories.analytics).toBe(false);
    expect(rec.categories.marketing).toBe(true);
  });

  it("reopenBanner sets status to pending but preserves category choices", () => {
    const store = createStore(CONFIG);
    store.setConsent({ analytics: true, marketing: false });
    store.reopenBanner();
    const rec = store.getConsent();
    expect(rec.status).toBe("pending");
    expect(rec.categories.analytics).toBe(true);
    expect(rec.categories.marketing).toBe(false);
  });

  it("recovers from corrupt storage by returning pending", () => {
    localStorage.setItem("test_consent", "{not valid json");
    const store = createStore(CONFIG);
    expect(store.getConsent().status).toBe("pending");
  });

  it("re-prompts when the stored policy version is older than the configured one", () => {
    localStorage.setItem(
      "test_consent",
      JSON.stringify({
        status: "configured",
        categories: { essential: true, analytics: true, marketing: false },
        ts: 1234,
        version: 1,
      }),
    );
    const store = createStore({ ...CONFIG, policyVersion: 2 });
    const rec = store.getConsent();
    expect(rec.status).toBe("pending");
    expect(rec.categories.analytics).toBe(true);
    expect(rec.categories.marketing).toBe(false);
    expect(rec.categories.essential).toBe(true);
  });

  it("drops categories that are no longer configured", () => {
    localStorage.setItem(
      "test_consent",
      JSON.stringify({
        status: "configured",
        categories: { essential: true, analytics: true, legacy: true },
        ts: 1,
        version: 1,
      }),
    );
    const store = createStore(CONFIG);
    const rec = store.getConsent();
    expect(rec.categories.legacy).toBeUndefined();
    expect(rec.categories.analytics).toBe(true);
  });

  describe("Do Not Track / Global Privacy Control", () => {
    const dntDescriptor = Object.getOwnPropertyDescriptor(
      window.navigator,
      "doNotTrack",
    );

    afterEach(() => {
      if (dntDescriptor) {
        Object.defineProperty(window.navigator, "doNotTrack", dntDescriptor);
      } else {
        Object.defineProperty(window.navigator, "doNotTrack", {
          value: undefined,
          configurable: true,
        });
      }
      Object.defineProperty(window.navigator, "globalPrivacyControl", {
        value: undefined,
        configurable: true,
      });
    });

    it("forces a respectDoNotTrack category off when DNT is enabled", () => {
      Object.defineProperty(window.navigator, "doNotTrack", {
        value: "1",
        configurable: true,
      });
      const store = createStore(CONFIG);
      store.setConsent({ analytics: true, marketing: true });
      expect(store.hasConsent("analytics")).toBe(false);
      // Marketing is not flagged respectDoNotTrack, so DNT leaves it alone.
      expect(store.hasConsent("marketing")).toBe(true);
      expect(store.getConsent().categories.analytics).toBe(false);
      expect(store.getConsent().categories.marketing).toBe(true);
    });

    it("forces a respectDoNotTrack category off under Global Privacy Control", () => {
      Object.defineProperty(window.navigator, "globalPrivacyControl", {
        value: true,
        configurable: true,
      });
      const store = createStore(CONFIG);
      store.setConsent({ analytics: true });
      expect(store.hasConsent("analytics")).toBe(false);
    });

    it("leaves behavior unchanged when no privacy signal is set", () => {
      Object.defineProperty(window.navigator, "doNotTrack", {
        value: "0",
        configurable: true,
      });
      const store = createStore(CONFIG);
      store.setConsent({ analytics: true });
      expect(store.hasConsent("analytics")).toBe(true);
    });
  });

  it("notifies subscribers via the change event and stops after unsubscribe", () => {
    const store = createStore(CONFIG);
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    store.setConsent({ analytics: true });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].categories.analytics).toBe(true);
    unsubscribe();
    store.setConsent({ analytics: false });
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

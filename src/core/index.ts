// Framework-agnostic core. Import from `consent-kit/core` to use the store
// without React (e.g. in a Vue/Svelte/vanilla integration).

export type {
  ConsentCategory,
  ConsentRecord,
  ConsentConfig,
  Processor,
  CookieDescriptor,
  RetentionEntry,
  LegalEntity,
} from "./types";

export { createStore } from "./store";
export type { ConsentStore } from "./store";

export {
  CONSENT_CHANGE_EVENT,
  ESSENTIAL_CATEGORY_ID,
  isDoNotTrackEnabled,
  isGlobalPrivacyControlEnabled,
  isPrivacySignalEnabled,
} from "./defaults";

export { presetCategories } from "./presets";

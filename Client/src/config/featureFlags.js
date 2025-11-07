// Centralized feature flags controlled via Vite env vars
// Each flag defaults to false when not provided

const bool = (val) => String(val).toLowerCase() === "true";

export const features = {
  AI: bool(import.meta.env.VITE_FEATURE_AI),
  BADGES: bool(import.meta.env.VITE_FEATURE_BADGES),
  GAMES: bool(import.meta.env.VITE_FEATURE_GAMES),
  ABOUT: bool(import.meta.env.VITE_FEATURE_ABOUT),
  FRIENDS: bool(import.meta.env.VITE_FEATURE_FRIENDS),
  CHAT: bool(import.meta.env.VITE_FEATURE_CHAT),
  SESSIONS: bool(import.meta.env.VITE_FEATURE_SESSIONS),
  EXPLORE_ROOMS: bool(import.meta.env.VITE_FEATURE_EXPLORE_ROOMS),
  STATS_TEST: bool(import.meta.env.VITE_FEATURE_STATS_TEST),
};

export default features;

import {
  checkBadgeAchievements,
  saveBadgesToStorage,
  loadBadgesFromStorage,
  getNewlyEarnedBadges,
} from "./badgeSystem";

// Global badge checker that can be called from anywhere (notifications removed)
export const triggerBadgeCheck = (user, goals = [], userId = null) => {
  if (!user || !userId) return;

  const previousBadges = loadBadgesFromStorage(userId);
  const currentBadges = checkBadgeAchievements(user, goals);

  // Check for newly earned badges
  const newBadges = getNewlyEarnedBadges(previousBadges, currentBadges);

  // Note: Badge notifications have been removed
  // Badges are still tracked and saved, just no toast notifications

  // Save current badges to storage
  saveBadgesToStorage(userId, currentBadges);

  return {
    previousBadges,
    currentBadges,
    newBadges,
    hasNewBadges: newBadges.length > 0,
  };
};

// Hook to use badge checking in React components
export const useBadgeChecker = () => {
  return { triggerBadgeCheck };
};

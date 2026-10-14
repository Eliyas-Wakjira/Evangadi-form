import { API_ORIGIN } from "./apiBase.js";

/**
 * Resolves a full avatar URL from a relative path or external URL.
 */
export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return null;
  if (avatarPath.startsWith("http://") || avatarPath.startsWith("https://")) {
    return avatarPath;
  }
  return `${API_ORIGIN}${avatarPath.startsWith("/") ? "" : "/"}${avatarPath}`;
};

/**
 * Single source of truth for the backend URL.
 *
 * Both the axios client and avatar URL building derive from this module so a
 * deployment only has to set one variable. The value may be given with or
 * without a trailing `/api`; it is normalised here.
 */

const configuredBase = import.meta.env.VITE_API_BASE_URL;

if (!configuredBase && import.meta.env.PROD) {
  throw new Error(
    "VITE_API_BASE_URL must be set to the deployed backend URL.",
  );
}

const apiUrl = new URL(configuredBase || "http://localhost:4000");
if (
  !["http:", "https:"].includes(apiUrl.protocol) ||
  apiUrl.username ||
  apiUrl.password ||
  apiUrl.search ||
  apiUrl.hash ||
  !["", "/api"].includes(apiUrl.pathname.replace(/\/+$/, ""))
) {
  throw new Error(
    "VITE_API_BASE_URL must be a backend origin, optionally ending in /api.",
  );
}

/**
 * Backend origin with no path, e.g. "https://forum-api.onrender.com".
 */
export const API_ORIGIN = apiUrl.origin;

/**
 * Base URL for `/api` requests, e.g. "https://forum-api.onrender.com/api".
 */
export const API_BASE_URL = `${API_ORIGIN}/api`;

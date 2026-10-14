/**
 * Single source of truth for the backend URL.
 *
 * Both the axios client and avatar URL building derive from this module so a
 * deployment only has to set one variable. The value may be given with or
 * without a trailing `/api`; it is normalised here.
 */

// In production the Netlify site proxies `/api` and `/uploads` to the backend,
// so the same origin is used unless an explicit URL is configured.
const DEFAULT_API_ORIGIN = import.meta.env.DEV ? "http://localhost:4000" : "";

const configuredBase =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  DEFAULT_API_ORIGIN;

/**
 * Backend origin with no path, e.g. "https://forum-api.onrender.com".
 */
export const API_ORIGIN = configuredBase
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

/**
 * Base URL for `/api` requests, e.g. "https://forum-api.onrender.com/api".
 */
export const API_BASE_URL = `${API_ORIGIN}/api`;

/**
 * Custom error class representing API failures.
 * Captures HTTP status codes and error messages from the backend.
 */
export class APIError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "APIError";
    this.status = status;
  }
}

// ---------------------------------------------------------------------------
// Token refresh machinery
// A singleton promise prevents concurrent refresh storms: if multiple requests
// fail with TOKEN_EXPIRED at the same time, only one refresh call is made.
// ---------------------------------------------------------------------------
let refreshPromise: Promise<string | null> | null = null;

/**
 * Reads the stored refresh_token and calls POST /auth/refresh.
 * On success, writes the new access_token and refresh_token to localStorage.
 * On failure (or missing refresh_token), clears storage and redirects to /login.
 *
 * @returns The new access_token string, or null if the refresh failed.
 */
export async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    // Another in-flight refresh — wait for it instead of issuing a duplicate.
    return refreshPromise;
  }

  refreshPromise = (async (): Promise<string | null> => {
    try {
      const storedRefreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("refresh_token")
          : null;

      if (!storedRefreshToken) {
        console.log("[auth] No refresh_token found — redirecting to /login");
        clearAuthAndRedirect();
        return null;
      }

      console.log("[auth] TOKEN_EXPIRED detected — starting token refresh");

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: storedRefreshToken }),
      });

      const data = await response.json();

      if (!response.ok || data.code === "REFRESH_FAILED") {
        console.log("[auth] Refresh failed — clearing storage and redirecting to /login");
        clearAuthAndRedirect();
        return null;
      }

      // Store the new tokens
      localStorage.setItem("token", data.access_token);
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }
      window.dispatchEvent(new Event("storage"));

      console.log("[auth] Token refresh successful — new access_token stored");
      return data.access_token as string;
    } finally {
      // Release the lock so future expiries can trigger a new refresh cycle.
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Clears all auth keys from localStorage and navigates to the login page.
 */
function clearAuthAndRedirect(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    window.dispatchEvent(new Event("storage"));
    window.location.href = "/login";
  }
}

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

/**
 * Base fetch wrapper that reads NEXT_PUBLIC_API_URL from environment variables
 * and processes responses with strict error handling.
 *
 * Automatically handles TOKEN_EXPIRED responses:
 *  1. Calls POST /auth/refresh with the stored refresh_token.
 *  2. Stores the new tokens.
 *  3. Retries the original request exactly once.
 *  4. If refresh fails, clears storage and redirects to /login.
 *
 * @param path    The endpoint path relative to the base URL
 * @param options Standard RequestInit options
 * @returns Parsed JSON for successful responses
 * @throws APIError if the response is not ok (after optional retry)
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  _isRetry = false
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const url = `${baseUrl}${path}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    console.log("[client] Token exists in localStorage:", !!token);
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const mergedHeaders: HeadersInit = {
    ...defaultHeaders,
    ...(options.headers as Record<string, string> || {}),
  };

  console.log(
    "[client] Authorization attached:",
    !!(mergedHeaders as Record<string, string>)["Authorization"]
  );

  const response = await fetch(url, {
    ...options,
    headers: mergedHeaders,
  });

  // ---- TOKEN_EXPIRED handling ----
  if (response.status === 401 && !_isRetry) {
    let body: Record<string, unknown> = {};
    try {
      body = await response.json();
    } catch {
      // ignore parse failure
    }

    if (body.code === "TOKEN_EXPIRED") {
      console.log("[client] Received TOKEN_EXPIRED — attempting refresh");
      const newToken = await refreshAccessToken();

      if (newToken) {
        console.log("[client] Retrying original request with new token");
        return apiFetch<T>(path, options, true /* _isRetry */);
      }

      // Redirect already handled inside refreshAccessToken
      throw new APIError(401, "Session expired. Please log in again.");
    }

    // Generic 401 — surface the message
    const errorMessage =
      (body as any).message ||
      (body as any).detail ||
      `Request failed with status ${response.status}`;
    throw new APIError(
      response.status,
      typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage)
    );
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData && errorData.detail) {
        errorMessage =
          typeof errorData.detail === "string"
            ? errorData.detail
            : JSON.stringify(errorData.detail);
      }
    } catch {
      // Ignore parse failure and use fallback message
    }
    throw new APIError(response.status, errorMessage);
  }

  return response.json() as Promise<T>;
}

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
 * Extracts the error code from a FastAPI HTTPException body.
 *
 * FastAPI serialises HTTPException details as:
 *   { "detail": { "code": "TOKEN_EXPIRED", "message": "..." } }
 *   OR (for plain string details):
 *   { "detail": "Not authenticated." }
 *
 * This helper reads both shapes so callers don't have to.
 */
function getErrorCode(body: Record<string, unknown>): string | undefined {
  const detail = body.detail;
  if (detail && typeof detail === "object") {
    return (detail as Record<string, unknown>).code as string | undefined;
  }
  // Some endpoints set code at top level
  return body.code as string | undefined;
}

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
        console.log("[auth] No refresh_token in localStorage — clearing and redirecting to /login");
        clearAuthAndRedirect();
        return null;
      }

      console.log("[auth] TOKEN_EXPIRED received — calling POST /auth/refresh");

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: storedRefreshToken }),
      });

      let data: Record<string, unknown> = {};
      try {
        data = await response.json();
      } catch {
        // empty body — treat as failure
      }

      const code = getErrorCode(data);
      if (!response.ok || code === "REFRESH_FAILED") {
        console.log("[auth] Refresh failed (REFRESH_FAILED) — clearing storage and redirecting to /login");
        clearAuthAndRedirect();
        return null;
      }

      // Store the new tokens
      const newAccessToken = data.access_token as string;
      localStorage.setItem("token", newAccessToken);
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token as string);
      }
      window.dispatchEvent(new Event("storage"));

      console.log("[auth] Refresh successful — new tokens stored");
      return newAccessToken;
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
 *  1. Detects code=TOKEN_EXPIRED inside the FastAPI `detail` object.
 *  2. Calls POST /auth/refresh with the stored refresh_token.
 *  3. Stores the new tokens.
 *  4. Retries the original request exactly once.
 *  5. If refresh fails, clears storage and redirects to /login.
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
    console.log("[client] Token in localStorage:", !!token);
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const mergedHeaders: HeadersInit = {
    ...defaultHeaders,
    ...(options.headers as Record<string, string> || {}),
  };

  console.log(
    "[client] Authorization header attached:",
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

    console.log("[client] 401 body received:", JSON.stringify(body));
    const code = getErrorCode(body);
    console.log("[client] Parsed error code:", code);

    if (code === "TOKEN_EXPIRED") {
      console.log("[client] TOKEN_EXPIRED received — attempting refresh");
      const newToken = await refreshAccessToken();

      if (newToken) {
        console.log("[client] Retrying original request with new token");
        return apiFetch<T>(path, options, true /* _isRetry */);
      }

      // Redirect already handled inside refreshAccessToken
      throw new APIError(401, "Session expired. Please log in again.");
    }

    // Generic 401 — surface the backend message
    const detail = body.detail;
    const errorMessage =
      (typeof detail === "object" && detail !== null
        ? (detail as any).message
        : typeof detail === "string"
        ? detail
        : null) ||
      (body as any).message ||
      `Request failed with status ${response.status}`;
    throw new APIError(response.status, errorMessage);
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData?.detail) {
        errorMessage =
          typeof errorData.detail === "string"
            ? errorData.detail
            : (errorData.detail as any).message || JSON.stringify(errorData.detail);
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Ignore parse failure and use fallback message
    }
    throw new APIError(response.status, errorMessage);
  }

  return response.json() as Promise<T>;
}

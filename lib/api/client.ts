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

/**
 * Base fetch wrapper that reads NEXT_PUBLIC_API_URL from environment variables
 * and processes responses with strict error handling.
 * 
 * @param path The endpoint path relative to the base URL
 * @param options Standard RequestInit options to configure the call
 * @returns Parsed JSON for successful responses
 * @throws APIError if response is not ok
 */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const url = `${baseUrl}${path}`;

  // Default headers merged with user-defined options
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    console.log("[client] Token exists in localStorage:", !!token);
    console.log("[client] Token length:", token?.length);
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const mergedHeaders = {
    ...defaultHeaders,
    ...(options.headers || {}),
  } as HeadersInit;

  console.log("[client] Authorization attached:", !mergedHeaders ? false : !!(mergedHeaders as any)["Authorization"]);

  const response = await fetch(url, {
    ...options,
    headers: mergedHeaders,
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData && errorData.detail) {
        errorMessage = typeof errorData.detail === "string" ? errorData.detail : JSON.stringify(errorData.detail);
      }
    } catch {
      // Ignore parse failure and use fallback message
    }
    throw new APIError(response.status, errorMessage);
  }

  return response.json() as Promise<T>;
}

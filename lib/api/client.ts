import { API_ENDPOINTS } from "./endpoints";
import { mockApi } from "./mock";

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

const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
};

const getHeaders = (customHeaders?: HeadersInit): HeadersInit => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Bearer token support for future auth
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return { ...headers, ...customHeaders };
};

/**
 * Helper to handle HTTP response and throw descriptive APIError if failed.
 */
const handleResponse = async (response: Response): Promise<Response> => {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        message = errorData.message;
      } else if (errorData && errorData.detail) {
        message = typeof errorData.detail === "string" ? errorData.detail : JSON.stringify(errorData.detail);
      }
    } catch {
      // Fallback if parsing JSON error fails
    }
    throw new APIError(response.status, message);
  }
  return response;
};

/**
 * Fetch/HTTP wrapper utility.
 * Intercepts calls when NEXT_PUBLIC_USE_MOCK is true (or when env not configured to false),
 * otherwise routes requests to the real API backend.
 */
export const apiClient = {
  /**
   * Executes a GET request.
   * If mock mode is active, delegates to mock API handlers.
   * @param path The endpoint path/route
   * @param headers Optional custom headers
   * @returns Resolves to the parsed JSON response
   */
  get: async <T>(path: string, headers?: HeadersInit): Promise<T> => {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
    
    if (useMock) {
      // Mock intercepts
      if (path === API_ENDPOINTS.PROJECTS) {
        return (await mockApi.getProjects()) as unknown as T;
      }
      if (path.startsWith("/projects/") || path.startsWith("/project/")) {
        const parts = path.split("/");
        const id = parts[parts.length - 1] || "";
        return (await mockApi.getProjectById(id)) as unknown as T;
      }
      throw new Error(`GET Endpoint not implemented in mock API: ${path}`);
    }

    const url = `${getBaseUrl()}${path}`;
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(headers),
    });

    const verifiedResponse = await handleResponse(response);
    return verifiedResponse.json() as Promise<T>;
  },

  /**
   * Executes a POST request.
   * If mock mode is active, delegates to mock API handlers.
   * @param path The endpoint path/route
   * @param body Request body
   * @param headers Optional custom headers
   * @returns Resolves to the parsed JSON response
   */
  post: async <T>(path: string, body?: unknown, headers?: HeadersInit): Promise<T> => {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

    if (useMock) {
      // Mock intercepts
      if (path === API_ENDPOINTS.GENERATE) {
        const payload = body as { prompt: string; themeConfig?: { primaryColor?: string; fontFamily?: string } } | undefined;
        const prompt = payload?.prompt ?? "";
        const themeConfig = payload?.themeConfig;
        return (await mockApi.generateUI(prompt, themeConfig)) as unknown as T;
      }
      if (path === API_ENDPOINTS.IMPROVE) {
        const payload = body as { projectId: string; feedback: string } | undefined;
        const projectId = payload?.projectId ?? "";
        const feedback = payload?.feedback ?? "";
        return (await mockApi.improveUI(projectId, feedback)) as unknown as T;
      }
      if (path === API_ENDPOINTS.EXPORT) {
        const payload = body as { projectId: string } | undefined;
        const projectId = payload?.projectId ?? "";
        return (await mockApi.exportProject(projectId)) as unknown as T;
      }
      throw new Error(`POST Endpoint not implemented in mock API: ${path}`);
    }

    const url = `${getBaseUrl()}${path}`;
    const response = await fetch(url, {
      method: "POST",
      headers: getHeaders(headers),
      body: body ? JSON.stringify(body) : undefined,
    });

    const verifiedResponse = await handleResponse(response);
    return verifiedResponse.json() as Promise<T>;
  },

  /**
   * Executes a DELETE request.
   * @param path The endpoint path/route
   * @param headers Optional custom headers
   * @returns Resolves to the parsed JSON response or empty object
   */
  delete: async <T>(path: string, headers?: HeadersInit): Promise<T> => {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

    if (useMock) {
      if (path.startsWith("/project/")) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        return { success: true } as unknown as T;
      }
      throw new Error(`DELETE Endpoint not implemented in mock API: ${path}`);
    }

    const url = `${getBaseUrl()}${path}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: getHeaders(headers),
    });

    const verifiedResponse = await handleResponse(response);
    return verifiedResponse.json() as Promise<T>;
  },
};

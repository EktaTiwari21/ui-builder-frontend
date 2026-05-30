import { API_ENDPOINTS } from "./endpoints";
import { mockApi } from "./mock";

/**
 * Fetch/HTTP wrapper utility.
 * Intercepts all outgoing client calls in Phase 1 and delegates directly to mock API handlers.
 */
export const apiClient = {
  /**
   * Executes a simulated GET request to the mock service layer.
   * Supports listing all user projects and single project detail lookups.
   * @param url The target endpoint route
   * @returns A promise resolving to the formatted API payload structure
   */
  get: async <T>(url: string): Promise<T> => {
    // Intercept listing projects request
    if (url === API_ENDPOINTS.PROJECTS) {
      return (await mockApi.getProjects()) as unknown as T;
    }

    // Intercept single project lookup request (e.g. /projects/proj-id or /project/proj-id)
    if (url.startsWith("/projects/") || url.startsWith("/project/")) {
      const parts = url.split("/");
      const id = parts[parts.length - 1] || "";
      return (await mockApi.getProjectById(id)) as unknown as T;
    }

    throw new Error(`GET Endpoint not implemented in Phase 1 Mock API: ${url}`);
  },

  /**
   * Executes a simulated POST request to the mock service layer.
   * Supports generating mock components, improving layouts, and exporting codebases.
   * @param url The target endpoint route
   * @param body Optional JSON body arguments matching the target request types
   * @returns A promise resolving to the formatted API payload structure
   */
  post: async <T>(url: string, body?: unknown): Promise<T> => {
    // Intercept new UI generation request
    if (url === API_ENDPOINTS.GENERATE) {
      const payload = body as { prompt: string; themeConfig?: { primaryColor?: string; fontFamily?: string } } | undefined;
      const prompt = payload?.prompt ?? "";
      const themeConfig = payload?.themeConfig;
      return (await mockApi.generateUI(prompt, themeConfig)) as unknown as T;
    }

    // Intercept UI refinement/improvement request
    if (url === API_ENDPOINTS.IMPROVE) {
      const payload = body as { projectId: string; feedback: string } | undefined;
      const projectId = payload?.projectId ?? "";
      const feedback = payload?.feedback ?? "";
      return (await mockApi.improveUI(projectId, feedback)) as unknown as T;
    }

    // Intercept codebase zip export request
    if (url === API_ENDPOINTS.EXPORT) {
      const payload = body as { projectId: string } | undefined;
      const projectId = payload?.projectId ?? "";
      return (await mockApi.exportProject(projectId)) as unknown as T;
    }

    throw new Error(`POST Endpoint not implemented in Phase 1 Mock API: ${url}`);
  },
};

import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import { Project } from "@/types/project";
import { GenerateUIResponse, ImproveUIResponse, ExportProjectResponse } from "@/types/api";

/**
 * Real API endpoint wrappers matching backend routes in AGENTS.md.
 * Utilizes apiClient for actual HTTP fetching and error handlings.
 */
export const realApi = {
  /**
   * Health check endpoint call.
   */
  getHealth: async (): Promise<{ status: string }> => {
    return apiClient.get<{ status: string }>(API_ENDPOINTS.HEALTH);
  },

  /**
   * Generates a new React and Tailwind UI component from a user prompt.
   * Note: The actual generate-ui endpoint returns an SSE stream, which is handled in lib/ai/stream.ts.
   * This function can be used for standard POST fetching where applicable.
   */
  generateUI: async (
    prompt: string,
    style: "minimal" | "modern" | "corporate" | "playful" = "modern",
    framework: "react-tailwind" = "react-tailwind"
  ): Promise<GenerateUIResponse> => {
    return apiClient.post<GenerateUIResponse>(API_ENDPOINTS.GENERATE, {
      prompt,
      style,
      framework,
    });
  },

  /**
   * Refines or improves an existing project's source code based on an instruction.
   * Note: This endpoint returns an SSE stream in Phase 3, which is handled in lib/ai/stream.ts.
   * This is a fallback helper for standard POST requests.
   */
  improveUI: async (projectId: string, instruction: string): Promise<ImproveUIResponse> => {
    return apiClient.post<ImproveUIResponse>(API_ENDPOINTS.IMPROVE, {
      project_id: projectId,
      instruction,
    });
  },

  /**
   * Lists all projects from the database.
   */
  getProjects: async (): Promise<Project[]> => {
    return apiClient.get<Project[]>(API_ENDPOINTS.PROJECTS);
  },

  /**
   * Looks up a single project by its ID.
   */
  getProjectById: async (id: string): Promise<Project> => {
    return apiClient.get<Project>(API_ENDPOINTS.PROJECT(id));
  },

  /**
   * Deletes a project by its unique ID.
   */
  deleteProject: async (id: string): Promise<{ success: boolean }> => {
    return apiClient.delete<{ success: boolean }>(API_ENDPOINTS.PROJECT(id));
  },

  /**
   * Packages the project workspace files into a zipped downloadable bundle.
   */
  exportProject: async (projectId: string): Promise<ExportProjectResponse> => {
    return apiClient.post<ExportProjectResponse>(API_ENDPOINTS.EXPORT, {
      project_id: projectId,
    });
  },
};

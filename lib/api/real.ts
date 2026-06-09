import { apiFetch } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import { Project } from "@/types/project";
import { ExportProjectResponse } from "@/types/api";

/**
 * Real API endpoint calls wrapping apiFetch helper for production backend.
 */
export const realApi = {
  /**
   * Retrieves all user projects.
   */
  getProjects: async (): Promise<Project[]> => {
    return apiFetch<Project[]>(API_ENDPOINTS.PROJECTS, {
      method: "GET",
    });
  },

  /**
   * Retrieves a single project details by ID.
   */
  getProjectById: async (id: string): Promise<Project> => {
    return apiFetch<Project>(API_ENDPOINTS.PROJECT_BY_ID(id), {
      method: "GET",
    });
  },

  /**
   * Deletes a project by ID.
   */
  deleteProject: async (id: string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(API_ENDPOINTS.DELETE_PROJECT(id), {
      method: "DELETE",
    });
  },

  /**
   * Exports a project codebase bundle.
   */
  exportProject: async (id: string): Promise<ExportProjectResponse> => {
    return apiFetch<ExportProjectResponse>(API_ENDPOINTS.EXPORT_PROJECT, {
      method: "POST",
      body: JSON.stringify({ project_id: id }),
    });
  },
};

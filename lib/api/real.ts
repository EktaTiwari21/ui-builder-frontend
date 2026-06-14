import { apiFetch } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import { Project } from "@/types/project";
import { ExportProjectResponse } from "@/types/api";

/**
 * Transforms a raw backend API project response (snake_case) into the
 * frontend Project interface (camelCase).
 */
function transformProject(raw: Record<string, unknown>): Project {
  return {
    id: raw.id as string,
    userId: (raw.user_id ?? raw.userId) as string,
    title: (raw.title ?? "Untitled Project") as string,
    prompt: (raw.prompt ?? "") as string,
    // Backend stores as generated_code (snake_case)
    generatedCode: ((raw.generated_code ?? raw.generatedCode) as string) || "",
    previewUrl: (raw.preview_url ?? raw.previewUrl) as string | undefined,
    createdAt: (raw.created_at ?? raw.createdAt) as string,
  };
}

/**
 * Real API endpoint calls wrapping apiFetch helper for production backend.
 */
export const realApi = {
  /**
   * Retrieves all user projects.
   */
  getProjects: async (): Promise<Project[]> => {
    const raw = await apiFetch<Record<string, unknown>[]>(API_ENDPOINTS.PROJECTS, {
      method: "GET",
    });
    return raw.map(transformProject);
  },

  /**
   * Retrieves a single project details by ID.
   */
  getProjectById: async (id: string): Promise<Project> => {
    const raw = await apiFetch<Record<string, unknown>>(API_ENDPOINTS.PROJECT_BY_ID(id), {
      method: "GET",
    });
    return transformProject(raw);
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

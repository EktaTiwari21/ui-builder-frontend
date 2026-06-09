/**
 * API route endpoints constants definition matching AGENTS.md requirements.
 */
export const API_ENDPOINTS = {
  GENERATE_UI: "/generate-ui",
  IMPROVE_UI: "/improve-ui",
  PROJECTS: "/projects",
  PROJECT_BY_ID: (id: string) => `/project/${id}`,
  DELETE_PROJECT: (id: string) => `/project/${id}`,
  EXPORT_PROJECT: "/export-project",
} as const;

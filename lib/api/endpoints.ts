/**
 * API route endpoints constants definition.
 * Matches the backend API contract for Phase 3.
 */
export const API_ENDPOINTS = {
  HEALTH: "/health",
  GENERATE: "/generate-ui",
  IMPROVE: "/improve-ui",
  PROJECTS: "/projects",
  PROJECT: (id: string) => `/project/${id}`,
  EXPORT: "/export-project",
} as const;

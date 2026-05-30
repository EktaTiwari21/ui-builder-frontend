import { Project } from "./project";

/**
 * Payload configuration for theme parameters in generation requests.
 */
export interface ThemeConfig {
  /** Hex code or tailwind color name for primary color theme */
  primaryColor?: string;
  /** Primary typeface font family name */
  fontFamily?: string;
}

/**
 * Request payload for creating/generating a new UI component.
 */
export interface GenerateUIRequest {
  /** The natural language prompt input by the user */
  prompt: string;
  /** Optional theme styling parameters to seed the generator */
  themeConfig?: ThemeConfig;
}

/**
 * Response structure returned after a successful UI generation process.
 */
export interface GenerateUIResponse {
  /** The unique project ID generated or updated */
  projectId: string;
  /** The fully updated project model */
  project: Project;
  /** The raw source code of the generated page or component */
  code: string;
}

/**
 * Request payload for refining or improving an existing generated UI.
 */
export interface ImproveUIRequest {
  /** The reference project ID to refine */
  projectId: string;
  /** The user refinement instruction or feedback text */
  feedback: string;
}

/**
 * Response structure returned after applying iterative UI refinements.
 */
export interface ImproveUIResponse {
  /** The newly refined React/Tailwind source code block */
  code: string;
}

/**
 * Request payload for exporting the generated codebase.
 */
export interface ExportProjectRequest {
  /** The reference project ID to package */
  projectId: string;
}

/**
 * Response structure returned after packaging the code.
 */
export interface ExportProjectResponse {
  /** The pre-signed download URL of the compressed zip file */
  downloadUrl: string;
}

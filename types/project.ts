/**
 * Represents a single generated UI project in the system.
 */
export interface Project {
  /** The unique identifier of the project */
  id: string;
  /** The unique identifier of the user who owns this project */
  userId: string;
  /** The title or name of the project */
  title: string;
  /** The initial prompt describing the app idea */
  prompt: string;
  /** The fully generated React and Tailwind CSS source code */
  generatedCode: string;
  /** The live preview iframe rendering URL (optional) */
  previewUrl?: string;
  /** The ISO date string of when the project was created */
  createdAt: string;
}

/**
 * Represents a node inside the generated component hierarchy tree.
 */
export interface ComponentNode {
  /** The unique identifier of the component node */
  id: string;
  /** The name of the component (e.g. Header, ButtonGrid) */
  name: string;
  /** The type of node (e.g. Layout, Component, Primitive) */
  type: string;
  /** Optional key-value props configuration for this component node */
  props?: Record<string, unknown>;
  /** Optional nested children components */
  children?: ComponentNode[];
}

/**
 * Represents an audit log entry for a specific AI code generation call.
 */
export interface GenerationAudit {
  /** The unique identifier of the generation log */
  id: string;
  /** The reference project ID */
  projectId: string;
  /** The specific AI model used (e.g. Gemini-1.5-pro, GPT-4o) */
  aiModel: string;
  /** Number of tokens parsed from the prompt */
  promptTokens: number;
  /** Number of tokens returned in the generation response */
  responseTokens: number;
  /** The status of this specific generation attempt */
  generationStatus: "success" | "failed" | "generating";
  /** Execution latency in milliseconds */
  latency: number;
  /** The ISO date string of when the audit log was created */
  createdAt: string;
}

/**
 * Tracks the state of an active or historic UI generation process.
 */
export interface Generation {
  /** The unique identifier of the generation task */
  id: string;
  /** The reference project ID associated with this generation */
  projectId: string;
  /** The exact prompt or iterative refinement text submitted */
  prompt: string;
  /** The current status of this specific generation task */
  status: "idle" | "generating" | "success" | "error";
  /** The resulting code block (null if still generating or failed) */
  code: string | null;
  /** Detailed error message (null if successful or active) */
  error: string | null;
  /** The ISO date string of when the generation was initiated */
  createdAt: string;
}

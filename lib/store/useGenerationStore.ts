import { create } from "zustand";
import { Generation } from "@/types/project";

/**
 * Interface representing the state and actions of the Zustand UI generation store.
 */
export interface GenerationStore {
  /** The currently active or most recent generation task */
  activeGeneration: Generation | null;
  /** Tracks the list of generation logs for the active project session */
  history: Generation[];
  /** Accumulates the prompt tokens used during this session */
  promptTokens: number;
  /** Accumulates the response tokens received during this session */
  responseTokens: number;
  /** Accumulates active latency for metrics checking */
  latency: number;

  /**
   * Starts a new generation task, initializing loading status.
   * @param projectId The target project ID
   * @param prompt The prompt instruction submitted
   */
  startGeneration: (projectId: string, prompt: string) => void;

  /**
   * Marks the current generation task as successfully completed with the output code.
   * @param code The resulting generated source code block
   * @param metrics Optional token and latency metrics to track performance
   */
  completeGeneration: (
    code: string,
    metrics?: { promptTokens?: number; responseTokens?: number; latency?: number }
  ) => void;

  /**
   * Marks the current generation task as failed, storing the error message.
   * @param errorMessage The detailed failure reason
   */
  failGeneration: (errorMessage: string) => void;

  /**
   * Resets the entire generation store state.
   */
  reset: () => void;
}

/**
 * global generation state store (useGenerationStore) utilizing Zustand.
 * Manages active code generations, prompt inputs, token metrics, and histories.
 */
export const useGenerationStore = create<GenerationStore>((set) => ({
  activeGeneration: null,
  history: [],
  promptTokens: 0,
  responseTokens: 0,
  latency: 0,

  startGeneration: (projectId, prompt) => {
    const newGen: Generation = {
      id: `gen-${Date.now()}`,
      projectId,
      prompt,
      status: "generating",
      code: null,
      error: null,
      createdAt: new Date().toISOString(),
    };
    set({
      activeGeneration: newGen,
    });
  },

  completeGeneration: (code, metrics) =>
    set((state) => {
      if (!state.activeGeneration) return {};
      const updatedGen: Generation = {
        ...state.activeGeneration,
        status: "success",
        code,
        error: null,
      };
      return {
        activeGeneration: updatedGen,
        history: [...state.history, updatedGen],
        promptTokens: state.promptTokens + (metrics?.promptTokens ?? 0),
        responseTokens: state.responseTokens + (metrics?.responseTokens ?? 0),
        latency: state.latency + (metrics?.latency ?? 0),
      };
    }),

  failGeneration: (errorMessage) =>
    set((state) => {
      if (!state.activeGeneration) return {};
      const updatedGen: Generation = {
        ...state.activeGeneration,
        status: "error",
        code: null,
        error: errorMessage,
      };
      return {
        activeGeneration: updatedGen,
        history: [...state.history, updatedGen],
      };
    }),

  reset: () =>
    set({
      activeGeneration: null,
      history: [],
      promptTokens: 0,
      responseTokens: 0,
      latency: 0,
    }),
}));

import { useCallback, useState } from "react";
import { streamGenerate } from "@/lib/ai/stream";
import { useGenerationStore } from "@/lib/store/useGenerationStore";

/**
 * Custom hook to trigger UI generations and track operation statuses.
 * Connects directly to Phase 3 streamGenerate streaming logic.
 */
export function useGenerate() {
  const [loading, setLoading] = useState(false);
  const startGeneration = useGenerationStore((state) => state.startGeneration);

  const generate = useCallback(async (prompt: string, style: string = "modern", framework: string = "react-tailwind") => {
    setLoading(true);
    // Initialize generation task in store
    const tempProjectId = `proj-gen-${Date.now().toString().slice(-6)}`;
    startGeneration(tempProjectId, prompt);

    try {
      await streamGenerate(prompt, style, framework);
      return { success: true };
    } catch (err) {
      console.error("useGenerate stream execution failed:", err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [startGeneration]);

  return { generate, loading };
}

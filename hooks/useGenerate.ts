import { useCallback, useState } from "react";
import { streamGenerate } from "@/lib/ai/stream";

/**
 * Custom hook to trigger UI generations and track operation statuses.
 * Connects directly to Phase 3 streamGenerate streaming logic.
 */
export function useGenerate() {
  const [loading, setLoading] = useState(false);

  const generate = useCallback(async (prompt: string) => {
    setLoading(true);
    try {
      await streamGenerate(prompt);
      return { success: true };
    } finally {
      setLoading(false);
    }
  }, []);

  return { generate, loading };
}

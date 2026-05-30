import { useCallback, useState } from "react";

/**
 * Custom hook to trigger UI generations and track operation statuses.
 */
export function useGenerate() {
  const [loading, setLoading] = useState(false);

  const generate = useCallback(async (prompt: string) => {
    setLoading(true);
    try {
      console.log(`Generating with prompt: ${prompt}`);
      return { success: true };
    } finally {
      setLoading(false);
    }
  }, []);

  return { generate, loading };
}

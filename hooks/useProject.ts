import { useCallback, useState } from "react";

/**
 * Custom hook to load, save, and delete user project definitions.
 */
export function useProject() {
  const [loading, setLoading] = useState(false);

  const loadProject = useCallback(async (projectId: string) => {
    setLoading(true);
    try {
      console.log(`Loading project: ${projectId}`);
      return { id: projectId, title: "Loaded Project" };
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProject = useCallback(async (projectId: string, code: string) => {
    setLoading(true);
    try {
      console.log(`Saving project ${projectId} with code: ${code.slice(0, 10)}`);
      return true;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loadProject, saveProject, loading };
}

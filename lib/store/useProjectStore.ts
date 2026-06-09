import { create } from "zustand";
import { Project } from "@/types/project";
import { realApi } from "@/lib/api/real";
import { mockApi } from "@/lib/api/mock";

/**
 * Interface representing the state and actions of the Zustand project store.
 */
export interface ProjectStore {
  /** The collection of all projects owned by the user */
  projects: Project[];
  /** The currently selected active project, or null if no project is active */
  activeProject: Project | null;
  /** Tracks if a project CRUD operation or fetch is currently in progress */
  isLoading: boolean;
  /** Tracks any error message resulting from project operations */
  error: string | null;

  /**
   * Replaces the entire project collection in the store.
   * @param projects The array of Project objects to set
   */
  setProjects: (projects: Project[]) => void;

  /**
   * Sets the active project in the workspace.
   * @param project The Project object to set active, or null to clear the selection
   */
  setActiveProject: (project: Project | null) => void;

  /**
   * Appends a new project to the project collection.
   * @param project The Project object to add
   */
  addProject: (project: Project) => void;

  /**
   * Merges partial updates into an existing project.
   * @param id The unique project ID to update
   * @param updates The object containing partial project fields to apply
   */
  updateProject: (id: string, updates: Partial<Project>) => void;

  /**
   * Removes a project from the collection by its ID.
   * @param id The unique project ID to delete
   */
  deleteProject: (id: string) => Promise<void>;

  /**
   * Toggles the loading status of the store.
   * @param isLoading Boolean indicating if store is loading
   */
  setLoading: (isLoading: boolean) => void;

  /**
   * Sets the error message in the store.
   * @param error String message or null to clear existing errors
   */
  setError: (error: string | null) => void;

  /**
   * Action to fetch all projects from the active API client (real or mock).
   */
  fetchProjects: () => Promise<void>;

  /**
   * Action to fetch a single project by ID and set it active.
   * @param id The project identifier
   */
  fetchProjectById: (id: string) => Promise<Project>;
}

/**
 * Global project state store (useProjectStore) utilizing Zustand.
 * Manages project lists, active selections, loading flags, and CRUD actions.
 * Configures imports from mock.ts or real.ts depending on NEXT_PUBLIC_USE_MOCK env variable.
 */
export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  activeProject: null,
  isLoading: false,
  error: null,

  setProjects: (projects) => set({ projects }),
  setActiveProject: (activeProject) => set({ activeProject }),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, updates) =>
    set((state) => {
      const updatedProjects = state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p));
      const updatedActive =
        state.activeProject?.id === id ? { ...state.activeProject, ...updates } : state.activeProject;
      return {
        projects: updatedProjects,
        activeProject: updatedActive,
      };
    }),
  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";
      if (useMock) {
        // Mock delay simulation
        await new Promise((resolve) => setTimeout(resolve, 600));
      } else {
        await realApi.deleteProject(id);
      }
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        activeProject: state.activeProject?.id === id ? null : state.activeProject,
      }));
    } catch (err) {
      console.error("deleteProject error:", err);
      const message = err instanceof Error ? err.message : "Failed to delete project";
      set({ error: message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";
      const fetched = useMock ? await mockApi.getProjects() : await realApi.getProjects();
      set({ projects: fetched });
    } catch (err) {
      console.error("fetchProjects error:", err);
      const message = err instanceof Error ? err.message : "Failed to load projects";
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProjectById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";
      const project = useMock ? await mockApi.getProjectById(id) : await realApi.getProjectById(id);
      set({ activeProject: project });
      return project;
    } catch (err) {
      console.error("fetchProjectById error:", err);
      const message = err instanceof Error ? err.message : "Failed to load project details";
      set({ error: message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));

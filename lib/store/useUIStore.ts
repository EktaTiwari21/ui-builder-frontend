import { create } from "zustand";

/**
 * Interface representing the state and actions of the Zustand UI layout store.
 */
export interface UIStore {
  /** Indicates if the workspace primary navigation sidebar is open */
  sidebarOpen: boolean;
  /** The currently selected workspace customization panel */
  activePanel: "editor" | "preview" | "settings";
  /** The responsive view breakpoint format for the live preview container */
  viewMode: "desktop" | "tablet" | "mobile";
  /** The zoom level percentage (e.g. 100 for 100%) applied to the preview container */
  previewZoom: number;

  /**
   * Toggles the open/closed status of the navigation sidebar.
   */
  toggleSidebar: () => void;

  /**
   * Sets the active panel displayed in the workspace editing sidebar.
   * @param panel The active panel name ('editor' | 'preview' | 'settings')
   */
  setActivePanel: (panel: "editor" | "preview" | "settings") => void;

  /**
   * Adjusts the responsive view mode for the canvas.
   * @param mode The screen viewport size ('desktop' | 'tablet' | 'mobile')
   */
  setViewMode: (mode: "desktop" | "tablet" | "mobile") => void;

  /**
   * Updates the zoom factor of the preview canvas.
   * @param zoom The zoom scale percentage (e.g. 50, 75, 100, 125)
   */
  setPreviewZoom: (zoom: number) => void;

  /**
   * Resets all workspace layout settings back to default presets.
   */
  resetLayout: () => void;
}

/**
 * global UI state store (useUIStore) utilizing Zustand.
 * Manages canvas viewport sizes, editor panels, menus, and preview frame zoom levels.
 */
export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  activePanel: "preview",
  viewMode: "desktop",
  previewZoom: 100,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActivePanel: (activePanel) => set({ activePanel }),
  setViewMode: (viewMode) => set({ viewMode }),
  setPreviewZoom: (previewZoom) => set({ previewZoom }),
  resetLayout: () =>
    set({
      sidebarOpen: true,
      activePanel: "preview",
      viewMode: "desktop",
      previewZoom: 100,
    }),
}));

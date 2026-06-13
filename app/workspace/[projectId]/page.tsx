"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Sidebar } from "@/components/common/Sidebar";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { ChatRefinement } from "@/components/workspace/ChatRefinement";
import { PreviewToolbar } from "@/components/preview/PreviewToolbar";
import { LivePreview } from "@/components/preview/LivePreview";
import { CodeEditor } from "@/components/preview/CodeEditor";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useGenerationStore } from "@/lib/store/useGenerationStore";
import { apiFetch } from "@/lib/api/client";
import { mockApi } from "@/lib/api/mock";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ImproveUIResponse, ExportProjectResponse } from "@/types/api";
import { Project } from "@/types/project";
import { exportProject } from "@/lib/utils/exportProject";
import { AuthGuard } from "@/components/common/AuthGuard";

/**
 * Dynamic project workspace builder page.
 * Loads the active project details based on the projectId url slug parameter,
 * coordinates split Left/Right panel view states, and connects user refinement comments
 * directly with mock improvement endpoints to regenerate frontend elements.
 */
export default function ProjectWorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const projectId = typeof params?.projectId === "string" ? params.projectId : "";

  // Zustand Store integrations
  const activeProject = useProjectStore((state) => state.activeProject);
  const updateProject = useProjectStore((state) => state.updateProject);

  const activeGeneration = useGenerationStore((state) => state.activeGeneration);
  const history = useGenerationStore((state) => state.history);
  const startGeneration = useGenerationStore((state) => state.startGeneration);
  const completeGeneration = useGenerationStore((state) => state.completeGeneration);
  const failGeneration = useGenerationStore((state) => state.failGeneration);
  const resetGeneration = useGenerationStore((state) => state.reset);

  const fetchProjectById = useProjectStore((state) => state.fetchProjectById);

  // Layout View Tabs
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [loading, setLoading] = useState(false);

  // Restore workspace project state on mount
  useEffect(() => {
    const loadWorkspaceProject = async () => {
      if (!projectId) return;

      // Only load from API if not already active in the store
      if (!activeProject || activeProject.id !== projectId) {
        setLoading(true);
        try {
          const project = await fetchProjectById(projectId);

          // Populate initial history generation log if empty to prime the Chat Refinement log
          if (history.length === 0) {
            startGeneration(projectId, project.prompt);
            completeGeneration(project.generatedCode);
          }
        } catch (err) {
          console.error("Failed to restore workspace project:", err);
          router.push("/dashboard");
        } finally {
          setLoading(false);
        }
      }
    };
    loadWorkspaceProject();
  }, [projectId, activeProject, history.length, startGeneration, completeGeneration, router, fetchProjectById]);

  // Cleanup active generation on unmount
  useEffect(() => {
    return () => {
      resetGeneration();
    };
  }, [resetGeneration]);

  const handleSendRefinement = async (feedback: string) => {
    if (!projectId || !activeProject) return;

    // 1. Initialize loading log in state store
    startGeneration(projectId, feedback);

    try {
      const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";
      const startMs = Date.now();
      let code = "";

      if (useMock) {
        // Mock fallback
        const response = await mockApi.improveUI(projectId, feedback);
        code = response.code;
      } else {
        const response = await apiFetch<ImproveUIResponse>(API_ENDPOINTS.IMPROVE_UI, {
          method: "POST",
          body: JSON.stringify({ project_id: projectId, instruction: feedback }),
        });
        code = response.code;
      }

      const endMs = Date.now();

      // 3. Update Project Store with new source code
      updateProject(projectId, {
        generatedCode: code,
      });

      // 4. Update Generation store with success status and metrics
      completeGeneration(code, {
        promptTokens: 120,
        responseTokens: 980,
        latency: endMs - startMs,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to improve interface";
      failGeneration(errorMsg);
      alert(errorMsg);
    }
  };

  const handleRefresh = async () => {
    if (!activeProject) return;
    // Simple mock refresh trigger
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
  };

  const handleExportZip = async () => {
    if (!projectId || !activeProject) return;
    setLoading(true);
    try {
      const success = await exportProject.downloadAsZip(
        projectId,
        activeProject.generatedCode,
        activeProject.title
      );
      if (success) {
        console.log(`ZIP Export completed successfully for project: ${projectId}`);
      } else {
        alert("Failed to package and download Next.js project. Check browser storage.");
      }
    } catch (err) {
      alert("Failed to package codebase ZIP.");
    } finally {
      setLoading(false);
    }
  };

  // Renders a complete full-page loading skeleton
  if (loading && !activeProject) {
    return (
      <AuthGuard>
        <div className="flex flex-col min-h-screen bg-slate-50">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <LoadingSpinner size="lg" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                Loading Builder Workspace...
              </span>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  // Fallback view when no project matches
  if (!activeProject) {
    return (
      <AuthGuard>
        <div className="flex flex-col min-h-screen bg-slate-50">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <h3 className="font-extrabold text-slate-800 text-lg">Project Not Found</h3>
              <p className="text-slate-500 text-sm mt-1">Please select an existing project from your dashboard.</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const isGenerating = activeGeneration?.status === "generating";

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Global Navigation Header */}
      <Navbar />

      {/* Main split-screen panel layout wrapper */}
      <div className="flex flex-1">
        {/* Collapsible Sidebar */}
        <Sidebar />

        {/* Dynamic Two-Panel Layout wrapped in visual ErrorBoundary fallback */}
        <ErrorBoundary>
          <WorkspaceLayout
            leftPanel={
              <ChatRefinement
                history={history}
                onSendRefinement={handleSendRefinement}
                isLoading={isGenerating}
              />
            }
            rightPanel={
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Output Tab Selector & Breakpoint Actions Toolbar */}
                <PreviewToolbar
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  onRefresh={handleRefresh}
                  onExport={handleExportZip}
                  isLoading={isGenerating}
                />

                {/* Viewers display area */}
                <div className="flex-1 overflow-hidden relative h-full">
                  {activeTab === "preview" ? (
                    <LivePreview code={activeProject.generatedCode} isLoading={isGenerating} />
                  ) : (
                    <CodeEditor code={activeProject.generatedCode} />
                  )}
                </div>
              </div>
            }
          />
        </ErrorBoundary>
      </div>
    </div>
    </AuthGuard>
  );
}

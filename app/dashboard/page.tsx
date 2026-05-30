"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/common/Navbar";
import { Sidebar } from "@/components/common/Sidebar";
import { ProjectGrid } from "@/components/dashboard/ProjectGrid";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { mockApi } from "@/lib/api/mock";

/**
 * DashboardPage component rendering the central project list interface.
 * Implements the global Navbar/Sidebar shell, mounts a loading hook to fetch
 * user projects from mock API endpoints on mount, and conditionally renders grids or empty panels.
 */
export default function DashboardPage() {
  const router = useRouter();
  const projects = useProjectStore((state) => state.projects);
  const setProjects = useProjectStore((state) => state.setProjects);
  const isLoading = useProjectStore((state) => state.isLoading);
  const setLoading = useProjectStore((state) => state.setLoading);

  // Mount effect to fetch mock projects in Phase 1
  useEffect(() => {
    const fetchProjects = async () => {
      // Only load if current project list is empty to allow local deletions to persist during session
      if (projects.length === 0) {
        setLoading(true);
        try {
          const fetched = await mockApi.getProjects();
          setProjects(fetched);
        } catch (error) {
          console.error("Error loading mock projects:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProjects();
  }, [projects.length, setProjects, setLoading]);

  const handleCreateNew = () => {
    router.push("/workspace");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Global Navigation Header */}
      <Navbar />

      {/* Main Page Layout Wrapper */}
      <div className="flex flex-1">
        {/* Responsive Navigation Sidebar */}
        <Sidebar />

        {/* Inner Content Area */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-300">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                <span>Dashboard</span>
                <Sparkles className="w-5 h-5 text-indigo-500 fill-indigo-50" />
              </h1>
              <p className="text-slate-500 text-sm font-semibold">
                Welcome back. You have{" "}
                <span className="text-indigo-600 font-bold">{projects.length}</span> active{" "}
                {projects.length === 1 ? "project" : "projects"}.
              </p>
            </div>

            {/* Top Action Button */}
            {projects.length > 0 && (
              <Button
                onClick={handleCreateNew}
                className="self-start sm:self-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition duration-200 shadow-md shadow-indigo-100 flex items-center gap-2 active:scale-95 shrink-0"
              >
                <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
                <span>New Project</span>
              </Button>
            )}
          </div>

          {/* Conditional View Mapping */}
          {isLoading ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="text-center space-y-3">
                <LoadingSpinner size="lg" />
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest animate-pulse">
                  Restoring workspace list...
                </p>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="py-12">
              <EmptyState onAction={handleCreateNew} />
            </div>
          ) : (
            <div className="pb-12">
              <ProjectGrid />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

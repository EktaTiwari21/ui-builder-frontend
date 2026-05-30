"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProjectCard } from "./ProjectCard";
import { useProjectStore } from "@/lib/store/useProjectStore";

interface ProjectGridProps {
  /** Optional callback fired when a project is selected inside the grid */
  onSelectProject?: (projectId: string) => void;
}

/**
 * ProjectGrid component displaying the responsive grid of user project cards.
 * Maps project objects from the central Zustand store `useProjectStore`.
 */
export function ProjectGrid({ onSelectProject }: ProjectGridProps) {
  const router = useRouter();
  const projects = useProjectStore((state) => state.projects);
  const isLoading = useProjectStore((state) => state.isLoading);

  const handleSelect = (projectId: string) => {
    if (onSelectProject) {
      onSelectProject(projectId);
    } else {
      router.push(`/workspace/${projectId}`);
    }
  };

  if (isLoading && projects.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="border border-slate-200/80 rounded-2xl bg-white overflow-hidden flex flex-col h-[320px] shadow-sm select-none"
          >
            {/* Mockup skeleton */}
            <div className="h-44 bg-slate-100/70 flex items-center justify-center border-b border-slate-100 p-4">
              <div className="w-full h-full border border-slate-200/40 rounded-xl bg-white/60 flex flex-col overflow-hidden animate-pulse">
                <div className="h-6 bg-slate-50/50 border-b border-slate-100/40" />
                <div className="flex-1 p-2 flex flex-col gap-2">
                  <div className="w-1/3 h-2 bg-slate-100 rounded" />
                  <div className="w-full h-4 bg-slate-100 rounded" />
                  <div className="w-5/6 h-2 bg-slate-100 rounded" />
                </div>
              </div>
            </div>
            {/* Text details skeleton */}
            <div className="p-5 flex-1 flex flex-col gap-3.5 animate-pulse">
              <div className="space-y-2">
                <div className="w-2/3 h-4.5 bg-slate-100/85 rounded" />
                <div className="w-1/3 h-3 bg-slate-100/80 rounded" />
              </div>
              <div className="w-full h-10 bg-slate-50 border border-slate-100 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {projects.map((project) => (
        <div key={project.id} className="h-full">
          <ProjectCard project={project} onSelect={handleSelect} />
        </div>
      ))}
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, FolderOpen, Download, Trash2, Calendar, FileText } from "lucide-react";
import { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { exportProject } from "@/lib/utils/exportProject";

interface ProjectCardProps {
  /** The project object containing data to display */
  project: Project;
  /** Triggered when the card is selected to open in workspace */
  onSelect: (projectId: string) => void;
}

/**
 * ProjectCard component displaying card summaries of individual projects.
 * Features a high-fidelity visual preview, interactive 3-dot contextual menu,
 * and meta logs including prompt content and formatted creation dates.
 */
export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const router = useRouter();
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const setActiveProject = useProjectStore((state) => state.setActiveProject);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close context menu on external click clicks
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen]);

  /** Formats dynamic creation dates */
  const formattedDate = new Date(project.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleOpenWorkspace = () => {
    setActiveProject(project);
    onSelect(project.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteProject(project.id);
    setMenuOpen(false);
  };

  const handleExport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    try {
      const success = await exportProject.downloadAsZip(
        project.id,
        project.generatedCode,
        project.title
      );
      if (!success) {
        alert("Failed to package and download project ZIP.");
      }
    } catch (err) {
      alert("Failed to package codebase ZIP.");
    }
  };

  return (
    <div className="group relative border border-slate-200/80 rounded-2xl bg-white hover:shadow-lg hover:shadow-slate-100 hover:border-slate-300 transition-all duration-300 flex flex-col h-full">
      {/* 1. Visual Website Mockup Thumbnail (Gradient Layout) */}
      <div 
        onClick={handleOpenWorkspace}
        className="relative h-44 bg-gradient-to-br from-indigo-50/70 via-slate-50 to-indigo-100/50 flex items-center justify-center border-b border-slate-100 cursor-pointer overflow-hidden p-4 group"
      >
        {/* Elite Glassmorphic Interface Mockup representing actual code */}
        <div className="w-full h-full border border-slate-200/80 rounded-xl bg-white/90 shadow-sm backdrop-blur-sm flex flex-col overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
          {/* Header */}
          <div className="h-6 border-b border-slate-100 bg-slate-50/50 px-2 flex items-center justify-between">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            </div>
            <span className="text-[9px] font-bold text-slate-400 font-mono tracking-tight">localhost:3000</span>
            <div className="w-4" />
          </div>
          {/* Mock Content */}
          <div className="flex-1 p-2.5 flex flex-col gap-2">
            <div className="w-1/3 h-2 bg-indigo-100 rounded-sm" />
            <div className="flex gap-2 items-center flex-1">
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="w-full h-3 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-sm" />
                <div className="w-5/6 h-2 bg-slate-100 rounded-sm" />
                <div className="w-2/3 h-2 bg-slate-100 rounded-sm" />
              </div>
              <div className="w-10 h-10 rounded bg-slate-50 border border-slate-100 shrink-0 flex items-center justify-center text-slate-300 font-bold text-[10px]">
                🚀
              </div>
            </div>
            {/* CTA bar */}
            <div className="h-4 border-t border-slate-100 pt-1.5 flex items-center justify-between">
              <span className="w-10 h-1 bg-slate-200 rounded-sm" />
              <span className="w-4 h-1.5 bg-indigo-600 rounded-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Project Metadata */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1">
            <h3 
              onClick={handleOpenWorkspace}
              className="font-bold text-slate-900 text-sm hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
            >
              {project.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Custom Dropdown Container */}
          <div className="relative" ref={menuRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>

            {menuOpen && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                <button
                  onClick={handleOpenWorkspace}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-2"
                >
                  <FolderOpen className="w-4 h-4 text-slate-400" />
                  <span>Open Workspace</span>
                </button>
                <button
                  onClick={handleExport}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>Export Zip</span>
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50/50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span>Delete Project</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Prompt detail */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1 flex gap-1.5 items-start bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
          <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
          <span>{project.prompt}</span>
        </p>
      </div>
    </div>
  );
}

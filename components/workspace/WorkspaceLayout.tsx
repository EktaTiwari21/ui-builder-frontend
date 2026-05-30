"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface WorkspaceLayoutProps {
  /** The content of the left input panel (prompt inputs / chat log) */
  leftPanel: React.ReactNode;
  /** The content of the right output panel (live previews / source code viewers) */
  rightPanel: React.ReactNode;
  /** Optional styling class overrides */
  className?: string;
}

/**
 * WorkspaceLayout component providing a split-screen container for the builder interface.
 * Displays Left and Right panels side-by-side on desktop viewports and stacked vertically on mobile viewports.
 */
export function WorkspaceLayout({ leftPanel, rightPanel, className }: WorkspaceLayoutProps) {
  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row flex-1 w-full gap-6 p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-[calc(100vh-4rem)]",
        className
      )}
    >
      {/* 1. Left Panel (Input Controls / Refinement Thread) */}
      <div className="flex flex-col w-full lg:w-[26.5rem] xl:w-[29rem] shrink-0 h-[600px] lg:h-[calc(100vh-8rem)] min-h-[400px]">
        {leftPanel}
      </div>

      {/* 2. Right Panel (Live Preview Canvas / Syntax Editor) */}
      <div className="flex-1 flex flex-col h-[600px] lg:h-[calc(100vh-8rem)] min-h-[450px] overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-sm">
        {rightPanel}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Eye, Code, Smartphone, Tablet, Monitor, RotateCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/store/useUIStore";
import { cn } from "@/lib/utils";

interface PreviewToolbarProps {
  /** The active viewer tab ('preview' or 'code') */
  activeTab: "preview" | "code";
  /** Callback fired when the active tab is toggled */
  onTabChange: (tab: "preview" | "code") => void;
  /** Callback fired when the refresh button is clicked */
  onRefresh: () => void;
  /** Callback fired when the export ZIP button is clicked */
  onExport: () => void;
  /** Indicates if any code generation is active */
  isLoading?: boolean;
}

/**
 * PreviewToolbar component for adjusting canvas layouts.
 * Provides "Preview" and "Code" tab toggles, responsive breakpoint buttons
 * (Desktop, Tablet, Mobile) linked to useUIStore, and standard action buttons.
 */
export function PreviewToolbar({
  activeTab,
  onTabChange,
  onRefresh,
  onExport,
  isLoading,
}: PreviewToolbarProps) {
  const viewMode = useUIStore((state) => state.viewMode);
  const setViewMode = useUIStore((state) => state.setViewMode);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-b border-slate-200/80 bg-slate-50/50">
      {/* 1. Left View Tabs (Preview vs Code) */}
      <div className="inline-flex bg-slate-100/90 p-1 rounded-xl shadow-inner shrink-0">
        <button
          onClick={() => onTabChange("preview")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition duration-200",
            activeTab === "preview"
              ? "bg-white text-indigo-700 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          )}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>
        <button
          onClick={() => onTabChange("code")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition duration-200",
            activeTab === "code"
              ? "bg-white text-indigo-700 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          )}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Code</span>
        </button>
      </div>

      {/* 2. Middle Responsive Breakpoint Selectors (Only visible in Preview tab mode) */}
      {activeTab === "preview" ? (
        <div className="inline-flex items-center gap-1 bg-slate-100/90 p-0.5 rounded-xl border border-slate-200/40 shadow-inner">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode("mobile")}
            className={cn(
              "w-8 h-8 rounded-lg text-slate-500 transition-all",
              viewMode === "mobile" ? "bg-white text-indigo-600 shadow-sm hover:bg-white" : "hover:bg-slate-200/50"
            )}
            title="Mobile Viewport (375px)"
          >
            <Smartphone className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode("tablet")}
            className={cn(
              "w-8 h-8 rounded-lg text-slate-500 transition-all",
              viewMode === "tablet" ? "bg-white text-indigo-600 shadow-sm hover:bg-white" : "hover:bg-slate-200/50"
            )}
            title="Tablet Viewport (768px)"
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode("desktop")}
            className={cn(
              "w-8 h-8 rounded-lg text-slate-500 transition-all",
              viewMode === "desktop" ? "bg-white text-indigo-600 shadow-sm hover:bg-white" : "hover:bg-slate-200/50"
            )}
            title="Desktop Viewport (Full Width)"
          >
            <Monitor className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="hidden sm:block flex-1" />
      )}

      {/* 3. Right Action Tools (Refresh / Export) */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={isLoading}
          className="w-8 h-8 rounded-lg border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 active:scale-95 transition-transform"
          title="Refresh Preview"
        >
          <RotateCw className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={isLoading}
          className="h-8 rounded-lg border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:scale-95 transition-transform text-xs font-bold flex items-center gap-1.5 px-3"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Zip</span>
        </Button>
      </div>
    </div>
  );
}

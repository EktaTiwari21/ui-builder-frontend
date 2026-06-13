"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Settings, Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/store/useUIStore";
import { useProjectStore } from "@/lib/store/useProjectStore";

/**
 * Navbar component for the UI Builder application layout.
 * Displays logo on the left, mobile hamburger button, active project name in the center, and settings on the right.
 */
export function Navbar() {
  const router = useRouter();
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const activeProject = useProjectStore((state) => state.activeProject);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      // Trigger a storage event to clear state
      window.dispatchEvent(new Event("storage"));
      window.location.href = "/login";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 flex items-center justify-between px-4 sm:px-6 shadow-sm shadow-slate-100/40">
      {/* Left Area: Hamburger + Logo */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden text-slate-500 hover:text-slate-900 focus-visible:ring-1 focus-visible:ring-slate-400"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100/50 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-4 h-4 fill-white/10" />
          </div>
          <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight hidden sm:inline-block">
            UI Builder
          </span>
        </Link>
      </div>

      {/* Center Area: Dynamic Project Name Pill */}
      <div className="flex-1 max-w-md mx-4 flex justify-center">
        {activeProject ? (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full shadow-sm text-xs font-semibold text-indigo-700 max-w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="truncate max-w-[180px] sm:max-w-[280px]">
              Active: {activeProject.title}
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200/60 rounded-full text-xs font-semibold text-slate-500">
            <span>Autonomous Workspace</span>
          </div>
        )}
      </div>

      {/* Right Area: Settings & Log Out */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
          aria-label="Application Settings"
          asChild
        >
          <Link href="/settings">
            <Settings className="w-5 h-5" />
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Log Out"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}

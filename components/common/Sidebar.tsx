"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/store/useUIStore";

/**
 * Sidebar navigation link interface definition.
 */
interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAVIGATION_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "New Project",
    href: "/workspace",
    icon: PlusCircle,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

/**
 * Sidebar navigation component for the UI Builder layout.
 * Supports sliding overlays on mobile viewports and collapsible layouts on desktops.
 */
export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <>
      {/* 1. Mobile Backdrop Blur Overlay */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden transition-all duration-300"
        />
      )}

      {/* 2. Primary Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200/80 transition-all duration-300 ease-in-out lg:sticky lg:z-30 lg:h-[calc(100vh-4rem)]",
          // Mobile Widths & Transitions
          sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64 lg:translate-x-0 lg:w-[4.5rem]"
        )}
      >
        {/* Header (Only on Mobile/Tablet Drawer view for visual closing) */}
        <div className="flex h-16 items-center justify-between px-4 lg:hidden border-b border-slate-100">
          <span className="font-extrabold text-slate-800 text-sm tracking-tight">Navigation Menu</span>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-slate-500">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link key={item.label} href={item.href} passHref legacyBehavior>
                <a
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-3 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer group relative",
                    isActive
                      ? "bg-indigo-50 text-indigo-700 font-bold"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105",
                      isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-700"
                    )}
                  />
                  <span
                    className={cn(
                      "transition-opacity duration-200 truncate",
                      sidebarOpen ? "opacity-100" : "lg:opacity-0 lg:w-0"
                    )}
                  >
                    {item.label}
                  </span>

                  {/* Desktop Tooltip when collapsed */}
                  {!sidebarOpen && (
                    <span className="absolute left-14 hidden lg:group-hover:inline-block z-50 px-2 py-1 bg-slate-950 text-white text-xs font-bold rounded-md whitespace-nowrap shadow shadow-slate-900/20">
                      {item.label}
                    </span>
                  )}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Collapsible Action Footer (Only visible on Desktop screen sizes) */}
        <div className="hidden lg:flex items-center justify-end p-4 border-t border-slate-100">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-slate-400 hover:text-slate-950 hover:bg-slate-50 rounded-xl"
            aria-label={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </Button>
        </div>
      </aside>
    </>
  );
}

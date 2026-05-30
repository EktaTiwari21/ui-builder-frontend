"use client";

import React from "react";
import { Plus, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  /** Callback action fired when the CTA create button is clicked */
  onAction: () => void;
}

/**
 * EmptyState component displayed when the project store holds no items.
 * Includes a premium vector layout frame, supportive text logs, and CTA create prompts.
 */
export function EmptyState({ onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed border-slate-200/90 rounded-3xl bg-white text-center shadow-sm max-w-lg mx-auto">
      {/* Visual Icon Mockup */}
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner mb-6 relative">
        <Layout className="w-8 h-8 stroke-[1.5]" />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-emerald-200 border-2 border-white">
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      </div>

      {/* Text Logs */}
      <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight">
        No Frontend Projects Yet
      </h3>
      <p className="text-slate-500 text-sm max-w-sm mt-2.5 mb-6 leading-relaxed">
        Describe your application idea in natural language and let our AI agents plan and generate a production-ready React + Tailwind interface instantly.
      </p>

      {/* Interactive Action Button */}
      <Button
        onClick={onAction}
        className="px-6 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition duration-200 shadow-md shadow-indigo-100 flex items-center gap-2 active:scale-95"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Create Your First UI</span>
      </Button>
    </div>
  );
}

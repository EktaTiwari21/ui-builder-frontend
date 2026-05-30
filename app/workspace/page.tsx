"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, MessageSquare, Play, HelpCircle } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Sidebar } from "@/components/common/Sidebar";
import { PromptInput } from "@/components/workspace/PromptInput";
import { useGenerationStore } from "@/lib/store/useGenerationStore";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { GenerateUIResponse } from "@/types/api";

/**
 * New Project Workspace page route component.
 * Displays a landing-style prompt editor where the user can submit initial app requirements.
 * Initiates the AI generation loop via the Phase 1 mock client and redirects to `/workspace/[projectId]`.
 */
export default function NewWorkspacePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Zustand Store mappings
  const startGeneration = useGenerationStore((state) => state.startGeneration);
  const completeGeneration = useGenerationStore((state) => state.completeGeneration);
  const failGeneration = useGenerationStore((state) => state.failGeneration);

  const addProject = useProjectStore((state) => state.addProject);
  const setActiveProject = useProjectStore((state) => state.setActiveProject);

  const handleGenerate = async (prompt: string) => {
    setLoading(true);
    // 1. Initialize active generation logs in the store
    const mockTempId = `proj-gen-${Date.now().toString().slice(-6)}`;
    startGeneration(mockTempId, prompt);

    try {
      // 2. Fetch from intercepted Phase-1 mock API
      const startMs = Date.now();
      const response = await apiClient.post<GenerateUIResponse>(API_ENDPOINTS.GENERATE, {
        prompt,
      });
      const endMs = Date.now();

      // 3. Update Project Store
      addProject(response.project);
      setActiveProject(response.project);

      // 4. Update Generation store with success status and metrics
      completeGeneration(response.code, {
        promptTokens: 240,
        responseTokens: 1420,
        latency: endMs - startMs,
      });

      // 5. Automatically route user to dynamic workspace builder
      router.push(`/workspace/${response.projectId}`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to generate interface";
      failGeneration(errorMsg);
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <Navbar />

      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Workspace Landing Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 max-w-4xl mx-auto w-full space-y-8 animate-in fade-in duration-300">
          {/* Headline */}
          <div className="text-center space-y-3 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 fill-indigo-100 animate-pulse" />
              <span>Phase 1 Frontend MVP active</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              What are we designing <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">today?</span>
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Input your application specifications. Our multi-agent planner will layout the UI components and build dynamic React + Tailwind frontends in seconds.
            </p>
          </div>

          {/* Large Prompt Input Box */}
          <div className="w-full max-w-2xl bg-white border border-slate-200/80 rounded-3xl p-5 shadow-lg shadow-slate-100/60 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-50 rounded-full blur-2xl opacity-50" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-violet-50 rounded-full blur-2xl opacity-50" />

            <PromptInput onSubmit={handleGenerate} isLoading={loading} />
          </div>

          {/* Feature Tips Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl pt-4">
            <div className="p-4 bg-white border border-slate-150 rounded-2xl flex flex-col gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">1</div>
              <h4 className="font-bold text-slate-800 text-xs">Write Clear Intent</h4>
              <p className="text-[10px] text-slate-400 leading-normal">Describe components, header details, interactive sections, and user goals.</p>
            </div>
            <div className="p-4 bg-white border border-slate-150 rounded-2xl flex flex-col gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">2</div>
              <h4 className="font-bold text-slate-800 text-xs">Plan Component Trees</h4>
              <p className="text-[10px] text-slate-400 leading-normal">AI will plan hierarchical page components before generating production code.</p>
            </div>
            <div className="p-4 bg-white border border-slate-150 rounded-2xl flex flex-col gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-xs">3</div>
              <h4 className="font-bold text-slate-800 text-xs">Iterative Refinement</h4>
              <p className="text-[10px] text-slate-400 leading-normal">Suggest theme alterations, add elements, or edit components using chat.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

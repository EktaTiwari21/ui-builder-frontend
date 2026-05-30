"use client";

import React, { useRef, useEffect } from "react";
import { Send, Sparkles, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PromptInput } from "./PromptInput";
import { Generation } from "@/types/project";

interface ChatRefinementProps {
  /** The collection of generations (prompt and code results) in the active project session */
  history: Generation[];
  /** Callback fired when a follow-up refinement prompt is submitted */
  onSendRefinement: (feedback: string) => void;
  /** Tracks if a refinement code regeneration operation is currently active */
  isLoading: boolean;
}

/**
 * ChatRefinement component for iterative AI design refinement.
 * Displays a scrollable chat stream of prompt histories and AI status replies,
 * with a compact refinement textarea input at the bottom.
 */
export function ChatRefinement({ history, onSendRefinement, isLoading }: ChatRefinementProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new chat logs appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history.length, isLoading]);

  return (
    <div className="flex flex-col h-full bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
      {/* 1. Scrollable Chat Body */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 min-h-[300px]"
      >
        {history.length === 0 ? (
          /* Welcoming System Card */
          <div className="p-5 border border-slate-200 bg-white rounded-2xl space-y-3 shadow-inner text-center max-w-sm mx-auto mt-12 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Design Helper Active</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Input a design instruction in the prompt box below. I will plan out your frontend elements and generate interactive React code instantly.
            </p>
          </div>
        ) : (
          history.map((gen) => (
            <div key={gen.id} className="space-y-3">
              {/* User Prompt Message Card */}
              <div className="flex justify-end animate-in slide-in-from-right-3 duration-200">
                <div className="flex gap-2.5 items-start max-w-[85%]">
                  <div className="bg-indigo-600 text-white text-xs font-semibold px-4 py-3 rounded-2xl rounded-tr-none shadow-sm leading-relaxed">
                    {gen.prompt}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* AI Agent Status Response Card */}
              <div className="flex justify-start animate-in slide-in-from-left-3 duration-200">
                <div className="flex gap-2.5 items-start max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                    ⚡
                  </div>
                  <div className="bg-white border border-slate-200/80 px-4 py-3.5 rounded-2xl rounded-tl-none shadow-sm space-y-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-xs">Novastack.ai</span>
                      <span className="text-[9px] font-extrabold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">Agent</span>
                    </div>

                    {gen.status === "generating" && (
                      <div className="flex items-center gap-2 py-1 text-xs text-indigo-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
                        <span>Planning layouts & generating Tailwind UI...</span>
                      </div>
                    )}

                    {gen.status === "success" && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        ✓ I have generated a gorgeous, responsive interface matching your instruction. You can view the code and play with the live preview on the right.
                      </p>
                    )}

                    {gen.status === "error" && (
                      <div className="flex items-start gap-1.5 text-red-600 text-xs font-semibold bg-red-50 p-2.5 rounded-xl border border-red-100">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>Failed to generate: {gen.error || "Unknown compilation error"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loading status card */}
        {isLoading && (
          <div className="flex justify-start animate-in slide-in-from-left-3 duration-200">
            <div className="flex gap-2.5 items-start max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0 shadow-md animate-pulse">
                ⚡
              </div>
              <div className="bg-white border border-slate-200/80 px-4 py-3.5 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-xs">Novastack.ai</span>
                  <span className="text-[9px] font-extrabold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">Agent</span>
                </div>
                <div className="flex items-center gap-2 py-1.5 text-xs text-indigo-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
                  <span>Iterating on refinements...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Refinement Input Panel */}
      {history.length > 0 && (
        <div className="p-3 bg-white border-t border-slate-200/80">
          <PromptInput
            onSubmit={onSendRefinement}
            isLoading={isLoading}
            placeholder="Type follow-up instructions to refine your generated UI... (e.g. Add a light green callout banner or change the font weight to bold.)"
          />
        </div>
      )}
    </div>
  );
}

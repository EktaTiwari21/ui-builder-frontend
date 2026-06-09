"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PromptInputProps {
  /** Callback fired when a prompt is successfully submitted */
  onSubmit: (prompt: string) => void;
  /** Tracks if a generation operation is currently active */
  isLoading: boolean;
  /** Optional placeholder text overrides */
  placeholder?: string;
}

/**
 * PromptInput component for natural language design instructions.
 * Incorporates high-fidelity textareas, character limit validation, and active loading buttons.
 * Displays real-time SSE stream status events ("Planning...", "Generating...", "Done!").
 */
export function PromptInput({ onSubmit, isLoading, placeholder }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [statusMessage, setStatusMessage] = useState("Generating...");
  const maxLength = 500;

  useEffect(() => {
    if (!isLoading) {
      setStatusMessage("Generating...");
      return;
    }

    const handlePlan = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setStatusMessage(customEvent.detail || "Planning your UI...");
    };

    const handleChunk = () => {
      setStatusMessage("Generating components...");
    };

    const handleDone = () => {
      setStatusMessage("Done!");
    };

    const handleError = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setStatusMessage(`Error: ${customEvent.detail}`);
    };

    window.addEventListener("generation-plan", handlePlan);
    window.addEventListener("generation-chunk", handleChunk);
    window.addEventListener("generation-done", handleDone);
    window.addEventListener("generation-error", handleError);

    return () => {
      window.removeEventListener("generation-plan", handlePlan);
      window.removeEventListener("generation-chunk", handleChunk);
      window.removeEventListener("generation-done", handleDone);
      window.removeEventListener("generation-error", handleError);
    };
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSubmit(prompt.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className="relative">
        <textarea
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder={
            placeholder ??
            "Describe your application idea... (e.g. A gorgeous modern landing page for a coffee delivery service with cards, pricing, and reviews.)"
          }
          className="w-full resize-none bg-transparent outline-none text-sm text-slate-800 placeholder-slate-400 leading-relaxed border-0 focus:ring-0 p-1 disabled:opacity-60"
        />
      </div>

      {/* Character Limit and Submit Bar */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-[10px] sm:text-xs text-slate-400 font-medium select-none">
          Press <kbd className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[9px] font-sans font-bold">Ctrl + Enter</kbd> to submit • {prompt.length}/{maxLength}
        </span>

        <Button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold rounded-xl transition duration-200 flex items-center gap-1.5 active:scale-95 shadow-sm min-w-[140px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span className="truncate max-w-[120px]">{statusMessage}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-white/10 shrink-0" />
              <span>Generate UI</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

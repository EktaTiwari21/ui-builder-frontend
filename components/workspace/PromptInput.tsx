"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGenerationStore } from "@/lib/store/useGenerationStore";

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
 * Displays real-time SSE stream status events ("Planning your UI...", "Generating...", "Complete!").
 */
export function PromptInput({ onSubmit, isLoading, placeholder }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const streamStatus = useGenerationStore((state) => state.streamStatus);
  const [statusMessage, setStatusMessage] = useState("Planning your UI...");
  const maxLength = 500;

  useEffect(() => {
    if (!isLoading) {
      setStatusMessage("Planning your UI...");
      return;
    }

    if (streamStatus === "Generating...") {
      setStatusMessage("Generating...");
    } else if (streamStatus === "Complete!") {
      setStatusMessage("Complete!");
    } else if (streamStatus === "Error") {
      setStatusMessage("Error");
    } else if (streamStatus) {
      // If there is any plan description or custom state, show it
      if (streamStatus.length > 25) {
        setStatusMessage("Planning your UI...");
      } else {
        setStatusMessage(streamStatus);
      }
    } else {
      setStatusMessage("Planning your UI...");
    }
  }, [isLoading, streamStatus]);

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
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold rounded-xl transition duration-200 flex items-center gap-1.5 active:scale-95 shadow-sm min-w-[150px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span className="truncate max-w-[125px]">{statusMessage}</span>
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

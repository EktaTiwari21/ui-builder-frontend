"use client";

import React, { useState } from "react";
import { Copy, Check, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeEditorProps {
  /** The generated code string to display in the code viewer */
  code: string | null;
}

/**
 * CodeEditor component for displaying AI-designed frontend sources.
 * Presents syntax-styled read-only code views, line numbers, and copy action buttons.
 */
export function CodeEditor({ code }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy source code:", err);
    }
  };

  // Convert code lines into indexed arrays for numbered rows
  const codeLines = code ? code.trim().split("\n") : [];

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 font-mono h-full overflow-hidden min-h-[300px]">
      {/* 1. Editor Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/70 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-300">page.tsx</span>
          <span className="text-[10px] text-slate-500 font-bold bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
            React + Tailwind
          </span>
        </div>

        {code && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 px-2.5 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-bold active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Code</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* 2. Code Viewer Body with Line Counts */}
      <div className="flex-1 overflow-auto p-4 flex gap-4 text-xs sm:text-sm leading-relaxed scrollbar-thin">
        {code ? (
          <>
            {/* Line numbers column */}
            <div className="text-slate-600 text-right select-none pr-3 border-r border-slate-800 flex flex-col font-mono text-xs">
              {codeLines.map((_, index) => (
                <span key={index} className="h-5">
                  {index + 1}
                </span>
              ))}
            </div>

            {/* Source code column */}
            <pre className="flex-1 overflow-x-auto text-slate-300 font-mono text-xs flex flex-col pb-4">
              {codeLines.map((line, index) => (
                <code key={index} className="h-5 block whitespace-pre">
                  {line || " "}
                </code>
              ))}
            </pre>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-3">
            <p className="text-xs text-slate-500">No source code compiled yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  /** The children nodes wrapped inside the boundary */
  children: ReactNode;
}

interface State {
  /** Indicates if a runtime crash occurred */
  hasError: boolean;
  /** Stores the active error logs details */
  error: Error | null;
}

/**
 * ErrorBoundary class component to catch layout crashes and present visual logs.
 * Styled purely using light theme tailwind features to provide graceful fallbacks.
 */
export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught workspace canvas crash:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 min-h-[400px]">
          <div className="w-full max-w-md border-2 border-dashed border-red-200 bg-white rounded-3xl p-6 shadow-lg shadow-slate-100/60 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <AlertCircle className="w-6 h-6 stroke-[1.5]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-extrabold text-slate-900 text-base">Workspace Render Crash</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                An unexpected runtime error occurred inside the workspace layout. You can reset the canvas state to try again.
              </p>
            </div>

            {this.state.error && (
              <pre className="text-[10px] text-red-600 font-mono bg-red-50/50 p-3 rounded-xl border border-red-100/60 text-left overflow-auto max-h-[150px]">
                {this.state.error.message}
              </pre>
            )}

            <Button
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 mx-auto active:scale-95 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Canvas Layout</span>
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;

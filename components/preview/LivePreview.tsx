"use client";

import React, { useMemo } from "react";
import { Monitor, Loader2, PlayCircle } from "lucide-react";
import { useUIStore } from "@/lib/store/useUIStore";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { cn } from "@/lib/utils";

interface LivePreviewProps {
  /** The React/Tailwind code string to execute inside the sandbox */
  code: string | null;
  /** Tracks if a generation operation is currently active */
  isLoading: boolean;
}

/**
 * LivePreview component that compiles and executes React + Tailwind code strings.
 * Renders the interface in a sandboxed iframe with responsive width limits mapping to useUIStore.
 */
export function LivePreview({ code, isLoading }: LivePreviewProps) {
  const viewMode = useUIStore((state) => state.viewMode);

  // Compile full iframe srcDoc document containing CDNs and Babel sandbox on the fly
  const iframeSrcDoc = useMemo(() => {
    if (!code) return "";

    // 1. Sanitize import statements so Babel executes ESM modules in a standard browser script tag
    let cleanedCode = code
      .replace(/import\s+React[^{]*from\s+['"]react['"];?/g, "")
      .replace(/import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]react['"];?/g, "const { $1 } = React;")
      .replace(/import\s+.*from\s+['"][^'"]+['"];?/g, "") // strip other import modules
      .replace(/export\s+default\s+function/g, "function") // simplify export default
      .replace(/export\s+function/g, "function"); // simplify named exports

    // 2. Extract first defined React Component name to mount
    const componentMatch = cleanedCode.match(/function\s+([A-Z][a-zA-Z0-9]*)/);
    const componentName = componentMatch ? componentMatch[1] : "GeneratedLandingHero";

    // 3. Assemble complete self-contained HTML page
    return `<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Novastack Sandbox Preview</title>
  <!-- Tailwind CSS Play CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <!-- React 18 CDN (Babel Standalone works cleanly with v18) -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <!-- Babel Standalone compiler -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    /* Hide scrollbars but permit scrolling */
    ::-webkit-scrollbar { display: none; }
    body { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="min-h-full bg-slate-50 text-slate-900 flex flex-col font-sans">
  <div id="root" class="flex flex-col flex-1"></div>
  <script type="text/babel">
    try {
      ${cleanedCode}

      // Mount the generated component into standard div root
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(${componentName}));
    } catch (err) {
      document.getElementById('root').innerHTML = \`
        <div class="p-6 m-4 border-2 border-dashed border-red-200 bg-red-50 rounded-2xl text-center">
          <h3 class="text-red-800 font-bold text-sm">Preview Sandbox Error</h3>
          <p class="text-red-600 text-xs mt-2 font-mono text-left bg-white p-3 border border-red-100 rounded-lg overflow-auto max-h-[250px]">\${err.message}</p>
        </div>
      \`;
    }
  </script>
</body>
</html>`;
  }, [code]);

  // Width classes matching active layout responsive state
  const widthClasses = {
    mobile: "max-w-[375px] shadow-lg shadow-slate-200 border-x border-slate-200",
    tablet: "max-w-[768px] shadow-md shadow-slate-100 border-x border-slate-200",
    desktop: "max-w-full",
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 relative overflow-hidden h-full min-h-[300px]">
      {/* 1. Active Generation Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
          <LoadingSpinner size="lg" />
          <div className="text-center space-y-1">
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest animate-pulse">
              Compiling React DOM...
            </span>
            <p className="text-[10px] text-slate-400 font-medium">Babel Sandbox compiling component node tree</p>
          </div>
        </div>
      )}

      {/* 2. Content View Conditionals */}
      {code ? (
        <div
          className={cn(
            "w-full h-full flex flex-col items-center justify-center p-4 transition-all duration-300",
            activeClass(viewMode)
          )}
        >
          <iframe
            srcDoc={iframeSrcDoc}
            sandbox="allow-scripts allow-modals"
            className={cn(
              "w-full flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm transition-all duration-300 ease-in-out",
              widthClasses[viewMode]
            )}
          />
        </div>
      ) : (
        /* Empty Sandbox Panel */
        <div className="p-8 text-center max-w-sm flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <PlayCircle className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-800 text-sm">Empty Preview Screen</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Describe your idea in the prompt textarea on the left to start compiling components and visual interfaces.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/** Utility to compute viewport margins */
function activeClass(mode: "desktop" | "tablet" | "mobile"): string {
  if (mode === "desktop") return "p-0";
  return "p-4 sm:p-6";
}

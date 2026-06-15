"use client";

import React, { useMemo } from "react";
import { PlayCircle } from "lucide-react";
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
 * Streams generated code chunks in real-time without locking workspace view during stream phase.
 */
export function LivePreview({ code, isLoading }: LivePreviewProps) {
  const viewMode = useUIStore((state) => state.viewMode);

  // Compile full iframe srcDoc document containing CDNs and Babel sandbox on the fly
  const iframeSrcDoc = useMemo(() => {
    if (!code) return "";

    // 1. Extract lucide-react imports before stripping, so we can re-inject them
    const lucideImportMatch = code.match(
      /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]lucide-react['"];?/
    );
    const lucideIcons = lucideImportMatch
      ? lucideImportMatch[1].replace(/\s+/g, " ").trim()
      : "";

    // 2. Sanitize import statements for Babel inline script execution
    let cleanedCode = code
      .replace(/import\s+React[^{]*from\s+['"]react['"];?/g, "")
      .replace(/import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]react['"];?/g, "const { $1 } = React;")
      .replace(/import\s+.*from\s+['"][^'"]+['"];?/g, "") // strip remaining imports
      .replace(/export\s+default\s+function/g, "function")
      .replace(/export\s+default\s+/g, "const __DefaultExport = ")
      .replace(/export\s+function/g, "function")
      .replace(/export\s+const/g, "const");

    // Prepend lucide icon destructure if icons were used
    if (lucideIcons) {
      cleanedCode = `const { ${lucideIcons} } = LucideReact;\n` + cleanedCode;
    }

    // 3. Find the best root component to mount:
    //    Priority: explicit default export variable → name containing Page/App/Landing/Home/Section
    //    Fallback: last defined uppercase function
    const allFunctions = [...cleanedCode.matchAll(/function\s+([A-Z][a-zA-Z0-9]*)/g)].map(
      (m) => m[1]
    );
    const defaultExportMatch = cleanedCode.match(/const\s+__DefaultExport\s*=/);
    let componentName = "GeneratedComponent";
    if (defaultExportMatch) {
      componentName = "__DefaultExport";
    } else if (allFunctions.length > 0) {
      // Prefer a component with a root-like name
      const rootNames = ["App", "Page", "Landing", "Home", "Main", "Layout", "Root"];
      const rootComponent = allFunctions.find((name) =>
        rootNames.some((r) => name.includes(r))
      );
      // Otherwise pick the last component (parent wraps children, so last = outermost)
      componentName = rootComponent || allFunctions[allFunctions.length - 1];
    }

    // 4. Assemble complete self-contained HTML page
    return `<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Novastack Sandbox Preview</title>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Nunito:wght@400;600;700;800&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  <!-- Tailwind CSS Play CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            nunito: ['Nunito', 'sans-serif'],
            poppins: ['Poppins', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <!-- React 18 -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <!-- lucide-react icons (makes all icons available as LucideReact.*) -->
  <script src="https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.js" crossorigin></script>
  <!-- Babel Standalone compiler -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    ::-webkit-scrollbar { display: none; }
    body { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="min-h-full bg-white text-slate-900 flex flex-col font-sans">
  <div id="root" class="flex flex-col flex-1"></div>
  <script type="text/babel">
    // Make lucide icons available in scope
    const LucideReact = window.LucideReact || {};
    try {
      ${cleanedCode}

      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(${componentName}));
    } catch (err) {
      console.error('LivePreview error:', err);
      document.getElementById('root').innerHTML = \`
        <div style="padding:24px;margin:16px;border:2px dashed #fca5a5;background:#fef2f2;border-radius:12px;font-family:monospace">
          <h3 style="color:#991b1b;font-weight:bold;margin:0 0 8px">Preview Error</h3>
          <pre style="color:#b91c1c;font-size:11px;white-space:pre-wrap;margin:0">\${err.message}</pre>
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

  // Check if we are currently loading without code (initial plan phase)
  const showLoadingOverlay = isLoading && !code;

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 relative overflow-hidden h-full min-h-[300px]">
      {/* 1. Active Generation Loading Overlay (only shown before code stream begins) */}
      {showLoadingOverlay && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3 animate-in fade-in duration-200">
          <LoadingSpinner size="lg" />
          <div className="text-center space-y-1">
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest animate-pulse">
              Planning Layouts...
            </span>
            <p className="text-[10px] text-slate-400 font-medium">Babel Sandbox preparing compilation layer</p>
          </div>
        </div>
      )}

      {/* 2. Content View Conditionals */}
      {code ? (
        <div
          className={cn(
            "w-full h-full flex flex-col items-center justify-center transition-all duration-300",
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
        <div className="p-8 text-center max-w-sm flex flex-col items-center gap-4 animate-in fade-in duration-300">
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

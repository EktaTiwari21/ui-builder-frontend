import { Project, Generation } from "@/types/project";
import { GenerateUIResponse, ImproveUIResponse, ExportProjectResponse } from "@/types/api";

// A breathtaking high-fidelity React + Tailwind CSS code string simulating elite AI generated code.
const PREMIUM_HERO_JSX = `import React, { useState } from "react";

export default function GeneratedLandingHero() {
  const [clickedCount, setClickedCount] = useState(0);
  const [activePlan, setActivePlan] = useState("monthly");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-emerald-50 text-slate-900 font-sans antialiased">
      {/* Premium Glassmorphic Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200/50">
              ⚡
            </div>
            <span className="font-extrabold text-lg bg-gradient-to-r from-indigo-600 to-slate-950 bg-clip-text text-transparent tracking-tight">
              Novastack.ai
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
            <a href="#about" className="hover:text-indigo-600 transition-colors">Case Studies</a>
          </div>
          <button 
            onClick={() => setClickedCount(c => c + 1)}
            className="relative px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition shadow-md shadow-slate-900/10 hover:shadow-lg active:scale-95 duration-200"
          >
            Get Started {clickedCount > 0 && <span className="ml-1 px-1.5 py-0.5 text-xs bg-emerald-500 rounded-full">{clickedCount}</span>}
          </button>
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center sm:text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-8">
            {/* Tag/Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-bold shadow-sm tracking-wide">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Next-Gen AI Code Generator
            </div>

            {/* Breathtaking Headline */}
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.1]">
              Generate premium,{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
                production-ready
              </span>{" "}
              frontends instantly.
            </h1>

            {/* Sub-headline */}
            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              Transform natural language prompts into stunning React components built with Tailwind CSS, pre-configured with micro-animations and responsive accessibility out of the box.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center sm:justify-start">
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-2xl transition shadow-lg shadow-indigo-600/20 active:scale-95 duration-200">
                Start Building Now
              </button>
              <button className="px-8 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-2xl transition shadow-sm active:scale-95 duration-200">
                Schedule Demo
              </button>
            </div>

            {/* Client logos */}
            <div className="pt-8 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trusted by builders at</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8 opacity-45">
                <span className="font-extrabold text-slate-600 text-sm tracking-wider">▲ VERCEL</span>
                <span className="font-extrabold text-slate-600 text-sm tracking-wider">✦ RETOOL</span>
                <span className="font-extrabold text-slate-600 text-sm tracking-wider">❖ FIGMA</span>
                <span className="font-extrabold text-slate-600 text-sm tracking-wider">■ WEBFLOW</span>
              </div>
            </div>
          </div>

          {/* Interactive Feature Cards Panel */}
          <div className="lg:col-span-5 relative">
            {/* Decorative Background Blob */}
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-200 rounded-full blur-3xl opacity-30 -z-10"></div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-emerald-200 rounded-full blur-3xl opacity-30 -z-10"></div>

            <div className="border border-slate-200/80 rounded-3xl bg-white/80 p-8 shadow-xl shadow-slate-100/50 backdrop-blur-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="font-bold text-slate-800 text-base">Workspace Pricing</span>
                <div className="inline-flex bg-slate-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setActivePlan("monthly")}
                    className={\`px-3 py-1.5 text-xs font-bold rounded-lg transition \${activePlan === "monthly" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}\`}
                  >
                    Monthly
                  </button>
                  <button 
                    onClick={() => setActivePlan("annual")}
                    className={\`px-3 py-1.5 text-xs font-bold rounded-lg transition \${activePlan === "annual" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}\`}
                  >
                    Annual
                  </button>
                </div>
              </div>

              {/* Price Display */}
              <div className="py-2 text-center">
                <span className="text-4xl font-extrabold text-slate-950">
                  {activePlan === "monthly" ? "$29" : "$19"}
                </span>
                <span className="text-slate-500 text-sm font-semibold ml-1">/ user / mo</span>
                {activePlan === "annual" && (
                  <div className="text-xs font-bold text-emerald-600 mt-1">Billed annually (save 35%)</div>
                )}
              </div>

              {/* Feature Bullet Points */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold">✓</div>
                  <span className="text-slate-600 text-sm">Unlimited React component generations</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold">✓</div>
                  <span className="text-slate-600 text-sm">Pre-styled accessible Tailwind elements</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold">✓</div>
                  <span className="text-slate-600 text-sm">Clean architectural Planning with Gemini</span>
                </div>
              </div>

              {/* Purchase Button */}
              <button className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl transition shadow-lg shadow-indigo-600/10 active:scale-95 duration-200">
                Get Started Premium
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
`;

// Three beautifully pre-built mock projects representing real use cases.
const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-saas-analytics",
    userId: "user-default-mvp",
    title: "SaaS Analytics Dashboard",
    prompt: "Create a modern light-themed analytics dashboard with weekly sales charts, performance cards, active user tracking, and an interactive sidebar.",
    generatedCode: PREMIUM_HERO_JSX,
    previewUrl: "https://mock-renderer.ui-builder.internal/saas-analytics",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "proj-ecommerce-store",
    userId: "user-default-mvp",
    title: "E-Commerce Product Landing Page",
    prompt: "Generate an e-commerce single product storefront for minimal desktop speakers, including size selection, dynamic pricing, photo thumbnails, and reviews.",
    generatedCode: PREMIUM_HERO_JSX,
    previewUrl: "https://mock-renderer.ui-builder.internal/ecommerce-store",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "proj-copywriting-platform",
    userId: "user-default-mvp",
    title: "AI Writing Assistant Landing",
    prompt: "Design a futuristic marketing landing page for an AI copywriting tool. Use clean layout grid, pricing slider, and floating glass cards.",
    generatedCode: PREMIUM_HERO_JSX,
    previewUrl: "https://mock-renderer.ui-builder.internal/copywriting-platform",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * High-fidelity Mock API implementation for Phase 1.
 * Simulates latency and returns realistic structural models for UI generations,
 * project collections, detail lookups, and code exports.
 */
export const mockApi = {
  /**
   * Generates a new React and Tailwind UI component from a user prompt input.
   * @param prompt The natural language description input
   * @param themeConfig Optional user styling guidelines (primary color, typeface)
   * @returns A promise resolving to a detailed GenerateUIResponse object
   */
  generateUI: async (
    prompt: string,
    themeConfig?: { primaryColor?: string; fontFamily?: string }
  ): Promise<GenerateUIResponse> => {
    // Mimic real network latency
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const projectId = `proj-gen-${Date.now().toString().slice(-6)}`;
    const mockProject: Project = {
      id: projectId,
      userId: "user-default-mvp",
      title: prompt.slice(0, 30) || "Generated Interface",
      prompt,
      generatedCode: PREMIUM_HERO_JSX.replace(
        "Novastack.ai",
        themeConfig?.fontFamily ? `AI Builder (${themeConfig.fontFamily})` : "AI Builder Custom"
      ),
      previewUrl: `https://mock-renderer.ui-builder.internal/${projectId}`,
      createdAt: new Date().toISOString(),
    };

    return {
      projectId,
      project: mockProject,
      code: mockProject.generatedCode,
    };
  },

  /**
   * Refines or improves an existing project's source code based on feedback.
   * @param projectId The unique project ID reference
   * @param feedback The improvement suggestions
   * @returns A promise resolving to an ImproveUIResponse
   */
  improveUI: async (projectId: string, feedback: string): Promise<ImproveUIResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const refinedCode = `// Refined React component based on feedback: "${feedback}"
${PREMIUM_HERO_JSX}
`;
    return {
      code: refinedCode,
    };
  },

  /**
   * Lists all existing mock projects for the user.
   * @returns A promise resolving to an array of Project objects
   */
  getProjects: async (): Promise<Project[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return [...MOCK_PROJECTS];
  },

  /**
   * Looks up a single project definition by its unique ID.
   * @param id The project identifier to find
   * @returns A promise resolving to the matched Project model
   */
  getProjectById: async (id: string): Promise<Project> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const matched = MOCK_PROJECTS.find((p) => p.id === id);
    if (matched) return { ...matched };

    // Fallback dynamic generation if ID is custom
    return {
      id,
      userId: "user-default-mvp",
      title: "Dynamically Restored Project",
      prompt: "Restored workspace state lookup",
      generatedCode: PREMIUM_HERO_JSX,
      previewUrl: `https://mock-renderer.ui-builder.internal/${id}`,
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Packages the project workspace files into a zipped downloadable bundle.
   * @param projectId The project identifier to zip
   * @returns A promise resolving to an ExportProjectResponse download link
   */
  exportProject: async (projectId: string): Promise<ExportProjectResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      downloadUrl: `https://mock-exporter.ui-builder.internal/bundles/${projectId}-export.zip`,
    };
  },
};

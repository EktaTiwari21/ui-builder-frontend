"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowDown,
  Terminal,
  Eye,
  MessageSquare,
  Download,
  Code2,
  Cpu,
  Laptop,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * High-fidelity Marketing Landing Page for the Autonomous UI Builder application.
 * Incorporates Framer Motion entrance animations on the Hero section, responsive grid panels,
 * vector mockup displays, and call-to-actions, styled exclusively for Light Theme.
 */
export default function MarketingLandingPage() {
  /** Smooth scrolls viewport to specific anchor tags */
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-x-hidden">
      {/* 1. STICKY GLASSMORPHIC NAVBAR */}
      <nav className="sticky top-0 z-50 w-full h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 shadow-sm shadow-slate-100/40">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-150">
              <Sparkles className="w-4 h-4 fill-white/10" />
            </div>
            <span className="font-extrabold text-slate-950 text-base tracking-tight">
              UI Builder
            </span>
          </Link>

          {/* Navigation links & CTA */}
          <div className="flex items-center gap-6 sm:gap-8">
            <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 select-none">
              <button
                onClick={() => handleScrollTo("how-it-works")}
                className="hover:text-indigo-600 transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => handleScrollTo("features")}
                className="hover:text-indigo-600 transition-colors"
              >
                Features
              </button>
            </div>

            <Button className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95 duration-150 flex items-center gap-1" asChild>
              <Link href="/dashboard">
                <span>Get Started</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION (WITH FRAMER MOTION ENTRANCE ANIMATION) */}
      <header className="relative pt-16 pb-20 sm:pt-20 sm:pb-28 max-w-7xl mx-auto px-6 overflow-hidden">
        {/* Background Visual Blobs */}
        <div className="absolute top-12 left-1/4 w-80 h-80 bg-indigo-200/50 rounded-full blur-3xl opacity-40 -z-10 animate-pulse duration-[6000ms]" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-emerald-200/40 rounded-full blur-3xl opacity-40 -z-10 animate-pulse duration-[8000ms]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-8 flex flex-col items-center"
        >
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-bold shadow-sm tracking-wide select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            AI-Powered Frontend Agent
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.15] max-w-3xl">
            Describe your app.{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
              Watch it build.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
            Generate production-ready React + Tailwind frontends from a single natural language prompt. Plan, render, edit, and download code instantly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-xs sm:max-w-md">
            <Button className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 text-sm transition duration-200 flex items-center justify-center gap-1.5 active:scale-95" asChild>
              <Link href="/dashboard">
                <span>Start Building</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleScrollTo("how-it-works")}
              className="px-6 py-3.5 border-slate-200 hover:bg-slate-100/50 text-slate-700 font-bold rounded-xl shadow-sm text-sm transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>See how it works</span>
              <ArrowDown className="w-4 h-4" />
            </Button>
          </div>

          {/* High-Fidelity UI Mockup Panel */}
          <div className="w-full max-w-4xl pt-10 px-2 sm:px-4">
            <div className="border border-slate-200/90 rounded-3xl bg-white shadow-2xl shadow-slate-200 p-3 sm:p-4 select-none relative">
              {/* Header Bar */}
              <div className="h-7 border-b border-slate-100 bg-slate-50/50 rounded-t-xl px-3 flex items-center justify-between mb-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-350" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-350" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-350" />
                </div>
                <div className="h-4 bg-slate-100 px-6 rounded-md text-[9px] font-bold text-slate-400 font-mono flex items-center justify-center">
                  workspace/proj-landing-hero
                </div>
                <div className="w-8" />
              </div>

              {/* Layout splits mockup */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[320px] sm:h-[400px]">
                {/* Left side: prompt instructions */}
                <div className="md:col-span-4 border border-slate-200 rounded-2xl bg-slate-50 flex flex-col p-3 text-left justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-4 bg-indigo-50 border border-indigo-150 rounded text-[9px] font-bold text-indigo-700 flex items-center justify-center">
                      Prompt
                    </div>
                    <p className="text-[10px] text-slate-600 font-semibold leading-normal">
                      &ldquo;Build a dynamic landing page hero section for a premium AI tool using soft purple gradients and interactive monthly pricing cards...&rdquo;
                    </p>
                  </div>
                  <div className="h-20 bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="w-24 h-2.5 bg-slate-100 rounded" />
                      <div className="w-16 h-1.5 bg-slate-100 rounded" />
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-[10px]">
                      ⚡
                    </div>
                  </div>
                </div>

                {/* Right side: live preview screen */}
                <div className="md:col-span-8 border border-slate-200 rounded-2xl bg-gradient-to-br from-indigo-50/50 via-white to-emerald-50/50 flex flex-col overflow-hidden relative">
                  {/* Visual preview hero mockup */}
                  <div className="flex-1 p-5 flex flex-col justify-center text-left space-y-4">
                    <div className="w-16 h-4 bg-indigo-100/50 rounded-full flex items-center justify-center text-indigo-700 text-[8px] font-bold">
                      🔥 Live Preview
                    </div>
                    <div className="space-y-2">
                      <div className="w-2/3 h-5 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-md" />
                      <div className="w-3/4 h-5 bg-slate-900 rounded-md" />
                    </div>
                    <div className="w-5/6 h-3 bg-slate-400/35 rounded-sm" />
                    <div className="flex gap-2 pt-2">
                      <div className="w-20 h-7 bg-indigo-600 rounded-lg shadow-sm" />
                      <div className="w-20 h-7 bg-white border border-slate-200 rounded-lg shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* 3. HOW IT WORKS SECTION */}
      <section
        id="how-it-works"
        className="py-20 sm:py-28 bg-white border-y border-slate-200/60 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              How it works
            </h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto font-medium">
              Three simple steps from abstract concept to production code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 text-center">
            {/* Step 1 */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner relative">
                <Terminal className="w-6 h-6 stroke-[1.5]" />
                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md shadow-indigo-150">
                  1
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">1. Describe</h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Type your design requirements in plain, natural English using the smart prompt textarea.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner relative">
                <Cpu className="w-6 h-6 stroke-[1.5]" />
                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md shadow-indigo-150">
                  2
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">2. Generate</h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                AI agents plan layout components and assemble responsive React and Tailwind modules in real-time.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner relative">
                <Download className="w-6 h-6 stroke-[1.5]" />
                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md shadow-indigo-150">
                  3
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">3. Export</h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Review compiled structures, refine via sidebar chat, and download the entire codebase in one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURES GRID SECTION */}
      <section id="features" className="py-20 sm:py-28 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Packed with powerful features
            </h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto font-medium">
              Everything you need to ship fully responsive visual templates.
            </p>
          </div>

          {/* 2x2 Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Feature 1 */}
            <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Code2 className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-sm">React + Tailwind output</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Clean, production-ready React source code using exclusively styled Tailwind CSS utility components.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-sm">Live preview</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Interactive sandboxed browser execution rendering dynamic animations and viewport transitions.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-sm">Chat refinement</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Iteratively update fonts, add structures, and alter layouts by typing natural follow-up comments.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-sm">One-click export</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Package generated components directly into structured, downloadable Next.js App Router directories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-slate-50 border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Ready to build your UI?
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-sm mx-auto font-medium leading-relaxed">
            Create high-fidelity interfaces immediately without any configuration or boilerplate setup.
          </p>
          <div className="pt-2">
            <Button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition duration-200 shadow-lg shadow-indigo-100 flex items-center gap-1.5 mx-auto active:scale-95" asChild>
              <Link href="/dashboard">
                <span>Start for free</span>
                <ChevronRight className="w-4.5 h-4.5 stroke-[2.5]" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="h-16 bg-white border-t border-slate-200 flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-xs text-slate-400 font-bold tracking-wide">
          <span>© 2026 UI Builder</span>
          <span className="hover:text-slate-600 cursor-pointer select-none">Ekta Tiwari</span>
        </div>
      </footer>
    </div>
  );
}

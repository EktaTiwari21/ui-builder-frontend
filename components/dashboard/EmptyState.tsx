"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Layout, Code2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  /** Callback action fired when the custom creation button is clicked */
  onAction: () => void;
}

const EXAMPLE_CARDS = [
  {
    title: "SaaS Landing Page",
    desc: "Sleek hero section, pricing toggle, feature grids, and email CTA.",
    icon: Layout,
    color: "from-indigo-500 to-violet-500",
    bgColor: "bg-indigo-50/70 hover:bg-indigo-50",
    textColor: "text-indigo-600",
    borderColor: "border-indigo-100 hover:border-indigo-200",
    prompt: "A premium SaaS landing page with a hero section containing custom illustrations, a 3-column pricing plan toggle (monthly/annual), feature grids, testimonials, and a high-converting email sign-up CTA.",
  },
  {
    title: "Mobile App Onboarding",
    desc: "3-step interactive screen flow with badges, page dots, and navigation.",
    icon: Play,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50/70 hover:bg-emerald-50",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-100 hover:border-emerald-200",
    prompt: "A clean 3-step mobile app onboarding flow with visual slides, animated page indicator badges, title copy, subtext descriptions, and intuitive Back / Next navigation buttons.",
  },
  {
    title: "Analytics Dashboard",
    desc: "Sidebar layout, metrics charts, growth states, and recent transaction records.",
    icon: Code2,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50/70 hover:bg-purple-50",
    textColor: "text-purple-600",
    borderColor: "border-purple-100 hover:border-purple-200",
    prompt: "A comprehensive analytics dashboard featuring a sidebar navigation, header filters, stats cards with growth indicator badges, a main activity line chart, and a latest transactions table.",
  },
];

/**
 * EmptyState component displayed when the project list is empty.
 * Guides the user to create their first generation using an animated gradient illustration,
 * headline, and 3 clickable starting templates.
 */
export function EmptyState({ onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 border border-slate-200 rounded-3xl bg-white text-center shadow-sm max-w-2xl mx-auto">
      {/* 1. Large CSS-only animated gradient illustration */}
      <div className="relative w-full max-w-md h-52 rounded-2xl overflow-hidden bg-slate-900 shadow-xl flex items-center justify-center p-6 mb-8 border border-slate-800">
        {/* Shifting background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-500 opacity-90 animate-gradient-shift" />
        
        {/* Floating cards */}
        <div className="absolute top-6 left-8 w-32 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl animate-pulse-soft flex flex-col p-3 space-y-1.5 text-left">
          <div className="w-14 h-3 bg-white/40 rounded" />
          <div className="w-20 h-2 bg-white/20 rounded" />
          <div className="w-10 h-2 bg-white/20 rounded" />
        </div>
        
        <div className="absolute bottom-6 right-8 w-36 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl animate-pulse-soft delay-1000 flex flex-col p-3 justify-between text-left">
          <div className="flex justify-between items-center">
            <div className="w-16 h-2.5 bg-white/40 rounded" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="w-20 h-1.5 bg-white/20 rounded" />
            <div className="w-24 h-1.5 bg-white/20 rounded" />
          </div>
        </div>

        {/* Center icon */}
        <div className="z-10 text-center flex flex-col items-center space-y-2 select-none">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-2xl animate-bounce duration-3000">
            <Sparkles className="w-7 h-7 fill-white/10" />
          </div>
        </div>
      </div>

      {/* 2. Headline */}
      <h3 className="font-extrabold text-slate-900 text-2xl tracking-tight mb-2">
        Your first UI is one prompt away
      </h3>
      <p className="text-slate-500 text-sm max-w-md mb-8 leading-relaxed">
        Describe your idea or choose one of our starting prompt templates below to generate a production-ready interface instantly.
      </p>

      {/* 3. Three example prompt cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-8 text-left">
        {EXAMPLE_CARDS.map((card) => {
          const IconComponent = card.icon;
          return (
            <Link
              key={card.title}
              href={`/workspace?prompt=${encodeURIComponent(card.prompt)}`}
              className={`p-4 border ${card.borderColor} ${card.bgColor} rounded-2xl flex flex-col justify-between transition-all duration-200 hover:scale-[1.02] active:scale-95 group cursor-pointer shadow-sm`}
            >
              <div>
                <div className={`w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center ${card.textColor} shadow-sm mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent className="w-5 h-5 stroke-[2]" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1 leading-tight">{card.title}</h4>
                <p className="text-[11px] text-slate-500 leading-normal mb-4">{card.desc}</p>
              </div>
              <div className={`text-[10px] font-bold ${card.textColor} flex items-center gap-1 mt-auto`}>
                <span>Use Prompt</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* 4. Custom creation button */}
      <Button
        onClick={onAction}
        className="px-6 py-5 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl transition duration-200 shadow-md shadow-slate-100 flex items-center gap-2 active:scale-95 text-xs uppercase tracking-wider"
      >
        <span>Or Start with Blank Prompt</span>
        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
      </Button>
    </div>
  );
}

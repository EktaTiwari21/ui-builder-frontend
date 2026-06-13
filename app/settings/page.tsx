"use client";

import React, { useState, useEffect } from "react";
import { User, Key, Settings2, Eye, EyeOff, Save, CheckCircle, Sparkles } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Sidebar } from "@/components/common/Sidebar";
import { AuthGuard } from "@/components/common/AuthGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Settings page component rendering user configurations.
 * Coordinates cards for profile info, password-toggled API tokens,
 * select dropdown preferences, and floating notification toasts on saves.
 */
export default function SettingsPage() {
  // 1. Local controlled state hooks
  const [displayName, setDisplayName] = useState("Ekta Tiwari");
  const [email] = useState("ekta.tiwari@example.com");

  const [openaiKey, setOpenaiKey] = useState("sk-proj-mock1234567890abcdefghijkl");
  const [showOpenai, setShowOpenai] = useState(false);

  const [geminiKey, setGeminiKey] = useState("AIzaSyMock9876543210zyxwvutsrqpo");
  const [showGemini, setShowGemini] = useState(false);

  const [exportFormat, setExportFormat] = useState("react-tailwind");
  const [quality, setQuality] = useState("balanced");

  // 2. Animated Toast Message State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const triggerToast = (message: string) => {
    setToastMessage(message);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast("Profile settings saved successfully.");
  };

  const handleSaveOpenai = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerToast("OpenAI API Key saved successfully.");
  };

  const handleSaveGemini = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerToast("Gemini API Key saved successfully.");
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast("Preferences saved successfully.");
  };

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Dynamic Header */}
      <Navbar />

      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Settings Inner Content */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-4xl mx-auto w-full space-y-8 animate-in fade-in duration-350">
          {/* Header */}
          <div className="border-b border-slate-200/60 pb-6 space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              <span>Settings</span>
              <Settings2 className="w-6 h-6 text-indigo-500" />
            </h1>
            <p className="text-slate-500 text-sm font-semibold">
              Manage your builder account profile, API credentials, and default generation templates.
            </p>
          </div>

          <div className="space-y-6 pb-12">
            {/* 1. PROFILE SECTION CARD */}
            <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
              <CardHeader className="border-b border-slate-100/80 bg-slate-50/50 pb-4">
                <CardTitle className="text-slate-900 text-base font-bold flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-500" />
                  <span>Profile Settings</span>
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs font-semibold">
                  Update your public name and view account details.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">Display Name</label>
                    <Input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="rounded-xl border-slate-200 focus-visible:ring-indigo-500 focus-visible:ring-1 text-slate-800 text-sm font-semibold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">Email Address</label>
                    <Input
                      type="email"
                      value={email}
                      readOnly
                      disabled
                      className="rounded-xl border-slate-200 bg-slate-50 text-slate-400 text-sm font-semibold cursor-not-allowed select-none"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50/30 border-t border-slate-100/60 p-4 flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save changes</span>
                </Button>
              </CardFooter>
            </Card>

            {/* 2. API KEYS SECTION CARD */}
            <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
              <CardHeader className="border-b border-slate-100/80 bg-slate-50/50 pb-4">
                <CardTitle className="text-slate-900 text-base font-bold flex items-center gap-2">
                  <Key className="w-5 h-5 text-indigo-500" />
                  <span>API Credentials</span>
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs font-semibold">
                  Manage keys for external model processing. Tokens are encrypted locally.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* OpenAI Key */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">OpenAI API Key</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showOpenai ? "text" : "password"}
                        value={openaiKey}
                        onChange={(e) => setOpenaiKey(e.target.value)}
                        className="rounded-xl border-slate-200 pr-10 focus-visible:ring-indigo-500 focus-visible:ring-1 text-slate-800 text-sm font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOpenai(!showOpenai)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                      >
                        {showOpenai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleSaveOpenai}
                      className="px-4 py-2 border-slate-200 hover:bg-slate-50 font-bold rounded-xl text-xs transition active:scale-95"
                    >
                      Save Key
                    </Button>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    Used for AI UI generation. Never stored in plain text.
                  </span>
                </div>

                {/* Gemini Key */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Gemini API Key</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showGemini ? "text" : "password"}
                        value={geminiKey}
                        onChange={(e) => setGeminiKey(e.target.value)}
                        className="rounded-xl border-slate-200 pr-10 focus-visible:ring-indigo-500 focus-visible:ring-1 text-slate-800 text-sm font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowGemini(!showGemini)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                      >
                        {showGemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleSaveGemini}
                      className="px-4 py-2 border-slate-200 hover:bg-slate-50 font-bold rounded-xl text-xs transition active:scale-95"
                    >
                      Save Key
                    </Button>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    Used for AI UI generation. Never stored in plain text.
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 3. PREFERENCES SECTION CARD */}
            <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
              <CardHeader className="border-b border-slate-100/80 bg-slate-50/50 pb-4">
                <CardTitle className="text-slate-900 text-base font-bold flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-indigo-500" />
                  <span>Builder Preferences</span>
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs font-semibold">
                  Adjust default builder behaviors and speed configs.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Default format dropdown */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">Default Export Format</label>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger className="rounded-xl border-slate-200 text-slate-800 text-xs font-semibold focus:ring-1 focus:ring-indigo-500">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 rounded-xl shadow-md">
                        <SelectItem value="react-tailwind" className="text-xs font-semibold hover:bg-slate-50 rounded-lg">
                          React + Tailwind CSS
                        </SelectItem>
                        <SelectItem value="html-only" className="text-xs font-semibold hover:bg-slate-50 rounded-lg">
                          HTML + Vanilla CSS
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quality dropdown */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">Generation Quality</label>
                    <Select value={quality} onValueChange={setQuality}>
                      <SelectTrigger className="rounded-xl border-slate-200 text-slate-800 text-xs font-semibold focus:ring-1 focus:ring-indigo-500">
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 rounded-xl shadow-md">
                        <SelectItem value="fast" className="text-xs font-semibold hover:bg-slate-50 rounded-lg">
                          Fast (Speed Accents)
                        </SelectItem>
                        <SelectItem value="balanced" className="text-xs font-semibold hover:bg-slate-50 rounded-lg">
                          Balanced (Recommended)
                        </SelectItem>
                        <SelectItem value="best" className="text-xs font-semibold hover:bg-slate-50 rounded-lg">
                          Best quality (High Tokens)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50/30 border-t border-slate-100/60 p-4 flex justify-end">
                <Button
                  onClick={handleSavePreferences}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save preferences</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>

      {/* 4. VISUAL ANIMATED FLOATING TOAST NOTIFICATION LAYER */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex items-center gap-2.5 px-4.5 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl shadow-slate-900/30 text-white text-xs font-bold">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
    </AuthGuard>
  );
}

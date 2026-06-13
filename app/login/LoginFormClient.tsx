"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

/**
 * LoginFormClient client-side rendering component.
 * Manages email format check (enforcing Gmail/email structure), password length validation,
 * login submission loader states, and redirects to dashboard.
 */
export default function LoginFormClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation States
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateForm = () => {
    const tempErrors: typeof errors = {};
    
    // Email Validation (Gmail pattern or standard email validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      tempErrors.email = "Email address is required.";
    } else if (!emailRegex.test(email)) {
      tempErrors.email = "Please enter a valid email address.";
    }

    // Password Validation (minimum 6 digits/characters)
    if (!password) {
      tempErrors.password = "Password is required.";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters long.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      // Store JWT token to localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        // Dispatch custom storage event to notify navbar/other client components
        window.dispatchEvent(new Event("storage"));
      }

      router.push("/dashboard");
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative px-4 py-12 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-150 rounded-full blur-3xl opacity-30 -z-10 animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-30 -z-10 animate-pulse duration-[10000ms]" />

      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo Header */}
        <div className="text-center space-y-2 select-none">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-150 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-4.5 h-4.5 fill-white/10" />
            </div>
            <span className="font-extrabold text-slate-950 text-lg tracking-tight">
              UI Builder
            </span>
          </Link>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Autonomous Design Studio
          </p>
        </div>

        {/* Login Card wrapper */}
        <Card className="border border-slate-200 bg-white shadow-xl shadow-slate-150 rounded-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500" />
          
          <CardHeader className="pt-8 pb-4">
            <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-950 text-center font-heading">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-slate-500 text-sm font-medium">
              Enter your credentials to access your workspaces.
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-6 pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* General Error Alert Box */}
              {errors.general && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-semibold flex gap-2.5 items-start">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-500" />
                  <span>{errors.general}</span>
                </div>
              )}

              {/* Email Address Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="email-input">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <Input
                    id="email-input"
                    type="email"
                    placeholder="name@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 h-10 border-slate-200 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-xl"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] font-bold text-red-600 animate-in fade-in duration-200">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="password-input">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <Input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10 h-10 border-slate-200 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-xl"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] font-bold text-red-600 animate-in fade-in duration-200">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-indigo-100 transition active:scale-[0.99]"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-slate-50/50 border-t border-slate-100 py-4 flex justify-center text-xs">
            <span className="text-slate-500 font-medium mr-1">Don't have an account?</span>
            <Link href="/signup" className="text-indigo-600 font-bold hover:text-indigo-700">
              Sign Up for free
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

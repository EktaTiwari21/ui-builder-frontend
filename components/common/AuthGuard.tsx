"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LoadingSpinner } from "./LoadingSpinner";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Route protection wrapper component.
 * Inspects local storage for a valid JWT token on mount.
 * Redirects unauthenticated sessions back to the login interface.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthenticated(false);
          router.replace("/login");
        } else {
          setIsAuthenticated(true);
        }
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (isAuthenticated === null) {
    return (
      <div className="flex-1 min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
          Verifying security credentials...
        </p>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="flex-1 min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
          Redirecting to authentication...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

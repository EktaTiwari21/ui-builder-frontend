import { useEffect, useState } from "react";

/**
 * Custom hook to detect mobile, tablet, and desktop viewport breakpoints.
 */
export function useResponsive() {
  const [breakpoint, setBreakpoint] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setBreakpoint("mobile");
      } else if (width < 1280) {
        setBreakpoint("tablet");
      } else {
        setBreakpoint("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { breakpoint, isMobile: breakpoint === "mobile", isTablet: breakpoint === "tablet" };
}

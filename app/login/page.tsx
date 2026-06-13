import type { Metadata } from "next";
import LoginFormClient from "./LoginFormClient";

export const metadata: Metadata = {
  title: "Sign In | Autonomous UI Builder",
  description: "Access your AI-powered web application generator dashboard.",
};

/**
 * Login route component rendering the visual card interface.
 */
export default function LoginPage() {
  return <LoginFormClient />;
}

import type { Metadata } from "next";
import SignupFormClient from "./SignupFormClient";

export const metadata: Metadata = {
  title: "Create Account | Autonomous UI Builder",
  description: "Sign up to start transforming natural language prompts into React/Tailwind frontends.",
};

/**
 * Signup route page component rendering registration cards.
 */
export default function SignupPage() {
  return <SignupFormClient />;
}

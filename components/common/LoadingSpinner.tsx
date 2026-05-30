interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
}

/**
 * LoadingSpinner component for visual operation feedback.
 */
export function LoadingSpinner({ size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600 ${sizeClasses[size]}`} />
    </div>
  );
}

import { AuthGuard } from "@/components/common/AuthGuard";

/**
 * Projects list management page, allowing user to see complete histories and details.
 */
export default function ProjectsPage() {
  return (
    <AuthGuard>
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Projects</h1>
        <p className="text-slate-500">Manage and browse through your complete catalog of AI-designed web applications.</p>
      </div>
    </AuthGuard>
  );
}

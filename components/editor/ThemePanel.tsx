interface ThemeConfig {
  primaryColor: string;
  fontFamily: string;
}

interface ThemePanelProps {
  config: ThemeConfig;
  onUpdateConfig: (newConfig: ThemeConfig) => void;
}

/**
 * ThemePanel component allowing the customization of generated colors, fonts, and styling parameters.
 */
export function ThemePanel({ config, onUpdateConfig }: ThemePanelProps) {
  return (
    <div className="p-4 border border-slate-200 rounded-lg bg-white shadow-sm space-y-3">
      <h2 className="text-sm font-semibold text-slate-700">Theme Panel</h2>
      <div className="flex gap-2 text-xs">
        <span>Color: {config.primaryColor}</span>
        <span>Font: {config.fontFamily}</span>
      </div>
      <button
        onClick={() => onUpdateConfig({ primaryColor: "#4f46e5", fontFamily: "sans-serif" })}
        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded"
      >
        Reset Theme
      </button>
    </div>
  );
}

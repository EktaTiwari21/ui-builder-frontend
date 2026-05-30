interface ComponentNode {
  id: string;
  name: string;
  children?: ComponentNode[];
}

interface ComponentTreeProps {
  tree: ComponentNode;
  onSelectComponent: (componentId: string) => void;
}

/**
 * ComponentTree component presenting the visual heirarchy of AI-generated components.
 */
export function ComponentTree({ tree, onSelectComponent }: ComponentTreeProps) {
  return (
    <div className="p-4 border border-slate-200 rounded-lg bg-white shadow-sm">
      <h2 className="text-sm font-semibold text-slate-700 mb-2">Component Tree</h2>
      <p className="text-xs text-slate-500" onClick={() => onSelectComponent(tree.id)}>
        Root component node: {tree.name}
      </p>
    </div>
  );
}

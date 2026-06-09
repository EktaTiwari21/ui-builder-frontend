import { useGenerationStore } from "@/lib/store/useGenerationStore";
import { useProjectStore } from "@/lib/store/useProjectStore";

/**
 * Initiates SSE streaming connection to generate-ui endpoint.
 * Utilizes standard native fetch and ReadableStream reader.
 *
 * @param prompt The natural language description prompt input
 * @param style Selected design aesthetic theme config
 * @param framework Core technology target, defaults to 'react-tailwind'
 */
export async function streamGenerate(
  prompt: string,
  style: "minimal" | "modern" | "corporate" | "playful" = "modern",
  framework: "react-tailwind" = "react-tailwind"
): Promise<void> {
  const store = useGenerationStore.getState();
  const projectStore = useProjectStore.getState();

  // Create temporary project ID if none active
  const projectId = projectStore.activeProject?.id || `proj-gen-${Date.now().toString().slice(-6)}`;
  
  // 1. Initialize active generation logs in the store
  store.startGeneration(projectId, prompt);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const url = `${baseUrl}/generate-ui`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, style, framework }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body is not readable");
    }

    const decoder = new TextDecoder();
    let buffer = "";
    let accumulatedCode = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      
      // Save last unfinished line back to buffer
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        
        if (trimmed.startsWith("data:")) {
          const rawJson = trimmed.slice(5).trim();
          try {
            const parsed = JSON.parse(rawJson);
            
            if (parsed.type === "plan") {
              // Store planning status in state (using error field or custom field. Let's use custom text on component)
              // For Zustand, let's keep the plan text inside code field or custom state, but since completedGeneration uses it,
              // we can update activeGeneration directly to show dynamic state.
              useGenerationStore.setState((state) => {
                if (!state.activeGeneration) return {};
                return {
                  activeGeneration: {
                    ...state.activeGeneration,
                    status: "generating",
                    error: null, // clear
                    // We can reuse the code field temporarily for plan log, or store plan updates.
                    // But to stream code chunk-by-chunk in real time, let's make sure it updates generatedCode.
                  }
                };
              });
              // Dispatch standard event if components want to listen
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("generation-plan", { detail: parsed.content }));
              }
            } else if (parsed.type === "chunk") {
              accumulatedCode += parsed.content;
              useGenerationStore.setState((state) => {
                if (!state.activeGeneration) return {};
                return {
                  activeGeneration: {
                    ...state.activeGeneration,
                    code: accumulatedCode,
                  }
                };
              });
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("generation-chunk", { detail: accumulatedCode }));
              }
            } else if (parsed.type === "done") {
              const projId = parsed.project_id || projectId;
              
              // Assemble completed project
              const completedProject = {
                id: projId,
                userId: "user-default-mvp",
                title: prompt.slice(0, 30) || "Generated Interface",
                prompt,
                generatedCode: accumulatedCode,
                previewUrl: `https://mock-renderer.ui-builder.internal/${projId}`,
                createdAt: new Date().toISOString(),
              };

              projectStore.addProject(completedProject);
              projectStore.setActiveProject(completedProject);

              store.completeGeneration(accumulatedCode, {
                promptTokens: 240,
                responseTokens: parsed.total_tokens || 1000,
                latency: 1000,
              });

              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("generation-done", { detail: projId }));
              }
            } else if (parsed.type === "error") {
              throw new Error(parsed.message || "Generation failed");
            }
          } catch (e) {
            console.error("Error parsing SSE JSON line:", e);
          }
        }
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to generate interface";
    store.failGeneration(msg);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("generation-error", { detail: msg }));
    }
    throw err;
  }
}

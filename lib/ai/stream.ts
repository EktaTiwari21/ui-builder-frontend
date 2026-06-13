import { useGenerationStore } from "@/lib/store/useGenerationStore";

/**
 * Connects to the POST /generate-ui streaming API and processes Server-Sent Events (SSE).
 * Streams structural logs and layout JSX code snippets to the UI generation store in real-time.
 * 
 * @param prompt The natural language layout design description
 * @param style Selected design aesthetic theme config
 * @param framework Core technology target (defaults to 'react-tailwind')
 */
export async function streamGenerate(
  prompt: string,
  style: string = "modern",
  framework: string = "react-tailwind"
): Promise<void> {
  const store = useGenerationStore.getState();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const url = `${baseUrl}/generate-ui`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    console.log("[stream] Token exists in localStorage:", !!token);
    console.log("[stream] Token length:", token?.length);
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  console.log("[stream] Authorization attached:", !headers ? false : !!(headers as any)["Authorization"]);

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ prompt, style, framework }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Server returned status ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Response body is not readable");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
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
              store.setStatus(parsed.content);
            } else if (parsed.type === "chunk") {
              store.appendCode(parsed.content);
            } else if (parsed.type === "done") {
              store.setComplete(parsed.project_id);
            } else if (parsed.type === "error") {
              store.setError(parsed.message);
              throw new Error(parsed.message || "Generation error event received");
            }
          } catch (e) {
            console.error("Error parsing SSE JSON payload:", e);
          }
        }
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Stream processing aborted";
    store.setError(msg);
    throw err;
  }
}

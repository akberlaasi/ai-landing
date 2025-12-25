"use client";
import { useEffect, useRef, useState } from "react";

export default function ChatBox({
  messages,
  setMessages,
  resetKey,
}: {
  messages: { role: "user" | "assistant"; content: string }[];
  setMessages: React.Dispatch<
    React.SetStateAction<{ role: "user" | "assistant"; content: string }[]>
  >;
  resetKey: number;
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const examples = [
    "Write a short bio for my Upwork profile",
    "Summarize this paragraph in 3 bullet points",
    "Give me 5 headline ideas for an AI website",
  ];

  // A) Clear input when New chat happens
  useEffect(() => {
    setMessage("");
  }, [resetKey]);

  // B) Auto-scroll when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    // 0) Block empty sends
    if (!message.trim() || loading) return;

    // Keep a copy of what user asked (because we clear the input)
    const userText = message;

    // 1) Add USER message immediately
    setMessages((prev) => [...prev, { role: "user", content: userText }]);

    // 2) Clear input for better UX
    setMessage("");

    // 3) Start loading
    setLoading(true);

    // 4) Add ASSISTANT placeholder (we will stream into this)
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const reader = res.body?.getReader();
      if (!reader) {
        // Replace last assistant message
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content: "No response stream.",
          };
          return copy;
        });
        return;
      }

      const decoder = new TextDecoder();
      let result = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        result += decoder.decode(value, { stream: true });

        // Update ONLY the last assistant message while streaming
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: result };
          return copy;
        });
      }
    } catch (e) {
      // Replace last assistant message (avoid adding extra bubble)
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Error: could not reach server.",
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="chat"
      className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Ask the AI</h2>
      </div>

      {/* Example prompts */}
      <div className="mt-3 flex flex-wrap gap-2">
        {examples.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => setMessage(text)}
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-3 py-1 text-sm font-medium text-white shadow-sm hover:opacity-95 disabled:opacity-60"
          >
            {text}
          </button>
        ))}
      </div>

      {/* Input + Send */}
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your question… (Enter to send, Shift+Enter for a new line)"
          rows={2}
          className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
        />

        <button
          onClick={handleSend}
          disabled={loading || !message.trim()}
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-5 py-3 text-sm font-medium text-white shadow-sm hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      {/* Hint */}
      <p className="mt-2 text-xs text-gray-500">
        Try clicking an example above or ask your own question.
      </p>

      {/* Messages */}
      <div className="mt-4 h-[420px] overflow-y-auto rounded-xl bg-gray-50 p-4">
        {messages.length === 0 ? (
          <div className="text-sm text-gray-500">
            Ask something above to start the conversation.
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={
                  m.role === "user"
                    ? "ml-auto w-fit max-w-[85%] rounded-2xl bg-gray-900 px-4 py-2 text-sm text-white whitespace-pre-wrap"
                    : "mr-auto w-fit max-w-[85%] rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 whitespace-pre-wrap"
                }
                title={m.content} // Tooltip to show the full message on hover
              >
                {m.role === "user"
                  ? m.content.length > 30
                    ? m.content.substring(0, 30) + "..."
                    : m.content
                  : m.content}
              </div>
            ))}
          </div>
        )}

        {/* Extra typing bubble (optional) */}
        {loading && messages.length > 0 && messages[messages.length - 1]?.role !== "assistant" ? (
          <div className="mt-3 mr-auto w-fit max-w-[85%] rounded-2xl border border-gray-200 bg-slate-200 px-4 py-2 text-sm text-gray-600">
            Typing…
          </div>
        ) : null}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>
    </section>
  );
}

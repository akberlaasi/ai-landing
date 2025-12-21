"use client";

import { useState } from "react";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const examples = [
  "Write a short bio for my Upwork profile",
  "Summarize this paragraph in 3 bullet points",
  "Give me 5 headline ideas for an AI website",
];

  async function handleSend() {
      
  if (!message.trim()) return;

  setLoading(true);
try {
  // 0) Block empty sends
  if (!message.trim()) return;

  // 1) Add USER message immediately
  setMessages((prev) => [...prev, { role: "user", content: message }]);

  // 2) Clear input for better UX
  setMessage("");

  // 3) Start loading
  setLoading(true);

  // 4) Add ASSISTANT placeholder (we will stream into this)
  setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
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

    result += decoder.decode(value);

    // Update ONLY the last assistant message while streaming
    setMessages((prev) => {
      const copy = [...prev];
      copy[copy.length - 1] = { role: "assistant", content: result };
      return copy;
    });
  }
} catch (e) {
  setMessages((prev) => [
    ...prev,
    { role: "assistant", content: "Error: could not reach server." },
  ]);
} finally {
  setLoading(false);
}

}

function handleNewChat() {
  setMessages([]);
  setMessage("");
}

return (
  <section id="chat" className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
  <h2 className="text-base font-semibold text-gray-900">Ask the AI</h2>

  <button
    type="button"
    onClick={handleNewChat}
    className="text-x font-semibold text-gray-600 hover:text-gray-900"
  >
    New chat
  </button>
</div>

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

    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your question…"
        className="w-full rounded-xl border border-gray-300 px-3 py-1 text-sm outline-none focus:border-gray-900"
      />

      <button
        onClick={handleSend}
        disabled={loading}
        className="rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-3 py-1 text-sm font-medium text-white shadow-sm hover:opacity-95 disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>

    <p className="mt-2 text-xs text-gray-500">
        Try clicking an example above or ask your own question.
    </p>

    <div className="mt-4 rounded-xl bg-gray-50 p-4">
    
      <div className="mt-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-sm text-gray-500">
            Ask something above to start the conversation.
          </div>
        ) : (
          messages.map((m, idx) => (
            <div
              key={idx}
              className={
                m.role === "user"
                  ? "ml-auto w-fit max-w-[85%] rounded-2xl bg-gray-900 px-4 py-2 text-sm text-white whitespace-pre-wrap"
                  : "mr-auto w-fit max-w-[85%] rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 whitespace-pre-wrap"
              }
            >
              {m.content}
            </div>
          ))
        )}
      </div>
      
      <div className="mt-4 space-y-3">
  ...
</div>

{loading ? (
  <div className="mt-3 mr-auto w-fit max-w-[85%] rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-500">
    Typing…
  </div>
) : null}

    </div>
  </section>
);

}

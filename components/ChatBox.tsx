"use client";

import { useState } from "react";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<string>("");
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
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const reader = res.body?.getReader();
if (!reader) {
  setResponse("No response stream.");
  setLoading(false);
  return;
}

const decoder = new TextDecoder();
let result = "";

while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  result += decoder.decode(value);
  setResponse(result);
}

  } catch (e) {
    setResponse("Error: could not reach server.");
  } finally {
    setLoading(false);
  }
}

return (
  <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <h2 className="text-base font-semibold text-gray-900">Ask the AI</h2>
   <div className="mt-3 flex flex-wrap gap-2">
  {examples.map((text) => (
    <button
      key={text}
      type="button"
      onClick={() => setMessage(text)}
      className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 hover:border-gray-900"
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
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
      />

      <button
        onClick={handleSend}
        disabled={loading}
        className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>

    <p className="mt-2 text-xs text-gray-500">
        Try clicking an example above or ask your own question.
    </p>

    <div className="mt-4 rounded-xl bg-gray-50 p-4">
    
    <div className="text-xs text-gray-500">Response</div>
    <div className="mt-1 whitespace-pre-wrap text-sm text-gray-800">
        {response ? response : "AI will answer here…"}
    </div>

    </div>
  </section>
);

}

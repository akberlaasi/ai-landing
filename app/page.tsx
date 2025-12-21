"use client";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ChatBox from "@/components/ChatBox";
import { useState } from "react";




export default function Home() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  const [resetKey, setResetKey] = useState(0);

  function handleNewChat() {
    setMessages([]);
    setResetKey((k) => k + 1);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Header onNewChat={handleNewChat} />
        <div className="mx-auto max-w-2xl px-6 py-16">
        <Hero />
        <div className="mt-10">
          <ChatBox messages={messages} setMessages={setMessages} resetKey={resetKey} />
        </div>
      </div>
    </main>
  );
}

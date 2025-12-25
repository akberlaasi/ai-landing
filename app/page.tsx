"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ChatBox from "@/components/ChatBox";

export default function Page() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  const [resetKey, setResetKey] = useState(0); // Add a key to reset chat

  // This will handle clearing the chat history
  function handleNewChat() {
    setMessages([]); // Clear messages
    setResetKey((prevKey) => prevKey + 1); // Increment the resetKey to reset child components
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-indigo-200 to-fuchsia-200 ">
      <Header onNewChat={handleNewChat} /> {/* Pass the handleNewChat function */}
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Hero />
        <div className="mt-10">
          <ChatBox messages={messages} setMessages={setMessages} resetKey={resetKey} />
        </div>
      </div>
    </main>
  );
}

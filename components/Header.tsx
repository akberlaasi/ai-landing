export default function Header({ onNewChat }: { onNewChat: () => void }) {
  return (
    <header className="border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-fuchsia-600">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
        <span className="text-2xl font-semibold text-white">AALIYA AI STUDIO</span>
        <div className="space-x-4">
          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="rounded-xl bg-transparent border-2 border-white text-white px-4 py-2 text-sm font-medium"
          >
            New Chat
          </button>
          {/* Try It Button */}
          <a
            href="#chat"
            className="rounded-xl bg-transparent border-2 border-white text-white px-4 py-2 text-sm font-medium"
          >
            Try it
          </a>
        </div>
      </div>
    </header>
  );
}

export default function Header({ onNewChat }: { onNewChat: () => void }) {
  return (
    <header className="border border-3 border-gray-400 bg-gradient-to-r from-indigo-600 to-fuchsia-600">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-22 rounded-xl bg-white" />
          <span className="text-sm font-semibold text-white">AALIYA AI STUDIO</span>
        </div>

<div className="flex items-center gap-3">
  <button
    type="button"
    onClick={onNewChat}
    className="rounded-xl border-2 border-white bg-transparent px-4 py-2 text-sm font-semibold text-white hover:bg-white hover:text-gray-900 transition"
  >
    New chat
  </button>

  <a
    href="#chat"
    className="rounded-xl border-2 border-white bg-transparent px-4 py-2 text-sm font-semibold text-white hover:bg-white hover:text-gray-900 transition"
  >
    Try It
  </a>
</div>

      </div>
    </header>
  );
}

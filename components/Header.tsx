export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gray-900" />
          <span className="text-sm font-semibold text-gray-900">AI Landing</span>
        </div>

        <a
          href="#chat"
          className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white"
        >
          Try it
        </a>
      </div>
    </header>
  );
}

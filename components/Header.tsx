export default function Header() {
  return (
    <header className="border border-3 border-gray-400 bg-gradient-to-r from-indigo-600 to-fuchsia-600">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-22 rounded-xl bg-white" />
          <span className="text-sm font-semibold text-white">DWSXpert</span>
        </div>

        <a
          href="#chat"
          className="h-8 w-22 rounded-xl border-3 border-white bg-transparent px-4.5 py-1 text-sm font-semibold text-white hover:bg-white hover:text-gray-900 transition"
        >
          TRY IT
        </a>
      </div>
    </header>
  );
}

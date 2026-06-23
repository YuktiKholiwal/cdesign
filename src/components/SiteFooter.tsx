import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row">
        <p>
          <span className="font-semibold text-slate-700">cdesign</span> — install
          a design language with one command.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-slate-800">
            Designs
          </Link>
          <Link href="/topics" className="hover:text-slate-800">
            Topics
          </Link>
          <Link href="/create" className="hover:text-slate-800">
            Create
          </Link>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

/** Global marketplace navigation, modeled on skills.sh's header. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-slate-900 text-sm font-bold text-white">
            c
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-slate-900">
            cdesign
          </span>
          <span className="hidden text-xs text-slate-400 sm:inline">
            the design spec marketplace
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <NavLink href="/">Designs</NavLink>
          <NavLink href="/topics">Topics</NavLink>
          <Link
            href="/create"
            className="ml-1 inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 font-medium text-white transition hover:bg-slate-700"
          >
            Create
          </Link>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-1.5 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
    >
      {children}
    </Link>
  );
}

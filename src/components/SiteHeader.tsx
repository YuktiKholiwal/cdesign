import Link from "next/link";
import { ButtonLink } from "./ui/Button";

/** Minimal Geist top nav: hairline divider, translucent blur, triangle mark. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <div className="flex items-center gap-7">
          <Link href="/" className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-0 w-0 border-x-[7px] border-b-[12px] border-x-transparent border-b-neutral-900"
            />
            <span className="text-[15px] font-semibold tracking-tight text-neutral-900">
              cdesign
            </span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            <NavLink href="/">Designs</NavLink>
            <NavLink href="/topics">Topics</NavLink>
            <NavLink href="/remix">Remix</NavLink>
          </nav>
        </div>

        <ButtonLink href="/create" variant="primary" size="sm">
          Create
        </ButtonLink>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-md px-2.5 py-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
    >
      {children}
    </Link>
  );
}

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-10 text-sm text-neutral-500 sm:flex-row">
        <p className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-0 w-0 border-x-[5px] border-b-[9px] border-x-transparent border-b-neutral-900"
          />
          <span className="font-medium text-neutral-700">cdesign</span>
          <span className="text-neutral-400">·</span>
          install a design language in one line
        </p>
        <div className="flex items-center gap-5">
          <Link href="/" className="transition-colors hover:text-neutral-900">
            Designs
          </Link>
          <Link href="/topics" className="transition-colors hover:text-neutral-900">
            Topics
          </Link>
          <Link href="/create" className="transition-colors hover:text-neutral-900">
            Create
          </Link>
        </div>
      </div>
    </footer>
  );
}

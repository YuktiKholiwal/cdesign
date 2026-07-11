import Link from "next/link";

/**
 * Geist button system (design.md → Components). Solid `gray-1000` primary,
 * white secondary with a translucent hairline border, transparent tertiary,
 * and a destructive variant — all 6px radius, medium-weight labels, with the
 * spec's two-layer focus ring. Heights: sm 32, md 40, lg 48.
 */
type Variant = "primary" | "secondary" | "tertiary" | "error";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50";

const sizes: Record<Size, string> = {
  sm: "h-8 px-2.5 text-[13px]",
  md: "h-10 px-3.5 text-sm",
  lg: "h-12 px-4 text-[15px]",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300",
  secondary:
    "border border-black/[0.08] bg-white text-neutral-900 hover:border-black/20 hover:bg-neutral-50 dark:border-white/[0.12] dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-white/25 dark:hover:bg-neutral-800",
  tertiary:
    "text-neutral-900 hover:bg-black/[0.05] dark:text-neutral-100 dark:hover:bg-white/[0.06]",
  error: "bg-danger text-white hover:opacity-90",
};

export function buttonClass(
  variant: Variant = "primary",
  size: Size = "md",
  extra = "",
): string {
  return `${base} ${sizes[size]} ${variants[variant]} ${extra}`.trim();
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant,
  size,
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  children,
  href,
  ...rest
}: CommonProps &
  { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  >) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}

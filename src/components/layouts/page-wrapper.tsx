import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div
      className={cn(
        "min-h-screen w-full flex flex-col items-center justify-center",
        "bg-zinc-50 dark:bg-zinc-950",
        className
      )}
    >
      <main className="w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>
    </div>
  );
}

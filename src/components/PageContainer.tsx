import type { ReactNode } from "react";

type PageContainerProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

export function PageContainer({ title, subtitle, children }: PageContainerProps) {
  return (
    <div className="flex min-h-screen flex-col bg-black/80 text-zinc-50">
      <main className="bg-grid relative mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden px-4 pb-12 pt-8 sm:rounded-3xl sm:border sm:border-cyan-400/15 sm:px-8 sm:pt-10 sm:shadow-[0_0_60px_rgba(34,211,238,0.20)]">
        <div className="pointer-events-none absolute -left-40 -top-40 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-32 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
        {title ? (
          <header className="relative mb-8 space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-cyan-300/80">
              Bitcoin · Learning Path
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
                {subtitle}
              </p>
            ) : null}
          </header>
        ) : null}
        <div className="relative">{children}</div>
      </main>
    </div>
  );
}



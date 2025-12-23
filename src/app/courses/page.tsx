import Link from "next/link";

export default function CoursesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 space-y-6">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.25em] text-orange-300/80">
          Courses
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl lg:text-5xl">
          Bitcoin Foundations (Genesis)
        </h1>
        <p className="text-base text-zinc-300">
          Open course materials (CC-BY-SA-4.0) organized in this repository,
          inspired by the lnbook structure.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-zinc-50">Repository content</h2>
        <ul className="list-disc space-y-2 pl-5 text-zinc-300">
          <li>
            <span className="font-medium text-zinc-100">Content folder:</span>{" "}
            <code className="text-sm text-orange-200">content/courses/genesis</code>
          </li>
          <li>
            <span className="font-medium text-zinc-100">Chapters:</span>{" "}
            <code className="text-sm text-orange-200">content/courses/genesis/chapters</code>
          </li>
          <li>
            <span className="font-medium text-zinc-100">Images:</span>{" "}
            <code className="text-sm text-orange-200">content/courses/genesis/images/</code>{" "}
            (place provided assets with referenced filenames)
          </li>
          <li>
            <span className="font-medium text-zinc-100">License:</span> CC-BY-SA-4.0
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-zinc-50">Quick links</h2>
        <div className="space-y-2">
          <Link
            href="https://github.com/Joie199/pan-africa-bitcoin-academy/tree/main/content/courses/genesis"
            className="inline-flex items-center gap-2 rounded-lg border border-orange-400/40 px-4 py-2 text-sm font-semibold text-orange-200 transition hover:border-orange-400/70 hover:bg-orange-400/10"
          >
            View course folder on GitHub
          </Link>
          <div className="text-sm text-zinc-400">
            Use the markdown files directly or integrate them into the site rendering pipeline.
          </div>
        </div>
      </section>
    </div>
  );
}


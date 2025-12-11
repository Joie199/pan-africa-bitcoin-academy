import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/PageContainer";
import { getChapterBySlug, chaptersContent } from "@/content/chaptersContent";
import { ChapterAccessCheck } from "./ChapterAccessCheck";
import { ChapterCompletionTracker } from "./ChapterCompletionTracker";

type ChapterPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }
  const chapter = getChapterBySlug(slug);

  if (!chapter) {
    const titleFromSlug = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return (
      <PageContainer
        title={`Chapter: ${titleFromSlug}`}
        subtitle="This chapter is part of the Pan-Africa Bitcoin Academy curriculum. Full content coming soon."
      >
        <div className="space-y-8 text-sm text-zinc-100 sm:text-base">
          <section className="rounded-xl border border-orange-500/25 bg-zinc-950/80 p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-orange-200 sm:text-base">
              Chapter Content
            </h2>
            <p className="mt-2 text-sm text-zinc-200">
              This chapter is being developed. Please check back soon for the full lesson content.
            </p>
          </section>
        </div>
      </PageContainer>
    );
  }

  const nextChapter =
    chapter.nextSlug && chaptersContent.find((c) => c.slug === chapter.nextSlug);
  
  const previousChapter = chapter.number > 1
    ? chaptersContent.find((c) => c.number === chapter.number - 1)
    : null;

  return (
    <ChapterAccessCheck chapterNumber={chapter.number} chapterSlug={chapter.slug}>
      <ChapterCompletionTracker chapterNumber={chapter.number} chapterSlug={chapter.slug} />
      <PageContainer
      title={`${chapter.number < 10 ? `Chapter ${chapter.number}` : `Chapter ${chapter.number}`} · ${chapter.title}`}
      subtitle={`${chapter.level} · ${chapter.duration} · ${chapter.type}`}
    >
      <div className="space-y-8 text-sm text-zinc-100 sm:text-base">
        {/* Hero */}
        <section className="rounded-xl border border-orange-500/25 bg-zinc-950/80 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.12em] text-cyan-300/90">
                <span className="rounded-full border border-cyan-400/40 px-2 py-0.5">
                  {chapter.level}
                </span>
                <span className="rounded-full border border-orange-400/40 px-2 py-0.5">
                  {chapter.type}
                </span>
                <span className="rounded-full border border-purple-400/40 px-2 py-0.5">
                  {chapter.duration}
                </span>
              </div>
              <p className="text-lg font-semibold text-orange-100 sm:text-xl">
                {chapter.hook}
              </p>
            </div>
            <div className="flex gap-2">
              {previousChapter ? (
                <Link
                  href={`/chapters/${previousChapter.slug}`}
                  className="inline-flex items-center justify-center rounded-lg border border-purple-400/40 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-200 transition hover:border-purple-400/70 hover:bg-purple-500/20"
                >
                  ← Chapter {previousChapter.number}
                </Link>
              ) : null}
              {nextChapter ? (
                <Link
                  href={`/chapters/${nextChapter.slug}`}
                  className="inline-flex items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400/70 hover:bg-cyan-500/20"
                >
                  Chapter {nextChapter.number} →
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        {/* What you will learn */}
        <section className="rounded-xl border border-cyan-400/25 bg-black/70 p-5 sm:p-6">
          <h2 className="text-base font-semibold text-cyan-200 sm:text-lg">
            What You Will Learn
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-zinc-200">
            {chapter.learn.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Main lesson content */}
        <section className="space-y-4 rounded-xl border border-orange-400/25 bg-zinc-950/70 p-5 sm:p-6">
          <h2 className="text-base font-semibold text-orange-200 sm:text-lg">
            Main Lesson Content
          </h2>
          <div className="space-y-5">
            {chapter.sections.map((section, sectionIdx) => {
              const sectionId = `section-${sectionIdx}-${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
              return (
              <div key={section.heading} id={sectionId} className="scroll-mt-20 rounded-lg border-2 border-orange-400/30 bg-gradient-to-br from-black/60 to-zinc-900/40 p-5 shadow-[0_0_20px_rgba(249,115,22,0.1)] hover:border-orange-400/50 transition">
                <h3 className="text-lg font-bold text-orange-200 sm:text-xl mb-3 pb-2 border-b border-orange-400/20">
                  {section.heading}
                </h3>
                {section.paragraphs?.map((p) => (
                  <p key={p} className="mt-2 text-zinc-200">
                    {p}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-zinc-200">
                    {section.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : null}
                {section.callouts?.map((callout, idx) => (
                  <div
                    key={idx}
                    className={`mt-4 rounded-lg border p-3 ${
                      callout.type === "note"
                        ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-100"
                        : callout.type === "tip"
                        ? "border-green-400/30 bg-green-500/10 text-green-100"
                        : callout.type === "warning"
                        ? "border-red-400/30 bg-red-500/10 text-red-100"
                        : "border-orange-400/30 bg-orange-500/10 text-orange-100"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-semibold">
                        {callout.type === "note"
                          ? "📝 Note:"
                          : callout.type === "tip"
                          ? "💡 Tip:"
                          : callout.type === "warning"
                          ? "⚠️ Warning:"
                          : "📖 Example:"}
                      </span>
                      <p className="flex-1 text-sm">{callout.content}</p>
                    </div>
                  </div>
                ))}
                {section.images?.map((image, idx) => (
                  <div key={idx} className="mt-4">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full rounded-lg border border-orange-400/20"
                    />
                    {image.caption && (
                      <p className="mt-2 text-center text-xs text-zinc-400 italic">
                        {image.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              );
            })}
          </div>
        </section>

        {/* Activities */}
        <section className="rounded-xl border border-purple-400/25 bg-zinc-950/70 p-5 sm:p-6">
          <h2 className="text-base font-semibold text-purple-200 sm:text-lg">
            Activities / Exercises
          </h2>
          {chapter.activities.length === 0 ? (
            <p className="mt-2 text-zinc-300">No activities in this chapter.</p>
          ) : (
            <ul className="mt-3 list-disc space-y-2 pl-5 text-zinc-200">
              {chapter.activities.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          )}
        </section>

        {/* Summary */}
        <section className="rounded-xl border border-green-400/25 bg-black/70 p-5 sm:p-6">
          <h2 className="text-base font-semibold text-green-200 sm:text-lg">
            Summary / Key Takeaways
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-zinc-200">
            {chapter.summary.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        {/* Key terms */}
        <section className="rounded-xl border border-cyan-400/20 bg-zinc-950/70 p-5 sm:p-6">
          <h2 className="text-base font-semibold text-cyan-200 sm:text-lg">
            Key Terms
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {chapter.keyTerms.map((term) => {
              // Find the section that mentions this term
              const termLower = term.toLowerCase();
              const relevantSection = chapter.sections.findIndex((section) => {
                const headingLower = section.heading.toLowerCase();
                const contentLower = [
                  ...(section.paragraphs || []),
                  ...(section.bullets || []),
                  ...(section.callouts?.map(c => c.content) || []),
                ].join(' ').toLowerCase();
                return headingLower.includes(termLower) || contentLower.includes(termLower);
              });
              
              const sectionId = relevantSection >= 0 
                ? `section-${relevantSection}-${chapter.sections[relevantSection].heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
                : null;
              
              return sectionId ? (
                <a
                  key={term}
                  href={`#${sectionId}`}
                  className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-100 transition hover:border-cyan-400/50 hover:bg-cyan-500/20 hover:text-cyan-50 cursor-pointer"
                >
                  {term}
                </a>
              ) : (
                <span
                  key={term}
                  className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-100"
                >
                  {term}
                </span>
              );
            })}
          </div>
        </section>

        {/* Navigation CTA */}
        <div className="flex items-center justify-between gap-4">
          {previousChapter ? (
            <Link
              href={`/chapters/${previousChapter.slug}`}
              className="inline-flex items-center justify-center rounded-lg border border-purple-400/50 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-100 transition hover:bg-purple-500/20"
            >
              ← Previous: Chapter {previousChapter.number}
            </Link>
          ) : (
            <Link
              href="/chapters"
              className="inline-flex items-center justify-center rounded-lg border border-cyan-400/50 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
            >
              ← Back to Chapters
            </Link>
          )}
          {nextChapter ? (
            <Link
              href={`/chapters/${nextChapter.slug}`}
              className="inline-flex items-center justify-center rounded-lg border border-orange-400/50 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-100 transition hover:bg-orange-500/20"
            >
              Next: Chapter {nextChapter.number} →
            </Link>
          ) : (
            <Link
              href="/chapters"
              className="inline-flex items-center justify-center rounded-lg border border-cyan-400/50 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
            >
              Back to Chapters →
            </Link>
          )}
        </div>
      </div>
    </PageContainer>
    </ChapterAccessCheck>
  );
}

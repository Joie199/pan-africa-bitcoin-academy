import Link from "next/link";
import { PageContainer } from "@/components/PageContainer";

const chapters = [
  { slug: "what-is-bitcoin", title: "What is Bitcoin?", level: "Beginner" },
  { slug: "keys-addresses-utxos", title: "Keys, Addresses, UTXOs", level: "Beginner" },
  { slug: "transactions-and-mempool", title: "Transactions & Mempool", level: "Intermediate" },
  { slug: "blocks-and-mining", title: "Blocks & Mining", level: "Intermediate" },
  { slug: "wallet-recovery", title: "Wallet Recovery", level: "Practical" },
  {
    slug: "bitcoin-trading-and-risk",
    title: "Bitcoin Trading & Risk",
    level: "Caution",
  },
];

export default function ChaptersPage() {
  return (
    <PageContainer
      title="Chapters"
      subtitle="Work through the lessons in order, or jump directly to the topic you care about most."
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {chapters.map((chapter, index) => (
            <Link
              key={chapter.slug}
              href={`/chapters/${chapter.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-cyan-400/25 bg-black/80 p-4 text-sm text-zinc-100 shadow-[0_0_40px_rgba(34,211,238,0.25)] transition hover:border-cyan-300/80 hover:bg-zinc-950"
            >
              <div className="space-y-2">
                <p className="text-xs font-medium text-cyan-300">
                  Chapter {index + 1} · {chapter.level}
                </p>
                <h2 className="text-base font-semibold group-hover:text-cyan-100">
                  {chapter.title}
                </h2>
                <p className="text-xs text-zinc-400">
                  Short, focused lesson with diagrams, key terms, and a quick recap.
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
                <span>~10–15 min</span>
                <span className="text-cyan-300">View chapter →</span>
              </div>
            </Link>
          ))}
        </div>
        <p className="text-xs text-zinc-500">
          Coming later: topic filters (Beginner / Advanced), progress tracking, and mini
          quizzes for each chapter.
        </p>
      </div>
    </PageContainer>
  );
}



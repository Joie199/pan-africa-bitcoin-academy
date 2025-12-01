import { PageContainer } from "@/components/PageContainer";

export default function AboutPage() {
  return (
    <PageContainer
      title="About this Bitcoin learning project"
      subtitle="Why this site exists, who it’s for, and how to get the most out of it."
    >
      <div className="space-y-8 text-sm text-zinc-100 sm:text-base">
        <section className="space-y-3">
          <p className="text-zinc-200">
            This project is designed to be a calm, practical space to understand Bitcoin
            from first principles. The focus is on how the system actually works: keys,
            UTXOs, transactions, blocks, mining, and safe wallet practices.
          </p>
          <p className="text-zinc-400">
            It was created by{" "}
            <a
              href="https://github.com/Joie199"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-cyan-300 hover:text-cyan-200"
            >
              Joie
            </a>{" "}
            as part of a broader effort to build a Bitcoin innovation hub and make
            high-quality Bitcoin education more accessible.
          </p>
          <p className="text-zinc-300">
            Each chapter is meant to stand on its own, but you&apos;ll get the most out
            of it by working through them in order, taking notes, and trying the commands
            on regtest/testnet where possible.
          </p>
        </section>

        <section className="rounded-xl border border-cyan-400/25 bg-black/80 p-4 sm:p-5 shadow-[0_0_40px_rgba(34,211,238,0.3)]">
          <h2 className="text-sm font-semibold text-orange-200 sm:text-base">
            A note on Bitcoin trading
          </h2>
          <p className="mt-2 text-zinc-200">
            There is a dedicated chapter on Bitcoin trading and risk, but it is{" "}
            <span className="font-semibold text-orange-300">not</span> trading advice.
            It explains how trading works at a high level, the role of leverage and
            derivatives, and why risk management and emotional control are crucial.
          </p>
          <p className="mt-2 text-xs text-zinc-400 sm:text-sm">
            Nothing on this site is financial advice. If you ever choose to trade, only
            use money you can afford to lose, be skeptical of paid signal groups, and
            remember that no one can reliably predict short-term price moves.
          </p>
        </section>

        <section className="rounded-xl border border-orange-500/20 bg-zinc-950/70 p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-orange-200 sm:text-base">
            Who this is for
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-200">
            <li>Developers who want a clear mental model of Bitcoin internals</li>
            <li>Curious users who want to understand wallets, fees, and recovery</li>
            <li>Educators who need structured, reusable lesson material</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-orange-200 sm:text-base">
            Contact & next steps
          </h2>
          <p className="text-zinc-300">
            This is an evolving project. Over time, it will grow to include quizzes,
            interactive regtest demos, a glossary, and translated content (including
            French). If you&apos;re reading this in development, you can now start
            wiring up real content, diagrams, and interactive examples.
          </p>
        </section>
      </div>
    </PageContainer>
  );
}



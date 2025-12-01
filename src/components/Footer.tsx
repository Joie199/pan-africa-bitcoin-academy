export function Footer() {
  return (
    <footer className="border-t border-cyan-400/15 bg-black/80 text-[11px] text-zinc-500 backdrop-blur-xl sm:text-xs">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          Built by{" "}
          <a
            href="https://github.com/Joie199"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-cyan-300 hover:text-cyan-200"
          >
            Joie
          </a>{" "}
          for curious minds exploring <span className="font-semibold text-cyan-300">Bitcoin</span>.
        </p>
        <p className="text-[10px] text-zinc-500 sm:text-[11px]">
          Educational only. Not financial advice. Practice on testnet/regtest, never with
          money you can&apos;t lose.
        </p>
      </div>
    </footer>
  );
}



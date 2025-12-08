// Bitcoin "B" Logo - Elegant futuristic style
export function BitcoinIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`${className} relative inline-flex items-center justify-center`} style={{ width: '1.5em', height: '1.5em' }}>
      {/* Glowing diamond outline behind */}
      <div className="absolute inset-0" style={{ transform: 'rotate(45deg) scale(1.3)' }}>
        <div className="w-full h-full border-2 border-orange-400/40 rounded-lg" style={{ 
          boxShadow: '0 0 20px rgba(249, 115, 22, 0.3), 0 0 40px rgba(249, 115, 22, 0.15)'
        }} />
      </div>
      
      {/* Orange square background */}
      <div className="relative z-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center w-full h-full" style={{ 
        boxShadow: '0 0 15px rgba(249, 115, 22, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}>
        {/* Elegant B with refined typography */}
        <span className="text-black font-black leading-none select-none" style={{ 
          fontSize: '0.9em',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.02em',
          lineHeight: '1'
        }}>
          B
        </span>
      </div>
    </div>
  );
}

// Public/Private Keys Icon
export function KeysIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      {/* Public Key - Lock open */}
      <rect x="3" y="11" width="8" height="10" rx="1" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      {/* Private Key - Lock closed */}
      <rect x="13" y="11" width="8" height="10" rx="1" />
      <circle cx="17" cy="16" r="1.5" />
      <path d="M13 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// Blockchain Blocks Icon
export function BlockchainIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Connected blocks */}
      <rect x="2" y="8" width="6" height="6" rx="0.5" />
      <rect x="9" y="8" width="6" height="6" rx="0.5" />
      <rect x="16" y="8" width="6" height="6" rx="0.5" />
      <rect x="2" y="2" width="6" height="6" rx="0.5" />
      <rect x="9" y="2" width="6" height="6" rx="0.5" />
      <rect x="16" y="2" width="6" height="6" rx="0.5" />
      {/* Connection lines */}
      <line x1="8" y1="11" x2="9" y2="11" />
      <line x1="15" y1="11" x2="16" y2="11" />
      <line x1="8" y1="5" x2="9" y2="5" />
      <line x1="15" y1="5" x2="16" y2="5" />
      <line x1="5" y1="8" x2="5" y2="2" />
      <line x1="12" y1="8" x2="12" y2="2" />
      <line x1="19" y1="8" x2="19" y2="2" />
    </svg>
  );
}

// Wallet Icon - Bitcoin wallet style
export function WalletIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M2 10h20" />
      <circle cx="17" cy="12" r="2" />
      <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
      {/* Small Bitcoin B inside */}
      <path d="M10 13h2a1 1 0 0 0 0-2h-2v-1h2a1 1 0 0 0 0-2h-2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2a1 1 0 0 0 0-2h-2v-1z" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

// Lightning Network Icon
export function LightningIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
    </svg>
  );
}

// UTXO Icon - Coins/Outputs
export function UTXOIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="8" cy="8" r="4" />
      <circle cx="16" cy="8" r="4" />
      <circle cx="8" cy="16" r="4" />
      <circle cx="16" cy="16" r="4" />
      {/* Connection lines */}
      <line x1="10" y1="8" x2="14" y2="8" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <line x1="16" y1="10" x2="16" y2="14" />
    </svg>
  );
}

// Transaction Icon
export function TransactionIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M2 12h20" />
      <circle cx="12" cy="12" r="3" />
      <path d="M7 7l10 10M17 7l-10 10" />
    </svg>
  );
}

// Mining Icon
export function MiningIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h6" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}

// Book/Theory Icon
export function BookIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

// Tool/Practice Icon
export function ToolIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}


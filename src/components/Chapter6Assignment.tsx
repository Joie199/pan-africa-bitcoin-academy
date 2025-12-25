'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSession } from '@/hooks/useSession';

interface Chapter6AssignmentProps {
  assignmentId: string;
}

export function Chapter6Assignment({ assignmentId }: Chapter6AssignmentProps) {
  const { profile, isAuthenticated } = useAuth();
  const { isAuthenticated: isAdminAuth, email: adminEmail, loading: adminLoading } = useSession('admin');
  const [onChainAddress, setOnChainAddress] = useState('');
  const [onChainAddressType, setOnChainAddressType] = useState('');
  const [onChainNetwork, setOnChainNetwork] = useState('');
  const [lightningInvoice, setLightningInvoice] = useState('');
  const [lightningAmount, setLightningAmount] = useState('');
  const [lightningExpiry, setLightningExpiry] = useState('');
  
  // Part B
  const [validationOnChain, setValidationOnChain] = useState('');
  const [validationLightning, setValidationLightning] = useState('');
  const [reflection, setReflection] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ((isAuthenticated && profile?.email) || (isAdminAuth && adminEmail)) {
      checkSubmissionStatus();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, profile, isAdminAuth, adminEmail]);

  const checkSubmissionStatus = async () => {
    try {
      setLoading(true);
      const email = isAdminAuth && adminEmail ? adminEmail : profile?.email;
      if (!email) return;
      
      const response = await fetch(`/api/assignments?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        const thisAssignment = data.assignments?.find((a: any) => a.id === assignmentId);
        if (thisAssignment?.submission) {
          setSubmissionStatus(thisAssignment.submission);
          setSubmitted(true);
          if (thisAssignment.submission.answer) {
            try {
              const answerData = JSON.parse(thisAssignment.submission.answer);
              setOnChainAddress(answerData.onChainAddress || '');
              setOnChainAddressType(answerData.onChainAddressType || '');
              setOnChainNetwork(answerData.onChainNetwork || '');
              setLightningInvoice(answerData.lightningInvoice || '');
              setLightningAmount(answerData.lightningAmount || '');
              setLightningExpiry(answerData.lightningExpiry || '');
              setValidationOnChain(answerData.validationOnChain || '');
              setValidationLightning(answerData.validationLightning || '');
              setReflection(answerData.reflection || '');
            } catch (e) {
              // Legacy format, ignore
            }
          }
        }
      }
    } catch (err) {
      console.error('Error checking submission status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = isAdminAuth && adminEmail ? adminEmail : profile?.email;
    if ((!isAuthenticated && !isAdminAuth) || !email) {
      setError('Please log in to submit your assignment.');
      return;
    }

    if (!onChainAddress || !onChainAddressType || !onChainNetwork || !lightningInvoice || !validationOnChain || !validationLightning || !reflection.trim()) {
      setError('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const answerData = {
        partA: {
          onChainAddress,
          onChainAddressType,
          onChainNetwork,
          lightningInvoice,
          lightningAmount,
          lightningExpiry,
        },
        partB: {
          validationOnChain,
          validationLightning,
        },
        reflection,
      };

      const response = await fetch('/api/assignments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          assignmentId,
          answer: JSON.stringify(answerData),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit assignment');
      }

      setSubmitted(true);
      setSubmissionStatus(data.submission);
    } catch (err: any) {
      setError(err.message || 'Failed to submit assignment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || adminLoading) {
    return (
      <div className="rounded-lg border border-zinc-800/60 bg-zinc-950 p-5">
        <div className="animate-pulse">
          <div className="h-6 bg-zinc-800 rounded w-3/4 mb-4"></div>
          <div className="h-32 bg-zinc-800 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isAdminAuth) {
    return (
      <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
        <p className="text-zinc-400">Please log in to view and complete this assignment.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800/60 bg-zinc-950 p-5 shadow-inner space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-zinc-100 mb-2">Assignment: Create & Validate Bitcoin Addresses</h3>
        <p className="text-sm text-zinc-400 mb-4">Deliverable: Short paragraph + validation results | Reward: TBD (after instructor review)</p>
      </div>

      {submitted && submissionStatus ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-900/20 border border-green-800/50 rounded-lg">
            <p className="text-green-200 font-medium mb-2">✓ Assignment Submitted</p>
            <p className="text-sm text-zinc-300 mb-3">Your submission is under instructor review.</p>
            {submissionStatus.status === 'graded' && submissionStatus.is_correct && (
              <p className="text-sm text-green-300 font-medium">✓ Approved!</p>
            )}
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setSubmissionStatus(null);
            }}
            className="text-sm text-cyan-400 hover:text-cyan-300 underline"
          >
            Edit Submission
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Part A */}
          <div className="space-y-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
            <h4 className="text-base font-semibold text-zinc-200">Part A — Create Addresses</h4>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                1. Create one on-chain receive address
              </label>
              <input
                type="text"
                value={onChainAddress}
                onChange={(e) => setOnChainAddress(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition font-mono text-sm"
                placeholder="bc1... or 1... or 3..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Address type
                </label>
                <select
                  value={onChainAddressType}
                  onChange={(e) => setOnChainAddressType(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
                  required
                >
                  <option value="">Select type</option>
                  <option value="bc1 (SegWit/bech32)">bc1... (SegWit/bech32)</option>
                  <option value="Legacy (P2PKH)">Legacy (P2PKH)</option>
                  <option value="P2SH">P2SH (3...)</option>
                  <option value="Taproot (P2TR)">Taproot (bc1p...)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Network
                </label>
                <select
                  value={onChainNetwork}
                  onChange={(e) => setOnChainNetwork(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
                  required
                >
                  <option value="">Select network</option>
                  <option value="Mainnet">Mainnet</option>
                  <option value="Testnet">Testnet</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                2. Create one Lightning receive request
              </label>
              <input
                type="text"
                value={lightningInvoice}
                onChange={(e) => setLightningInvoice(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition font-mono text-sm"
                placeholder="lnbc1... or Lightning address"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Invoice amount (can be zero)
                </label>
                <input
                  type="text"
                  value={lightningAmount}
                  onChange={(e) => setLightningAmount(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
                  placeholder="e.g., 1000 sats or 0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Expiry time
                </label>
                <input
                  type="text"
                  value={lightningExpiry}
                  onChange={(e) => setLightningExpiry(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
                  placeholder="e.g., 1 hour, 1 day"
                />
              </div>
            </div>
          </div>

          {/* Part B */}
          <div className="space-y-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
            <h4 className="text-base font-semibold text-zinc-200">Part B — Address Validation (Critical Thinking)</h4>
            <p className="text-sm text-zinc-400">For each input: Paste the correct address first, then paste an incorrect address (e.g., Lightning invoice in on-chain field, Testnet address marked as mainnet, invalid checksum).</p>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Input 1: On-chain address field
              </label>
              <textarea
                value={validationOnChain}
                onChange={(e) => setValidationOnChain(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition font-mono text-sm"
                placeholder="Paste correct on-chain address, then incorrect address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Input 2: Lightning address / invoice field
              </label>
              <textarea
                value={validationLightning}
                onChange={(e) => setValidationLightning(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition font-mono text-sm"
                placeholder="Paste correct Lightning invoice, then incorrect address"
                required
              />
            </div>
          </div>

          {/* Reflection */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Reflection: What did you learn from this exercise?
            </label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition resize-none"
              placeholder="Write your reflection..."
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-800/50 rounded-lg">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-orange-500 px-6 py-3 font-semibold text-black transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Assignment'}
          </button>
        </form>
      )}
    </div>
  );
}


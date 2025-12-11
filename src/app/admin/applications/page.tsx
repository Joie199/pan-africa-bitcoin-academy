'use client';

import { useState, useEffect } from 'react';

interface Application {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  experience_level: string | null;
  preferred_cohort_id: string | null;
  status: string;
  created_at: string;
  birth_date: string | null;
}

interface Cohort {
  id: string;
  name: string;
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [cohorts, setCohorts] = useState<Record<string, Cohort>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
    fetchCohorts();
  }, [filter]);

  const fetchCohorts = async () => {
    try {
      const res = await fetch('/api/cohorts');
      const data = await res.json();
      if (data.cohorts) {
        const cohortMap: Record<string, Cohort> = {};
        data.cohorts.forEach((c: Cohort) => {
          cohortMap[c.id] = c;
        });
        setCohorts(cohortMap);
      }
    } catch (err) {
      console.error('Error fetching cohorts:', err);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      // Note: You'll need to create an API endpoint to fetch applications
      // For now, this is a placeholder - you can query directly from Supabase
      const res = await fetch('/api/admin/applications');
      if (!res.ok) {
        throw new Error('Failed to fetch applications');
      }
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError(err.message || 'Failed to load applications');
      // Fallback: Show instructions
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId: string, email: string) => {
    if (!confirm(`Approve application for ${email}?`)) return;

    setProcessing(applicationId);
    try {
      const res = await fetch('/api/applications/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert(`Application approved! Send this link to the user:\n\n/setup-password?email=${encodeURIComponent(email)}`);
        fetchApplications(); // Refresh list
      } else {
        alert(`Error: ${data.error || 'Failed to approve application'}`);
      }
    } catch (err: any) {
      console.error('Error approving application:', err);
      alert(`Error: ${err.message || 'Failed to approve application'}`);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (applicationId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    setProcessing(applicationId);
    try {
      const res = await fetch('/api/applications/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, rejectedReason: reason }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert('Application rejected');
        fetchApplications(); // Refresh list
      } else {
        alert(`Error: ${data.error || 'Failed to reject application'}`);
      }
    } catch (err: any) {
      console.error('Error rejecting application:', err);
      alert(`Error: ${err.message || 'Failed to reject application'}`);
    } finally {
      setProcessing(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === 'all') return true;
    return app.status.toLowerCase() === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'rejected':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      default:
        return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30';
    }
  };

  if (loading && applications.length === 0) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center text-zinc-400">Loading applications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-zinc-50">Application Management</h1>
          
          {/* Filter Buttons */}
          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filter === f
                    ? 'bg-cyan-400 text-black'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)} ({applications.filter(a => f === 'all' ? true : a.status.toLowerCase() === f).length})
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            <p className="font-semibold">Error loading applications</p>
            <p className="text-sm">{error}</p>
            <p className="mt-2 text-xs">
              <strong>Note:</strong> You need to create an API endpoint at <code>/api/admin/applications</code> to fetch applications.
              <br />
              For now, you can approve applications directly from Supabase or use the browser console method (see HOW_TO_APPROVE_APPLICATIONS.md).
            </p>
          </div>
        )}

        {filteredApplications.length === 0 ? (
          <div className="rounded-lg border border-zinc-700 bg-zinc-900/50 p-8 text-center text-zinc-400">
            No {filter !== 'all' ? filter : ''} applications found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="rounded-lg border border-zinc-700 bg-zinc-900/50 p-6"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-50">
                      {app.first_name} {app.last_name}
                    </h3>
                    <p className="text-sm text-zinc-400">{app.email}</p>
                    {app.phone && <p className="text-sm text-zinc-400">{app.phone}</p>}
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(app.status)}`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                  {app.country && (
                    <div>
                      <span className="text-zinc-400">Country:</span>{' '}
                      <span className="text-zinc-200">{app.country}</span>
                    </div>
                  )}
                  {app.city && (
                    <div>
                      <span className="text-zinc-400">City:</span>{' '}
                      <span className="text-zinc-200">{app.city}</span>
                    </div>
                  )}
                  {app.experience_level && (
                    <div>
                      <span className="text-zinc-400">Experience:</span>{' '}
                      <span className="text-zinc-200 capitalize">{app.experience_level}</span>
                    </div>
                  )}
                  {app.preferred_cohort_id && cohorts[app.preferred_cohort_id] && (
                    <div>
                      <span className="text-zinc-400">Cohort:</span>{' '}
                      <span className="text-zinc-200">{cohorts[app.preferred_cohort_id].name}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-zinc-400">Applied:</span>{' '}
                    <span className="text-zinc-200">
                      {new Date(app.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {app.status.toLowerCase() === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(app.id, app.email)}
                      disabled={processing === app.id}
                      className="rounded-lg bg-green-500/20 px-4 py-2 text-sm font-medium text-green-400 transition hover:bg-green-500/30 disabled:opacity-50"
                    >
                      {processing === app.id ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(app.id)}
                      disabled={processing === app.id}
                      className="rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/30 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {app.status.toLowerCase() === 'approved' && (
                  <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm">
                    <p className="text-green-300">
                      Send password setup link to user:
                    </p>
                    <code className="mt-1 block text-xs text-green-200">
                      /setup-password?email={encodeURIComponent(app.email)}
                    </code>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


/**
 * Resource hints component for preconnect and dns-prefetch
 * Helps establish connections early to reduce critical request chains
 */

export function ResourceHints() {
  // Extract Supabase origin from URL for preconnect
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let supabaseOrigin: string | null = null;
  
  try {
    if (supabaseUrl) {
      supabaseOrigin = new URL(supabaseUrl).origin;
    }
  } catch {
    // Invalid URL, skip preconnect
  }

  return (
    <>
      {/* Preconnect to Supabase - critical for API calls (highest priority) */}
      {supabaseOrigin && (
        <>
          <link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" />
          <link rel="dns-prefetch" href={supabaseOrigin} />
        </>
      )}
      
      {/* DNS-prefetch for Google Fonts (Next.js may self-host, but prefetch doesn't hurt) */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
    </>
  );
}


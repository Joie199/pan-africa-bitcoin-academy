import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { requireAdmin, attachRefresh } from '@/lib/adminSession';

/**
 * Get sessions for a student (filtered by their enrolled cohorts)
 * GET /api/sessions?email=student@example.com
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const isAdmin = searchParams.get('admin') === 'true';

    // Admin can see all sessions
    if (isAdmin) {
      const session = requireAdmin(request);
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { data: sessions, error } = await supabaseAdmin
        .from('cohort_sessions')
        .select(`
          *,
          cohorts (
            id,
            name,
            level,
            status
          )
        `)
        .order('session_date', { ascending: true })
        .order('session_number', { ascending: true });

      if (error) {
        console.error('Error fetching sessions:', error);
        return NextResponse.json(
          { error: 'Failed to fetch sessions', details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ sessions: sessions || [] }, { status: 200 });
    }

    // Student: fetch sessions for their enrolled cohorts only
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required for student access' },
        { status: 400 }
      );
    }

    // Get student's profile to find enrolled cohorts
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Get enrolled cohort IDs
    const { data: enrollments, error: enrollmentError } = await supabase
      .from('cohort_enrollment')
      .select('cohort_id')
      .eq('student_id', profile.id);

    if (enrollmentError) {
      console.error('Error fetching enrollments:', enrollmentError);
      return NextResponse.json(
        { error: 'Failed to fetch enrollments' },
        { status: 500 }
      );
    }

    if (!enrollments || enrollments.length === 0) {
      return NextResponse.json({ sessions: [] }, { status: 200 });
    }

    const cohortIds = enrollments.map((e) => e.cohort_id);

    // Fetch sessions for enrolled cohorts
    const { data: sessions, error: sessionsError } = await supabase
      .from('cohort_sessions')
      .select(`
        *,
        cohorts (
          id,
          name,
          level,
          status
        )
      `)
      .in('cohort_id', cohortIds)
      .order('session_date', { ascending: true })
      .order('session_number', { ascending: true });

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
      return NextResponse.json(
        { error: 'Failed to fetch sessions', details: sessionsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ sessions: sessions || [] }, { status: 200 });
  } catch (error: any) {
    console.error('Error in sessions API:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' ? { details: error.message } : {}),
      },
      { status: 500 }
    );
  }
}

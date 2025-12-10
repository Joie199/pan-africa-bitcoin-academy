import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch cohorts with enrollment counts
    const { data: cohorts, error: cohortsError } = await supabase
      .from('cohorts')
      .select('*')
      .order('start_date', { ascending: true });

    if (cohortsError) {
      console.error('Error fetching cohorts:', cohortsError);
      return NextResponse.json(
        { error: 'Failed to fetch cohorts', details: cohortsError.message },
        { status: 500 }
      );
    }

    // For each cohort, count enrolled students
    const cohortsWithSeats = await Promise.all(
      (cohorts || []).map(async (cohort: any) => {
        const { count, error: countError } = await supabase
          .from('cohort_enrollment')
          .select('*', { count: 'exact', head: true })
          .eq('cohort_id', cohort.id);

        const enrolled = count || 0;
        const available = Math.max(0, (cohort.seats_total || 0) - enrolled);

        return {
          id: cohort.id,
          name: cohort.name || 'Unnamed Cohort',
          startDate: cohort.start_date || null,
          endDate: cohort.end_date || null,
          status: cohort.status || 'Upcoming',
          sessions: cohort.sessions || 0,
          level: cohort.level || 'Beginner',
          seats: cohort.seats_total || 0,
          available: available,
          enrolled: enrolled,
        };
      })
    );

    return NextResponse.json({ cohorts: cohortsWithSeats }, { status: 200 });
  } catch (error: any) {
    console.error('Error in cohorts API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}


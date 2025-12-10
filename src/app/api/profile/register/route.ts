import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, cohortNumber, cohortName } = await req.json();

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'firstName, lastName, and email are required' },
        { status: 400 }
      );
    }

    // Determine cohort index and year for student ID
    const cohortIdx = Number.parseInt(cohortNumber ?? '1', 10) || 1;
    const year = new Date().getFullYear();

    // Count existing registrations in this cohort to derive roll number
    let roll = 1;
    try {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('cohort_id', cohortName || `Cohort ${cohortIdx}`);

      // If cohort exists, count enrollments
      const { data: cohortData } = await supabase
        .from('cohorts')
        .select('id')
        .eq('name', cohortName || `Cohort ${cohortIdx}`)
        .limit(1)
        .single();

      if (cohortData) {
        const { count: enrollmentCount } = await supabase
          .from('cohort_enrollment')
          .select('*', { count: 'exact', head: true })
          .eq('cohort_id', cohortData.id);

        roll = (enrollmentCount || 0) + 1;
      } else {
        roll = (count || 0) + 1;
      }
    } catch {
      // fallback to roll = 1
    }

    const studentId = `${cohortIdx}/${roll}/${year}`;

    // Find or create cohort
    let cohortId = null;
    if (cohortName) {
      const { data: existingCohort } = await supabase
        .from('cohorts')
        .select('id')
        .eq('name', cohortName)
        .limit(1)
        .single();

      if (existingCohort) {
        cohortId = existingCohort.id;
      }
    }

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        name: `${firstName} ${lastName}`.trim(),
        email: email.toLowerCase().trim(),
        student_id: studentId,
        status: 'New',
        cohort_id: cohortId,
      })
      .select()
      .single();

    if (profileError) {
      console.error('Error creating profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to create profile', details: profileError.message },
        { status: 500 }
      );
    }

    // Create student record
    await supabase.from('students').insert({
      profile_id: profile.id,
      progress_percent: 0,
      assignments_completed: 0,
      projects_completed: 0,
      live_sessions_attended: 0,
    });

    // If cohort exists, enroll the student
    if (cohortId) {
      await supabase.from('cohort_enrollment').insert({
        cohort_id: cohortId,
        student_id: profile.id,
      });
    }

    return NextResponse.json(
      { success: true, profileId: profile.id, studentId },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in profile register API:', error);
    return NextResponse.json(
      { error: 'Failed to create profile', details: error.message },
      { status: 500 }
    );
  }
}


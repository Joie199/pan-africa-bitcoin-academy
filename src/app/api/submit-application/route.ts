import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      country,
      city,
      experienceLevel,
      preferredCohort,
    } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'firstName, lastName, and email are required' },
        { status: 400 }
      );
    }

    // Find cohort by name if provided
    let cohortId = null;
    if (preferredCohort) {
      const { data: cohort } = await supabase
        .from('cohorts')
        .select('id')
        .eq('name', preferredCohort)
        .limit(1)
        .single();

      if (cohort) {
        cohortId = cohort.id;
      }
    }

    // Create application
    const { data: application, error } = await supabase
      .from('applications')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase().trim(),
        phone: phone || null,
        country: country || null,
        city: city || null,
        experience_level: experienceLevel || null,
        preferred_cohort_id: cohortId,
        status: 'Pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating application:', error);
      return NextResponse.json(
        { error: 'Failed to submit application', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, applicationId: application.id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in submit-application API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}


import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch students with their profile data
    const { data: students, error } = await supabase
      .from('students')
      .select(`
        *,
        profiles (
          id,
          name,
          email,
          phone,
          country,
          city,
          status,
          student_id,
          photo_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching students:', error);
      return NextResponse.json(
        { error: 'Failed to fetch students', details: error.message },
        { status: 500 }
      );
    }

    // Transform data to match expected format
    const transformedStudents = (students || []).map((student: any) => {
      const profile = student.profiles || {};
      return {
        id: student.id,
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        country: profile.country || '',
        city: profile.city || '',
        status: profile.status || 'New',
        studentId: profile.student_id || '',
        progress: student.progress_percent || 0,
        assignmentsCompleted: student.assignments_completed || 0,
        projectsCompleted: student.projects_completed || 0,
        liveSessions: student.live_sessions_attended || 0,
        photoUrl: profile.photo_url || null,
      };
    });

    return NextResponse.json({ students: transformedStudents }, { status: 200 });
  } catch (error: any) {
    console.error('Error in students API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}


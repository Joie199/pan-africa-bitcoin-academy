import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email, ...updateData } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Update profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        name: updateData.name,
        phone: updateData.phone,
        country: updateData.country,
        city: updateData.city,
        photo_url: updateData.photoUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('email', email.toLowerCase().trim())
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json(
        { error: 'Failed to update profile', details: error.message },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        profile: {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          country: profile.country,
          city: profile.city,
          studentId: profile.student_id,
          status: profile.status,
          photoUrl: profile.photo_url,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in profile update API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin, attachRefresh } from '@/lib/adminSession';

/**
 * APPROVAL FLOW - Transfer Data from Applications to Students & Profiles
 * 
 * When admin approves an application:
 * 1. STEP 1: Create/Register Profile in profiles table (or update if exists)
 *    - Transfers: name, email, phone, country, city, cohort_id from application
 *    - Sets status: 'Pending Password Setup' (or 'Active' if password exists)
 * 
 * 2. STEP 2: Create/Update Student Record in students table
 *    - Transfers ALL data from application to students table
 *    - This is the main data transfer: applications → students
 *    - Sets status: 'Enrolled'
 * 
 * 3. STEP 3: Update Profile from Student Record
 *    - Syncs profile with student data (students is source of truth)
 *    - Ensures profile has all latest data
 * 
 * 4. STEP 4: Enroll in Cohort
 *    - Creates cohort_enrollment record
 * 
 * 5. STEP 5: Unlock Chapter 1
 *    - Creates chapter_progress record
 * 
 * 6. STEP 6: Update Application Status
 *    - Sets status to 'Approved'
 *    - Links application to profile
 */
export async function POST(req: NextRequest) {
  try {
    const session = requireAdmin(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { applicationId, approvedBy } = await req.json();

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Get the application
    const { data: application, error: appError } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    if (application.status === 'Approved') {
      return NextResponse.json(
        { error: 'Application is already approved' },
        { status: 400 }
      );
    }

    if (application.status === 'Rejected') {
      return NextResponse.json(
        { error: 'Application was rejected and cannot be approved' },
        { status: 400 }
      );
    }

    const emailLower = application.email?.toLowerCase().trim();
    const fullName = `${application.first_name || ''} ${application.last_name || ''}`.trim();

    // Validate required fields
    if (!emailLower) {
      return NextResponse.json(
        { error: 'Application email is missing' },
        { status: 400 }
      );
    }

    if (!fullName || fullName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Application name is missing' },
        { status: 400 }
      );
    }

    // Check if profile already exists
    let profileId: string;
    let isExistingProfile = false;

    const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, status, cohort_id, student_id, phone, country, city, password_hash')
      .eq('email', emailLower)
      .maybeSingle();

    if (profileCheckError && profileCheckError.code !== 'PGRST116') {
      console.error('Error checking for existing profile:', profileCheckError);
      return NextResponse.json(
        { 
          error: 'Failed to check for existing profile', 
          details: profileCheckError.message 
        },
        { status: 500 }
      );
    }

    // Generate student_id if cohort exists and profile doesn't have one
    let generatedStudentId: string | null = null;
    if (application.preferred_cohort_id && !existingProfile?.student_id) {
      // Get cohort info
      const { data: cohort } = await supabaseAdmin
        .from('cohorts')
        .select('id, name')
        .eq('id', application.preferred_cohort_id)
        .maybeSingle();

      if (cohort) {
        // Count students in this cohort to get roll number
        const { count } = await supabaseAdmin
          .from('cohort_enrollment')
          .select('*', { count: 'exact', head: true })
          .eq('cohort_id', application.preferred_cohort_id);

        const rollNumber = (count || 0) + 1; // Next roll number
        const year = new Date().getFullYear();
        
        // Extract cohort number from name (e.g., "Cohort 1" -> 1) or use roll number
        const cohortMatch = cohort.name.match(/\d+/);
        const cohortNumber = cohortMatch ? cohortMatch[0] : rollNumber.toString();
        
        generatedStudentId = `${cohortNumber}/${rollNumber}/${year}`;
      }
    }

    if (existingProfile) {
      // Profile already exists - we'll update it with application data
      profileId = existingProfile.id;
      isExistingProfile = true;
      console.log('Existing profile found, will update with application data:', profileId);
    } else {
      // Create new profile (without password - they'll set it later)
      // Check if student_id already exists (if we're generating one)
      if (generatedStudentId) {
        const { data: existingStudentId } = await supabaseAdmin
          .from('profiles')
          .select('id, email')
          .eq('student_id', generatedStudentId)
          .maybeSingle();
        
        if (existingStudentId) {
          console.error('Student ID already exists:', generatedStudentId, 'for profile:', existingStudentId.email);
          // Generate a new one or use roll number + 1
          const rollNumber = parseInt(generatedStudentId.split('/')[1]) + 1;
          const year = new Date().getFullYear();
          const cohortNumber = generatedStudentId.split('/')[0];
          generatedStudentId = `${cohortNumber}/${rollNumber}/${year}`;
        }
      }

      const profileData: any = {
        name: fullName,
        email: emailLower,
        phone: application.phone || null,
        country: application.country || null,
        city: application.city || null,
        status: 'Pending Password Setup', // Special status until password is set
      };

      // Only add student_id if it's not null
      if (generatedStudentId) {
        profileData.student_id = generatedStudentId;
      }

      // Only add cohort_id if it exists and is valid
      if (application.preferred_cohort_id) {
        const { data: cohortCheck } = await supabaseAdmin
          .from('cohorts')
          .select('id')
          .eq('id', application.preferred_cohort_id)
          .maybeSingle();
        
        if (cohortCheck) {
          profileData.cohort_id = application.preferred_cohort_id;
        }
      }

      // Double-check email doesn't exist (race condition protection)
      const { data: duplicateCheck } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', emailLower)
        .maybeSingle();

      if (duplicateCheck) {
        // Profile was created between our check and now - use existing one
        profileId = duplicateCheck.id;
        isExistingProfile = true;
      } else {
        const { data: newProfile, error: profileError } = await supabaseAdmin
          .from('profiles')
          .insert(profileData)
          .select()
          .single();

        if (profileError || !newProfile) {
          console.error('Error creating profile:', profileError);
          console.error('Profile creation details:', {
            name: fullName,
            email: emailLower,
            phone: application.phone,
            country: application.country,
            city: application.city,
            student_id: generatedStudentId,
            cohort_id: application.preferred_cohort_id,
            profileData,
          });
          
          // Check if it's a unique constraint violation
          if (profileError?.code === '23505') {
            // Unique constraint violation - likely email or student_id already exists
            if (profileError.message?.includes('email')) {
              return NextResponse.json(
                { 
                  error: 'Failed to create profile', 
                  details: 'Email already exists. Please check if profile was already created.',
                  code: profileError.code,
                  hint: 'A profile with this email may already exist. Try refreshing the applications list.',
                },
                { status: 409 }
              );
            } else if (profileError.message?.includes('student_id')) {
              return NextResponse.json(
                { 
                  error: 'Failed to create profile', 
                  details: 'Student ID already exists. Please try again.',
                  code: profileError.code,
                  hint: 'The generated student ID conflicts with an existing one.',
                },
                { status: 409 }
              );
            }
          }
          
          return NextResponse.json(
            { 
              error: 'Failed to create profile', 
              details: profileError?.message || 'Unknown error',
              code: profileError?.code,
              hint: profileError?.hint,
            },
            { status: 500 }
          );
        }
        
        profileId = newProfile.id;
      }
    }

    // STEP 2: TRANSFER DATA FROM APPLICATION TO STUDENTS TABLE
    // This is where all application data is transferred to the students database
    // Students table is the source of truth for student academic data
    const { data: existingStudent } = await supabaseAdmin
      .from('students')
      .select('id, name, email, phone, country, city, cohort_id, status, progress_percent, assignments_completed, projects_completed, live_sessions_attended')
      .eq('profile_id', profileId)
      .maybeSingle();

    // Transfer ALL data from application to students table
    const studentData: any = {
      profile_id: profileId, // Link to profile
      // Transfer all personal data from application
      name: fullName, // From application.first_name + application.last_name
      email: emailLower, // From application.email
      phone: application.phone || null, // From application.phone
      country: application.country || null, // From application.country
      city: application.city || null, // From application.city
      cohort_id: application.preferred_cohort_id || null, // From application.preferred_cohort_id
      status: 'Enrolled', // Student is enrolled after approval
      // Preserve existing progress data if student record already exists
      progress_percent: existingStudent?.progress_percent || 0,
      assignments_completed: existingStudent?.assignments_completed || 0,
      projects_completed: existingStudent?.projects_completed || 0,
      live_sessions_attended: existingStudent?.live_sessions_attended || 0,
    };

    console.log('Transferring application data to students table:', {
      applicationId: application.id,
      profileId,
      studentData,
    });

    let studentRecord;
    if (existingStudent) {
      // Update existing student record with application data
      const { data: updatedStudent, error: updateError } = await supabaseAdmin
        .from('students')
        .update(studentData)
        .eq('id', existingStudent.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating student record:', updateError);
        return NextResponse.json(
          { error: 'Failed to update student record', details: updateError.message },
          { status: 500 }
        );
      }
      studentRecord = updatedStudent;
    } else {
      // Create new student record (source of truth)
      const { data: newStudent, error: studentError } = await supabaseAdmin
        .from('students')
        .insert(studentData)
        .select()
        .single();

      if (studentError) {
        console.error('Error creating student record:', studentError);
        return NextResponse.json(
          { error: 'Failed to create student record', details: studentError.message },
          { status: 500 }
        );
      }
      studentRecord = newStudent;
    }

    // Ensure studentRecord exists
    if (!studentRecord) {
      console.error('Student record was not created/updated');
      return NextResponse.json(
        { 
          error: 'Failed to create or update student record', 
          details: 'Student record is missing after creation/update',
        },
        { status: 500 }
      );
    }

    // STEP 3: UPDATE PROFILE WITH APPLICATION DATA
    // Update profile (whether new or existing) with all data from application
    // This ensures profile database is synced with the application data
    
    // Get current profile to check password_hash
    const { data: currentProfile, error: currentProfileError } = await supabaseAdmin
      .from('profiles')
      .select('password_hash, status')
      .eq('id', profileId)
      .maybeSingle();

    if (currentProfileError) {
      console.error('Error fetching current profile:', currentProfileError);
      return NextResponse.json(
        { 
          error: 'Failed to fetch profile for update', 
          details: currentProfileError.message,
        },
        { status: 500 }
      );
    }

    if (!currentProfile) {
      console.error('Profile not found for update:', profileId);
      return NextResponse.json(
        { 
          error: 'Profile not found', 
          details: `Profile with ID ${profileId} does not exist`,
        },
        { status: 404 }
      );
    }

    // STEP 3: Update Profile with ALL application data
    // Transfer all data from application to profile (whether new or existing)
    const profileUpdateData: any = {
      // Transfer all data from application/student record
      name: fullName, // From application
      email: emailLower, // From application
      phone: application.phone || null, // From application
      country: application.country || null, // From application
      city: application.city || null, // From application
      cohort_id: application.preferred_cohort_id || null, // From application
    };

    // Add student_id if generated (for new profiles or if existing profile doesn't have one)
    if (generatedStudentId && (!existingProfile?.student_id || !isExistingProfile)) {
      profileUpdateData.student_id = generatedStudentId;
    }

    // Update status based on password
    // If profile already has password, keep it Active, otherwise set to Pending Password Setup
    if (currentProfile?.password_hash) {
      profileUpdateData.status = 'Active';
    } else {
      profileUpdateData.status = 'Pending Password Setup';
    }

    console.log('Updating profile with application data:', {
      profileId,
      isExistingProfile,
      updateData: profileUpdateData,
    });

    const { data: updatedProfile, error: profileUpdateError } = await supabaseAdmin
      .from('profiles')
      .update(profileUpdateData)
      .eq('id', profileId)
      .select()
      .single();

    if (profileUpdateError) {
      console.error('Error updating profile from student data:', profileUpdateError);
      console.error('Profile update data:', profileUpdateData);
      console.error('Profile ID:', profileId);
      // This is critical - profile must be updated with student data
      return NextResponse.json(
        { 
          error: 'Failed to update profile with student data', 
          details: profileUpdateError.message,
          code: profileUpdateError.code,
          hint: profileUpdateError.hint,
          profileId,
          studentRecordId: studentRecord.id,
        },
        { status: 500 }
      );
    }

    if (!updatedProfile) {
      console.error('Profile update returned no data - profile may not exist');
      return NextResponse.json(
        { 
          error: 'Failed to update profile - profile not found',
          details: 'Profile update returned no data. Profile may have been deleted.',
          profileId,
        },
        { status: 500 }
      );
    }

    console.log('Profile updated successfully:', {
      profileId: updatedProfile.id,
      name: updatedProfile.name,
      email: updatedProfile.email,
      cohort_id: updatedProfile.cohort_id,
      status: updatedProfile.status,
    });

    // STEP 4: Enroll in Cohort (if cohort_id exists in students record)
    if (studentRecord.cohort_id) {
      // Check if already enrolled
      const { data: existingEnrollment } = await supabaseAdmin
        .from('cohort_enrollment')
        .select('id')
        .eq('cohort_id', studentRecord.cohort_id)
        .eq('student_id', profileId) // student_id in cohort_enrollment is profiles.id
        .maybeSingle();

      if (!existingEnrollment) {
        // Create enrollment (linked by profiles.id)
        const { error: enrollmentError } = await supabaseAdmin
          .from('cohort_enrollment')
          .insert({
            cohort_id: studentRecord.cohort_id,
            student_id: profileId, // This is profiles.id (student_id)
          });

        if (enrollmentError) {
          console.error('Error creating cohort enrollment:', enrollmentError);
          // Don't fail - enrollment can be fixed later
        }
      }
    }

    // Unlock Chapter 1 for the student
    try {
      const { error: chapterError } = await supabaseAdmin
        .from('chapter_progress')
        .insert({
          student_id: profileId,
          chapter_number: 1,
          chapter_slug: 'the-nature-of-money',
          is_unlocked: true,
          unlocked_at: new Date().toISOString(),
        });

      if (chapterError && !chapterError.message?.includes('duplicate')) {
        console.error('Error unlocking Chapter 1:', chapterError);
        // Don't fail - chapter progress can be set up later
      }
    } catch (chapterError) {
      console.log('Chapter progress table might not exist yet:', chapterError);
      // This is okay - table might not be migrated yet
    }

    // Update application status to Approved
    const { error: updateError } = await supabaseAdmin
      .from('applications')
      .update({
        status: 'Approved',
        approved_by: approvedBy || null,
        approved_at: new Date().toISOString(),
        profile_id: profileId,
      })
      .eq('id', applicationId);

    if (updateError) {
      console.error('Error updating application status:', updateError);
      return NextResponse.json(
        { error: 'Failed to update application status', details: updateError.message },
        { status: 500 }
      );
    }

    // Verify both profile and student records were updated
    const { data: finalProfile, error: finalProfileError } = await supabaseAdmin
      .from('profiles')
      .select('id, name, email, cohort_id, status, student_id')
      .eq('id', profileId)
      .maybeSingle();

    const { data: finalStudent, error: finalStudentError } = await supabaseAdmin
      .from('students')
      .select('id, name, email, cohort_id, status')
      .eq('profile_id', profileId)
      .maybeSingle();

    // Log any verification errors (non-critical)
    if (finalProfileError) {
      console.warn('Error verifying profile after update:', finalProfileError);
    }
    if (finalStudentError) {
      console.warn('Error verifying student after update:', finalStudentError);
    }

    console.log('✅ Approval completed - Data Transfer Summary:', {
      application: {
        id: application.id,
        email: application.email,
        name: fullName,
      },
      profile: finalProfile ? {
        id: finalProfile.id,
        name: finalProfile.name,
        email: finalProfile.email,
        cohort_id: finalProfile.cohort_id,
        status: finalProfile.status,
        student_id: finalProfile.student_id,
        wasExisting: isExistingProfile,
      } : 'NOT FOUND',
      student: finalStudent ? {
        id: finalStudent.id,
        name: finalStudent.name,
        email: finalStudent.email,
        cohort_id: finalStudent.cohort_id,
        status: finalStudent.status,
        wasExisting: !!existingStudent,
      } : 'NOT FOUND',
      dataTransferred: {
        from: 'applications table',
        to: ['profiles table', 'students table'],
        fields: ['name', 'email', 'phone', 'country', 'city', 'cohort_id'],
      },
    });

    const res = NextResponse.json({
      success: true,
      message: 'Application approved successfully',
      profileId,
      studentId: finalStudent?.id || null,
      isExistingProfile,
      needsPasswordSetup: !currentProfile?.password_hash,
      profile: finalProfile ? {
        name: finalProfile.name,
        email: finalProfile.email,
        cohort_id: finalProfile.cohort_id,
        status: finalProfile.status,
      } : null,
      student: finalStudent ? {
        name: finalStudent.name,
        email: finalStudent.email,
        cohort_id: finalStudent.cohort_id,
        status: finalStudent.status,
      } : null,
    });
    attachRefresh(res, session);
    return res;
  } catch (error: any) {
    console.error('Error approving application:', error);
    const errorResponse: any = {
      error: 'Internal server error',
    };
    if (process.env.NODE_ENV === 'development' && error?.message) {
      errorResponse.details = error.message;
    }
    return NextResponse.json(errorResponse, { status: 500 });
  }
}



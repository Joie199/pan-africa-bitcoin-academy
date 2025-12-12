import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { attachRefresh, requireAdmin, setAdminCookie, clearAdminCookie } from '@/lib/adminSession';

export async function POST(req: NextRequest) {
  try {
    // If already logged in, refresh session
    const existing = requireAdmin(req);
    if (existing) {
      const res = NextResponse.json({ success: true, admin: existing });
      attachRefresh(res, existing);
      return res;
    }

    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Trim and normalize email
    const normalizedEmail = email.trim().toLowerCase();

    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('id, email, password_hash, role')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (error) {
      console.error('Database error fetching admin:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!admin) {
      console.error('Admin not found for email:', normalizedEmail);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!admin.password_hash) {
      console.error('Admin has no password hash:', admin.id);
      return NextResponse.json({ error: 'Admin account not properly configured' }, { status: 500 });
    }

    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) {
      console.error('Password mismatch for admin:', admin.id);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const now = Date.now();
    const session = {
      adminId: admin.id,
      email: admin.email,
      role: admin.role || null,
      issuedAt: now,
      lastActive: now,
    };

    const res = NextResponse.json({ success: true, admin: session });
    setAdminCookie(res, session);
    return res;
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


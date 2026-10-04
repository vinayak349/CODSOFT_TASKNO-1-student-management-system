import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, setSessionCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const user = await db.getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const sessionData = {
      userId: user.id,
      role: user.role as 'ADMIN' | 'TEACHER' | 'STUDENT',
      email: user.email,
      name: user.name,
      studentId: user.student?.id,
      teacherId: user.teacher?.id,
    };

    await setSessionCookie(sessionData);

    let redirectUrl = '/admin/dashboard';
    if (user.role === 'TEACHER') redirectUrl = '/teacher/dashboard';
    else if (user.role === 'STUDENT') redirectUrl = '/student/dashboard';

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      redirectUrl,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

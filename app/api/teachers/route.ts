import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { checkRole, unauthorizedResponse, forbiddenResponse } from '@/lib/permissions';
import { teacherSchema } from '@/lib/validations';

export async function GET(request: Request) {
  const session = await getSession();
  const auth = checkRole(session, ['ADMIN', 'TEACHER']);
  if (!auth.authorized) return forbiddenResponse(auth.error);

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || undefined;
  const department = searchParams.get('department') || undefined;

  try {
    const teachers = await db.getTeachers(search, department);
    return NextResponse.json({ success: true, data: teachers });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch teachers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  const auth = checkRole(session, ['ADMIN']);
  if (!auth.authorized) return forbiddenResponse(auth.error);

  try {
    const body = await request.json();
    const result = teacherSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.errors[0].message }, { status: 400 });
    }

    const teacher = await db.createTeacher(result.data);
    return NextResponse.json({ success: true, message: 'Teacher created successfully', data: teacher }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Unable to create teacher' }, { status: 500 });
  }
}

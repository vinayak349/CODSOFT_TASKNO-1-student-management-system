import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { checkRole, unauthorizedResponse, forbiddenResponse } from '@/lib/permissions';
import { studentSchema } from '@/lib/validations';

export async function GET(request: Request) {
  const session = await getSession();
  const auth = checkRole(session, ['ADMIN', 'TEACHER']);
  if (!auth.authorized) {
    if (auth.status === 401) return unauthorizedResponse(auth.error);
    return forbiddenResponse(auth.error);
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || undefined;
  const classId = searchParams.get('classId') || undefined;

  try {
    const students = await db.getStudents(search, classId);
    return NextResponse.json({ success: true, data: students });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  const auth = checkRole(session, ['ADMIN']);
  if (!auth.authorized) return forbiddenResponse(auth.error);

  try {
    const body = await request.json();
    const result = studentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.errors[0].message }, { status: 400 });
    }

    const student = await db.createStudent(result.data);
    return NextResponse.json({ success: true, message: 'Student created successfully', data: student }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Unable to create student' }, { status: 500 });
  }
}

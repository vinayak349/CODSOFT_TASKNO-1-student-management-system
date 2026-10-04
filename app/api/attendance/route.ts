import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { checkRole, unauthorizedResponse, forbiddenResponse } from '@/lib/permissions';
import { attendanceMarkSchema } from '@/lib/validations';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const classId = searchParams.get('classId') || undefined;
  const subjectId = searchParams.get('subjectId') || undefined;
  const date = searchParams.get('date') || undefined;
  let studentId = searchParams.get('studentId') || undefined;

  // Students can only query their own attendance
  if (session.role === 'STUDENT') {
    studentId = session.studentId || session.userId;
  }

  try {
    const attendance = await db.getAttendance({ classId, subjectId, date, studentId });
    return NextResponse.json({ success: true, data: attendance });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch attendance records' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  const auth = checkRole(session, ['ADMIN', 'TEACHER']);
  if (!auth.authorized) return forbiddenResponse(auth.error);

  try {
    const body = await request.json();
    const result = attendanceMarkSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.errors[0].message }, { status: 400 });
    }

    await db.saveAttendance({
      ...result.data,
      teacherId: session?.teacherId,
    });

    return NextResponse.json({ success: true, message: 'Attendance recorded successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to record attendance' }, { status: 500 });
  }
}

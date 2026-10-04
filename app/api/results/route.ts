import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { checkRole, unauthorizedResponse, forbiddenResponse } from '@/lib/permissions';
import { examResultSchema } from '@/lib/validations';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const examId = searchParams.get('examId') || undefined;
  let studentId = searchParams.get('studentId') || undefined;

  // Students can only view their own exam results
  if (session.role === 'STUDENT') {
    studentId = session.studentId || session.userId;
  }

  try {
    const results = await db.getExamResults(examId, studentId);
    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch exam results' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  const auth = checkRole(session, ['ADMIN', 'TEACHER']);
  if (!auth.authorized) return forbiddenResponse(auth.error);

  try {
    const body = await request.json();
    const result = examResultSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.errors[0].message }, { status: 400 });
    }

    await db.saveExamResults(result.data);
    return NextResponse.json({ success: true, message: 'Exam results saved successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to save exam results' }, { status: 500 });
  }
}

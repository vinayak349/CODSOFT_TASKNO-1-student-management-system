import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { checkRole, forbiddenResponse } from '@/lib/permissions';
import { examSchema } from '@/lib/validations';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return forbiddenResponse('Unauthorized');

  const { searchParams } = new URL(request.url);
  const subjectId = searchParams.get('subjectId') || undefined;

  try {
    const exams = await db.getExams(subjectId);
    return NextResponse.json({ success: true, data: exams });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch exams' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  const auth = checkRole(session, ['ADMIN']);
  if (!auth.authorized) return forbiddenResponse(auth.error);

  try {
    const body = await request.json();
    const result = examSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.errors[0].message }, { status: 400 });
    }

    const exam = await db.createExam(result.data);
    return NextResponse.json({ success: true, message: 'Exam created successfully', data: exam }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Unable to create exam' }, { status: 500 });
  }
}

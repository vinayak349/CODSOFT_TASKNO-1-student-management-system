import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { checkRole, forbiddenResponse } from '@/lib/permissions';
import { subjectSchema } from '@/lib/validations';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return forbiddenResponse('Unauthorized');

  const { searchParams } = new URL(request.url);
  const classId = searchParams.get('classId') || undefined;

  try {
    const subjects = await db.getSubjects(classId);
    return NextResponse.json({ success: true, data: subjects });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch subjects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  const auth = checkRole(session, ['ADMIN']);
  if (!auth.authorized) return forbiddenResponse(auth.error);

  try {
    const body = await request.json();
    const result = subjectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.errors[0].message }, { status: 400 });
    }

    const subject = await db.createSubject(result.data);
    return NextResponse.json({ success: true, message: 'Subject created successfully', data: subject }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Unable to create subject' }, { status: 500 });
  }
}

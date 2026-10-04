import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { checkRole, forbiddenResponse } from '@/lib/permissions';
import { classSchema } from '@/lib/validations';

export async function GET() {
  const session = await getSession();
  if (!session) return forbiddenResponse('Unauthorized');

  try {
    const classes = await db.getClasses();
    return NextResponse.json({ success: true, data: classes });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch classes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  const auth = checkRole(session, ['ADMIN']);
  if (!auth.authorized) return forbiddenResponse(auth.error);

  try {
    const body = await request.json();
    const result = classSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.errors[0].message }, { status: 400 });
    }

    const newClass = await db.createClass(result.data);
    return NextResponse.json({ success: true, message: 'Class created successfully', data: newClass }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Unable to create class' }, { status: 500 });
  }
}

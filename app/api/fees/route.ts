import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { checkRole, unauthorizedResponse, forbiddenResponse } from '@/lib/permissions';
import { feeSchema } from '@/lib/validations';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;
  let studentId = searchParams.get('studentId') || undefined;

  // Students can only view their own fees
  if (session.role === 'STUDENT') {
    studentId = session.studentId || session.userId;
  }

  try {
    const fees = await db.getFees(studentId, status);
    return NextResponse.json({ success: true, data: fees });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch fee records' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  const auth = checkRole(session, ['ADMIN']);
  if (!auth.authorized) return forbiddenResponse(auth.error);

  try {
    const body = await request.json();
    const result = feeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.errors[0].message }, { status: 400 });
    }

    const fee = await db.createFee(result.data);
    return NextResponse.json({ success: true, message: 'Fee record created successfully', data: fee }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to create fee record' }, { status: 500 });
  }
}

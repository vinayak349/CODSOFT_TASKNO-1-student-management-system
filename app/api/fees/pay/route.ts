import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { checkRole, forbiddenResponse } from '@/lib/permissions';
import { feePaymentSchema } from '@/lib/validations';

export async function POST(request: Request) {
  const session = await getSession();
  // Admin or Student paying their fee
  if (!session) return forbiddenResponse('Unauthorized');

  try {
    const body = await request.json();
    const result = feePaymentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.errors[0].message }, { status: 400 });
    }

    const payment = await db.payFee(result.data);
    return NextResponse.json({ success: true, message: 'Fee payment recorded successfully', data: payment });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to record fee payment' }, { status: 500 });
  }
}

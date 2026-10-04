import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { checkRole, forbiddenResponse } from '@/lib/permissions';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  const auth = checkRole(session, ['ADMIN']);
  if (!auth.authorized) return forbiddenResponse(auth.error);

  try {
    const success = await db.deleteExam(params.id);
    if (!success) return NextResponse.json({ success: false, error: 'Exam not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Exam deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete exam' }, { status: 500 });
  }
}

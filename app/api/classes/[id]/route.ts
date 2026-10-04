import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { checkRole, forbiddenResponse } from '@/lib/permissions';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  const auth = checkRole(session, ['ADMIN']);
  if (!auth.authorized) return forbiddenResponse(auth.error);

  try {
    const body = await request.json();
    const updated = await db.updateClass(params.id, body);
    if (!updated) return NextResponse.json({ success: false, error: 'Class not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Class updated successfully', data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update class' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  const auth = checkRole(session, ['ADMIN']);
  if (!auth.authorized) return forbiddenResponse(auth.error);

  try {
    const success = await db.deleteClass(params.id);
    if (!success) return NextResponse.json({ success: false, error: 'Class not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Class deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete class' }, { status: 500 });
  }
}

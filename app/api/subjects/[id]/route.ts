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
    const updated = await db.updateSubject(params.id, body);
    if (!updated) return NextResponse.json({ success: false, error: 'Subject not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Subject updated successfully', data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update subject' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  const auth = checkRole(session, ['ADMIN']);
  if (!auth.authorized) return forbiddenResponse(auth.error);

  try {
    const success = await db.deleteSubject(params.id);
    if (!success) return NextResponse.json({ success: false, error: 'Subject not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Subject deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete subject' }, { status: 500 });
  }
}

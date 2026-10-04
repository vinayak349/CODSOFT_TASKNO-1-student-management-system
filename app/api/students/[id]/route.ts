import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { checkRole, unauthorizedResponse, forbiddenResponse } from '@/lib/permissions';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();

  // Student can view their own details; Admin/Teacher can view any
  if (session.role === 'STUDENT' && session.studentId !== params.id && session.userId !== params.id) {
    return forbiddenResponse('You can only access your own profile');
  }

  try {
    const student = await db.getStudentById(params.id);
    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: student });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch student details' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  const auth = checkRole(session, ['ADMIN']);
  if (!auth.authorized) return forbiddenResponse(auth.error);

  try {
    const body = await request.json();
    const updated = await db.updateStudent(params.id, body);
    if (!updated) return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Student updated successfully', data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  const auth = checkRole(session, ['ADMIN']);
  if (!auth.authorized) return forbiddenResponse(auth.error);

  try {
    const success = await db.deleteStudent(params.id);
    if (!success) return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete student' }, { status: 500 });
  }
}

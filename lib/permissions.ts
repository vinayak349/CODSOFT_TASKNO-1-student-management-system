import { NextResponse } from 'next/server';
import { UserSession } from './auth';

export function checkRole(session: UserSession | null, allowedRoles: ('ADMIN' | 'TEACHER' | 'STUDENT')[]) {
  if (!session) return { authorized: false, status: 401, error: 'Unauthorized. Please log in.' };
  if (!allowedRoles.includes(session.role)) {
    return { authorized: false, status: 403, error: 'Forbidden. You do not have permission to access this resource.' };
  }
  return { authorized: true, status: 200, error: null };
}

export function unauthorizedResponse(message: string | null | undefined = 'Unauthorized access') {
  return NextResponse.json({ success: false, error: message || 'Unauthorized access' }, { status: 401 });
}

export function forbiddenResponse(message: string | null | undefined = 'Forbidden action') {
  return NextResponse.json({ success: false, error: message || 'Forbidden action' }, { status: 403 });
}

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { unauthorizedResponse } from '@/lib/permissions';

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorizedResponse();

  try {
    if (session.role === 'ADMIN') {
      const stats = await db.getAdminStats();
      return NextResponse.json({ success: true, data: stats });
    }

    if (session.role === 'TEACHER') {
      const classes = await db.getClasses();
      const subjects = await db.getSubjects();
      const students = await db.getStudents();
      const exams = await db.getExams();

      return NextResponse.json({
        success: true,
        data: {
          assignedClassesCount: classes.length,
          assignedSubjectsCount: subjects.length,
          totalStudentsCount: students.length,
          upcomingExamsCount: exams.length,
        },
      });
    }

    if (session.role === 'STUDENT') {
      const studentId = session.studentId || session.userId;
      const attendances = await db.getAttendance({ studentId });
      const results = await db.getExamResults(undefined, studentId);
      const fees = await db.getFees(studentId);

      const presentCount = attendances.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
      const attendancePercent = attendances.length > 0 ? Math.round((presentCount / attendances.length) * 100) : 92;

      const totalFee = fees.reduce((sum, f) => sum + f.amount, 0);
      const paidFee = fees.reduce((sum, f) => sum + f.paidAmount, 0);
      const dueFee = totalFee - paidFee;

      const totalMarks = results.reduce((sum, r) => sum + r.marks, 0);
      const avgMarks = results.length > 0 ? (totalMarks / results.length).toFixed(1) : '85.0';

      return NextResponse.json({
        success: true,
        data: {
          attendancePercent,
          cgpa: (Number(avgMarks) / 10).toFixed(2),
          feeDue: dueFee,
          upcomingExamsCount: 2,
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid role' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard statistics' }, { status: 500 });
  }
}

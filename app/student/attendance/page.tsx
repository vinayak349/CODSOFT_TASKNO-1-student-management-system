'use client';

import React, { useEffect, useState } from 'react';
import { CalendarCheck, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface SubjectAttendance {
  subjectName: string;
  code: string;
  totalClasses: number;
  presentClasses: number;
  lateClasses: number;
  absentClasses: number;
  percentage: number;
}

export default function StudentAttendancePage() {
  const [subjectBreakdown, setSubjectBreakdown] = useState<SubjectAttendance[]>([
    { subjectName: 'Database Management System', code: 'DBMS501', totalClasses: 24, presentClasses: 21, lateClasses: 1, absentClasses: 2, percentage: 87.5 },
    { subjectName: 'Web Technologies & Next.js', code: 'WEB502', totalClasses: 22, presentClasses: 20, lateClasses: 1, absentClasses: 1, percentage: 90.9 },
    { subjectName: 'Computer Networks', code: 'CN503', totalClasses: 20, presentClasses: 16, lateClasses: 2, absentClasses: 2, percentage: 80.0 },
    { subjectName: 'Operating Systems', code: 'OS301', totalClasses: 18, presentClasses: 15, lateClasses: 1, absentClasses: 2, percentage: 83.3 },
  ]);

  const totalClassesAll = subjectBreakdown.reduce((sum, s) => sum + s.totalClasses, 0);
  const totalPresentAll = subjectBreakdown.reduce((sum, s) => sum + s.presentClasses, 0);
  const overallPercentage = ((totalPresentAll / totalClassesAll) * 100).toFixed(1);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">My Attendance Record</h1>
        <p className="text-xs text-slate-500">Subject-wise lecture attendance, present count, and threshold compliance.</p>
      </div>

      {/* Overview Percentage Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Overall Attendance Score</span>
          <h2 className="text-4xl font-extrabold mt-1">{overallPercentage}%</h2>
          <p className="text-xs text-slate-300 mt-1">
            {totalPresentAll} Attended out of {totalClassesAll} Total Lectures Conducted
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Badge variant="success">Eligible for Exams (&gt;75%)</Badge>
        </div>
      </div>

      {/* Subject-Wise Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-6 py-3.5">Subject & Code</th>
              <th className="px-6 py-3.5 text-center">Total Conducted</th>
              <th className="px-6 py-3.5 text-center">Present</th>
              <th className="px-6 py-3.5 text-center">Late</th>
              <th className="px-6 py-3.5 text-center">Absent</th>
              <th className="px-6 py-3.5 text-center">Attendance %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {subjectBreakdown.map((s, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900 dark:text-slate-100">{s.subjectName}</p>
                  <p className="font-mono text-xs text-brand-600 dark:text-brand-400 font-semibold">{s.code}</p>
                </td>
                <td className="px-6 py-4 text-center font-bold text-slate-700 dark:text-slate-300">{s.totalClasses}</td>
                <td className="px-6 py-4 text-center font-bold text-emerald-600 dark:text-emerald-400">{s.presentClasses}</td>
                <td className="px-6 py-4 text-center font-bold text-amber-600 dark:text-amber-400">{s.lateClasses}</td>
                <td className="px-6 py-4 text-center font-bold text-rose-600 dark:text-rose-400">{s.absentClasses}</td>
                <td className="px-6 py-4 text-center">
                  <Badge variant={s.percentage >= 85 ? 'success' : s.percentage >= 75 ? 'info' : 'danger'}>
                    {s.percentage}%
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

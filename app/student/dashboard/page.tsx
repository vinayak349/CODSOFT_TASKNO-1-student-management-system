'use client';

import React, { useEffect, useState } from 'react';
import { CalendarCheck, Award, CreditCard, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DashboardCard } from '@/components/DashboardCard';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import Link from 'next/link';

export default function StudentDashboardPage() {
  const [stats, setStats] = useState({
    attendancePercent: 87,
    cgpa: '8.5',
    feeDue: 0,
    upcomingExamsCount: 2,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/dashboard/stats');
        const data = await res.json();
        if (data.success && data.data) {
          setStats(data.data);
        }
      } catch (e) {}
    }
    loadStats();
  }, []);

  const academicRecords = [
    { subject: 'Database Management System (DBMS501)', attendance: '87%', marks: 85, grade: 'A' },
    { subject: 'Web Technologies & Next.js (WEB502)', attendance: '92%', marks: 92, grade: 'A+' },
    { subject: 'Computer Networks (CN503)', attendance: '78%', marks: 74, grade: 'B+' },
    { subject: 'Operating Systems (OS301)', attendance: '85%', marks: 76, grade: 'B' },
  ];

  const upcomingExams = [
    { name: 'Mid Semester Examination - DBMS', subject: 'DBMS501', date: '20 October 2026', total: 100 },
    { name: 'Mid Semester Examination - Web Tech', subject: 'WEB502', date: '25 October 2026', total: 100 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Personalized Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold mb-1">
            <span>BCA • Semester 5 • Roll STU2026001</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, Rahul</h1>
          <p className="text-sm text-slate-300">Here is your academic standing, attendance overview, and upcoming exam schedule.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/student/results">
            <Button size="sm" icon={<Award className="w-4 h-4" />}>
              View Exam Results
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Attendance Rate"
          value={`${stats.attendancePercent}%`}
          subtitle="Above 75% Requirement"
          icon={<CalendarCheck className="w-5 h-5" />}
          trend="Good Standing"
          color="emerald"
        />

        <DashboardCard
          title="CGPA / Score"
          value={stats.cgpa}
          subtitle="Out of 10.0 Scale"
          icon={<Award className="w-5 h-5" />}
          color="purple"
        />

        <DashboardCard
          title="Pending Fee Due"
          value={stats.feeDue > 0 ? `₹${stats.feeDue.toLocaleString()}` : '₹0'}
          subtitle={stats.feeDue > 0 ? 'Due Date: 15 Nov 2026' : 'All Fees Paid'}
          icon={<CreditCard className="w-5 h-5" />}
          trend={stats.feeDue > 0 ? 'Pending' : 'Cleared'}
          trendType={stats.feeDue > 0 ? 'negative' : 'positive'}
          color="amber"
        />

        <DashboardCard
          title="Upcoming Exams"
          value={stats.upcomingExamsCount}
          subtitle="Midterm Exams"
          icon={<BookOpen className="w-5 h-5" />}
          color="blue"
        />
      </div>

      {/* Academic Performance & Upcoming Exams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Performance */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Academic Performance Summary</h3>
              <p className="text-xs text-slate-500">Subject-wise attendance and examination results</p>
            </div>
            <Link href="/student/results">
              <Button size="sm" variant="ghost" icon={<ArrowRight className="w-4 h-4" />}>
                Detailed Transcript
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Subject Name</th>
                  <th className="px-4 py-3">Attendance</th>
                  <th className="px-4 py-3">Exam Score</th>
                  <th className="px-4 py-3">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {academicRecords.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{r.subject}</td>
                    <td className="px-4 py-3">
                      <Badge variant="info">{r.attendance}</Badge>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">{r.marks} / 100</td>
                    <td className="px-4 py-3">
                      <Badge variant={r.grade.startsWith('A') ? 'success' : 'purple'}>
                        Grade {r.grade}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Examinations */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Upcoming Examination Notice</h3>
          
          <div className="space-y-3">
            {upcomingExams.map((ex, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{ex.name}</h4>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                  <span className="font-semibold text-brand-600 dark:text-brand-400">{ex.subject}</span>
                  <span className="font-mono">{ex.date}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>Eligible for all midterm examinations based on attendance metrics.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

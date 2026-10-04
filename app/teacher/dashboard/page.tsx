'use client';

import React, { useEffect, useState } from 'react';
import { School, BookOpen, Users, CalendarCheck, Award, ArrowRight } from 'lucide-react';
import { DashboardCard } from '@/components/DashboardCard';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import Link from 'next/link';

export default function TeacherDashboardPage() {
  const [stats, setStats] = useState({
    assignedClassesCount: 3,
    assignedSubjectsCount: 2,
    totalStudentsCount: 5,
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

  const assignedClasses = [
    { name: 'BCA (Semester 5)', subject: 'Database Management System (DBMS501)', students: 4, schedule: 'Mon, Wed, Fri • 09:30 AM' },
    { name: 'BCA (Semester 5)', subject: 'Web Technologies & Next.js (WEB502)', students: 4, schedule: 'Tue, Thu • 11:00 AM' },
    { name: 'B.Tech CS (Semester 3)', subject: 'Computer Networks (CN503)', students: 1, schedule: 'Mon, Thu • 02:00 PM' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-900 text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-semibold mb-1">
            <span>Department of Computer Science</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Faculty Dashboard</h1>
          <p className="text-sm text-slate-300">Welcome back, Prof. Sarah Jenkins. Ready to conduct today's lectures?</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/teacher/attendance">
            <Button size="sm" icon={<CalendarCheck className="w-4 h-4" />}>
              Mark Today's Attendance
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Assigned Batches"
          value={stats.assignedClassesCount}
          subtitle="Active Academic Batches"
          icon={<School className="w-5 h-5" />}
          color="blue"
        />

        <DashboardCard
          title="Teaching Subjects"
          value={stats.assignedSubjectsCount}
          subtitle="Course Subjects"
          icon={<BookOpen className="w-5 h-5" />}
          color="purple"
        />

        <DashboardCard
          title="Total Students"
          value={stats.totalStudentsCount}
          subtitle="Under Supervision"
          icon={<Users className="w-5 h-5" />}
          color="emerald"
        />

        <DashboardCard
          title="Scheduled Exams"
          value={stats.upcomingExamsCount}
          subtitle="Midterm Evaluations"
          icon={<Award className="w-5 h-5" />}
          color="amber"
        />
      </div>

      {/* Assigned Classes List & Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Classes Table */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">My Assigned Courses & Batches</h3>
              <p className="text-xs text-slate-500">Active class lectures assigned for this academic term</p>
            </div>
            <Link href="/teacher/students">
              <Button size="sm" variant="ghost" icon={<ArrowRight className="w-4 h-4" />}>
                View Class Students
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {assignedClasses.map((cls, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-brand-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{cls.name}</h4>
                    <Badge variant="purple">{cls.students} Students</Badge>
                  </div>
                  <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mt-0.5">{cls.subject}</p>
                  <p className="text-xs text-slate-500 mt-1">{cls.schedule}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href="/teacher/attendance">
                    <Button size="sm" variant="outline">
                      Mark Attendance
                    </Button>
                  </Link>
                  <Link href="/teacher/examinations">
                    <Button size="sm" variant="secondary">
                      Marks Entry
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Faculty Workflows</h3>
          
          <Link
            href="/teacher/attendance"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-500 bg-sky-50/40 dark:bg-sky-950/20 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-sky-500 text-white shadow-md">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Daily Attendance Register</h4>
                <p className="text-xs text-slate-500">Record Present / Absent / Late for students</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-500 transition-colors" />
          </Link>

          <Link
            href="/teacher/examinations"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500 text-white shadow-md">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Examination Marks Entry</h4>
                <p className="text-xs text-slate-500">Submit midterm scores & auto-calculate grades</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  UserCheck,
  School,
  CalendarCheck,
  CreditCard,
  Award,
  TrendingUp,
  Plus,
  ArrowUpRight,
  BookOpen,
} from 'lucide-react';
import { DashboardCard } from '@/components/DashboardCard';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  avgAttendance: number;
  totalFeesAmount: number;
  paidFeesAmount: number;
  pendingFeesAmount: number;
  upcomingExams: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/dashboard/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (e) {
        console.error('Failed to load stats', e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !stats) {
    return <LoadingSpinner label="Loading Executive Dashboard..." />;
  }

  // Sample data for Recharts
  const attendanceChartData = [
    { day: 'Mon', attendance: 92 },
    { day: 'Tue', attendance: 88 },
    { day: 'Wed', attendance: 94 },
    { day: 'Thu', attendance: 86 },
    { day: 'Fri', attendance: 90 },
  ];

  const feeDistributionData = [
    { name: 'Paid Fees', value: stats.paidFeesAmount, color: '#10b981' },
    { name: 'Pending Fees', value: stats.pendingFeesAmount, color: '#f59e0b' },
  ];

  const recentStudents = [
    { name: 'Rahul Sharma', id: 'STU2026001', class: 'BCA (Semester 5)', date: 'Today' },
    { name: 'Aman Kumar', id: 'STU2026002', class: 'BCA (Semester 5)', date: 'Yesterday' },
    { name: 'Priya Patel', id: 'STU2026005', class: 'B.Tech CS (Semester 3)', date: '02 Oct 2026' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white shadow-xl">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Institutional Dashboard</h1>
          <p className="text-sm text-brand-200">
            Overview of EduManage operations, student performance, attendance, and fee status.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/students">
            <Button size="sm" icon={<Plus className="w-4 h-4" />}>
              Add Student
            </Button>
          </Link>
          <Link href="/admin/teachers">
            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10" icon={<Plus className="w-4 h-4" />}>
              Add Teacher
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <DashboardCard
          title="Total Students"
          value={stats.totalStudents}
          subtitle="Enrolled Active"
          icon={<Users className="w-5 h-5" />}
          trend="+12% YoY"
          color="blue"
        />

        <DashboardCard
          title="Total Teachers"
          value={stats.totalTeachers}
          subtitle="Faculty Members"
          icon={<UserCheck className="w-5 h-5" />}
          color="purple"
        />

        <DashboardCard
          title="Total Classes"
          value={stats.totalClasses}
          subtitle="Active Courses"
          icon={<School className="w-5 h-5" />}
          color="indigo"
        />

        <DashboardCard
          title="Avg Attendance"
          value={`${stats.avgAttendance}%`}
          subtitle="Institution Rate"
          icon={<CalendarCheck className="w-5 h-5" />}
          trend="High"
          color="emerald"
        />

        <DashboardCard
          title="Pending Fees"
          value={`₹${stats.pendingFeesAmount.toLocaleString()}`}
          subtitle={`Paid: ₹${stats.paidFeesAmount.toLocaleString()}`}
          icon={<CreditCard className="w-5 h-5" />}
          trend="Action Needed"
          trendType="negative"
          color="amber"
        />

        <DashboardCard
          title="Upcoming Exams"
          value={stats.upcomingExams}
          subtitle="Scheduled this month"
          icon={<Award className="w-5 h-5" />}
          color="rose"
        />
      </div>

      {/* Analytics & Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Weekly Attendance Overview</h3>
              <p className="text-xs text-slate-500">Student daily check-in percentage across all departments</p>
            </div>
            <Badge variant="success">87% Avg</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                  }}
                />
                <Bar dataKey="attendance" fill="#0c93e7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fee Collection Pie Breakdown */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Fee Collection Summary</h3>
            <p className="text-xs text-slate-500">Collected vs Outstanding semester tuition fees</p>
          </div>
          <div className="h-48 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feeDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {feeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Paid Amount
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                ₹{stats.paidFeesAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Pending Amount
              </span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                ₹{stats.pendingFeesAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts & Recent Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students Table */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Recently Enrolled Students</h3>
            <Link href="/admin/students">
              <Button size="sm" variant="ghost" icon={<ArrowUpRight className="w-4 h-4" />}>
                View All
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentStudents.map((s) => (
              <div key={s.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 font-bold flex items-center justify-center text-sm">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{s.name}</h4>
                    <p className="text-xs text-slate-500">{s.id} • {s.class}</p>
                  </div>
                </div>
                <Badge variant="info">{s.date}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Administrative Quick Actions */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Institutional Quick Modules</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin/classes" className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-brand-50/50 dark:hover:bg-brand-950/20 transition-all flex flex-col gap-2">
              <School className="w-6 h-6 text-brand-500" />
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Class Management</span>
              <span className="text-xs text-slate-500">Add or manage BCA & B.Tech batches</span>
            </Link>

            <Link href="/admin/subjects" className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-brand-50/50 dark:hover:bg-brand-950/20 transition-all flex flex-col gap-2">
              <BookOpen className="w-6 h-6 text-purple-500" />
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Subject Catalog</span>
              <span className="text-xs text-slate-500">Configure courses & credit hours</span>
            </Link>

            <Link href="/admin/examinations" className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-brand-50/50 dark:hover:bg-brand-950/20 transition-all flex flex-col gap-2">
              <Award className="w-6 h-6 text-emerald-500" />
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Exam Schedules</span>
              <span className="text-xs text-slate-500">Set midterms, finals & total marks</span>
            </Link>

            <Link href="/admin/fees" className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-brand-50/50 dark:hover:bg-brand-950/20 transition-all flex flex-col gap-2">
              <CreditCard className="w-6 h-6 text-amber-500" />
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Fee Ledger</span>
              <span className="text-xs text-slate-500">Track tuition receipts & pending dues</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

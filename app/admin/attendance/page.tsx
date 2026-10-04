'use client';

import React, { useEffect, useState } from 'react';
import { CalendarCheck, Filter, UserCheck } from 'lucide-react';
import { DataTable, Column } from '@/components/DataTable';
import { Badge } from '@/components/Badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
  subjectId: string;
  subjectName?: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

export default function AdminAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
      const res = await fetch('/api/attendance');
      const data = await res.json();
      if (data.success) {
        setRecords(data.data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const columns: Column<AttendanceRecord>[] = [
    {
      key: 'date',
      header: 'Date',
      render: (r) => <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{r.date}</span>,
    },
    {
      key: 'studentName',
      header: 'Student Name',
      render: (r) => <span className="font-bold text-slate-900 dark:text-slate-100">{r.studentName || r.studentId}</span>,
    },
    {
      key: 'subjectName',
      header: 'Subject',
      render: (r) => <Badge variant="purple">{r.subjectName || r.subjectId}</Badge>,
    },
    {
      key: 'status',
      header: 'Attendance Status',
      render: (r) => (
        <Badge
          variant={r.status === 'PRESENT' ? 'success' : r.status === 'LATE' ? 'warning' : 'danger'}
        >
          {r.status}
        </Badge>
      ),
    },
  ];

  if (loading) return <LoadingSpinner label="Loading Institutional Attendance Logs..." />;

  const presentCount = records.filter((r) => r.status === 'PRESENT').length;
  const lateCount = records.filter((r) => r.status === 'LATE').length;
  const absentCount = records.filter((r) => r.status === 'ABSENT').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Institutional Attendance Register</h1>
          <p className="text-xs text-slate-500">Comprehensive daily check-in logs submitted by faculty across all classes.</p>
        </div>
      </div>

      {/* Overview Metric Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase">Present Count</p>
            <h3 className="text-2xl font-bold">{presentCount}</h3>
          </div>
          <CalendarCheck className="w-8 h-8 text-emerald-500 opacity-80" />
        </div>

        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase">Late Count</p>
            <h3 className="text-2xl font-bold">{lateCount}</h3>
          </div>
          <CalendarCheck className="w-8 h-8 text-amber-500 opacity-80" />
        </div>

        <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase">Absent Count</p>
            <h3 className="text-2xl font-bold">{absentCount}</h3>
          </div>
          <CalendarCheck className="w-8 h-8 text-rose-500 opacity-80" />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={records}
        searchPlaceholder="Search attendance by student or subject..."
        emptyMessage="No attendance records recorded yet."
      />
    </div>
  );
}

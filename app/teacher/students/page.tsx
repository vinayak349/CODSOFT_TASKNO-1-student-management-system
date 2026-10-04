'use client';

import React, { useEffect, useState } from 'react';
import { Users, Filter } from 'lucide-react';
import { DataTable, Column } from '@/components/DataTable';
import { Badge } from '@/components/Badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  className?: string;
  classId?: string;
  status: string;
}

interface ClassOption {
  id: string;
  name: string;
  semester: string;
}

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      let url = '/api/students';
      if (selectedClass) url += `?classId=${selectedClass}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setStudents(data.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes');
      const data = await res.json();
      if (data.success) setClasses(data.data);
    } catch (e) {}
  };

  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([fetchStudents(), fetchClasses()]);
      setLoading(false);
    }
    init();
  }, [selectedClass]);

  const columns: Column<Student>[] = [
    {
      key: 'studentId',
      header: 'Student ID',
      render: (s) => <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">{s.studentId}</span>,
    },
    {
      key: 'name',
      header: 'Student Name',
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 font-bold flex items-center justify-center text-xs">
            {s.firstName.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{s.firstName} {s.lastName}</p>
            <p className="text-xs text-slate-500">{s.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'className',
      header: 'Assigned Batch / Class',
      render: (s) => <Badge variant="info">{s.className || 'Unassigned'}</Badge>,
    },
    {
      key: 'phone',
      header: 'Contact Phone',
      render: (s) => <span className="text-xs text-slate-600 dark:text-slate-400">{s.phone || 'N/A'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (s) => <Badge variant={s.status === 'ACTIVE' ? 'success' : 'warning'}>{s.status}</Badge>,
    },
  ];

  if (loading) return <LoadingSpinner label="Loading Assigned Students Roster..." />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">My Students Roster</h1>
          <p className="text-xs text-slate-500">Students enrolled in your assigned courses and lectures.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-semibold text-slate-500 uppercase">Filter Class Batch:</span>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Assigned Classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.semester})
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={students}
        searchPlaceholder="Search student by name or ID..."
        emptyMessage="No students found in assigned class."
      />
    </div>
  );
}

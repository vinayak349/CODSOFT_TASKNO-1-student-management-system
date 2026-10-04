'use client';

import React, { useEffect, useState } from 'react';
import { CalendarCheck, Save, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { Input } from '@/components/Input';
import { Badge } from '@/components/Badge';
import { Toast, ToastMessage } from '@/components/Toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface ClassOption {
  id: string;
  name: string;
  semester: string;
}

interface SubjectOption {
  id: string;
  name: string;
  code: string;
  classId?: string;
}

interface StudentItem {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function TeacherAttendancePage() {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);

  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const [clsRes, subRes] = await Promise.all([fetch('/api/classes'), fetch('/api/subjects')]);
        const clsData = await clsRes.json();
        const subData = await subRes.json();
        if (clsData.success) {
          setClasses(clsData.data);
          if (clsData.data.length > 0) setSelectedClassId(clsData.data[0].id);
        }
        if (subData.success) {
          setSubjects(subData.data);
          if (subData.data.length > 0) setSelectedSubjectId(subData.data[0].id);
        }
      } catch (e) {}
      setLoading(false);
    }
    init();
  }, []);

  // Fetch students when selected class changes
  useEffect(() => {
    async function loadStudents() {
      if (!selectedClassId) return;
      try {
        const res = await fetch(`/api/students?classId=${selectedClassId}`);
        const data = await res.json();
        if (data.success) {
          setStudents(data.data);
          // Initialize attendance status to PRESENT by default
          const initial: Record<string, 'PRESENT' | 'ABSENT' | 'LATE'> = {};
          data.data.forEach((s: StudentItem) => {
            initial[s.id] = 'PRESENT';
          });

          // Check if attendance already exists for this date/subject
          const attRes = await fetch(`/api/attendance?classId=${selectedClassId}&subjectId=${selectedSubjectId}&date=${selectedDate}`);
          const attData = await attRes.json();
          if (attData.success && attData.data.length > 0) {
            attData.data.forEach((rec: any) => {
              initial[rec.studentId] = rec.status;
            });
          }
          setAttendanceRecords(initial);
        }
      } catch (e) {}
    }
    loadStudents();
  }, [selectedClassId, selectedSubjectId, selectedDate]);

  const handleStatusChange = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendanceRecords((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    const updated: Record<string, 'PRESENT' | 'ABSENT' | 'LATE'> = {};
    students.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceRecords(updated);
  };

  const handleSaveAttendance = async () => {
    if (!selectedClassId || !selectedSubjectId || !selectedDate) {
      showToast('error', 'Please select class, subject, and date');
      return;
    }

    setIsSaving(true);
    const records = Object.entries(attendanceRecords).map(([studentId, status]) => ({
      studentId,
      status,
    }));

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClassId,
          subjectId: selectedSubjectId,
          date: selectedDate,
          records,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast('error', 'Failed to save attendance', data.error);
        setIsSaving(false);
        return;
      }

      showToast('success', 'Attendance Saved Successfully', `Recorded for ${students.length} students on ${selectedDate}`);
    } catch (err) {
      showToast('error', 'An error occurred while saving attendance');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Faculty Attendance Desk..." />;

  const filteredSubjects = subjects.filter((s) => !s.classId || s.classId === selectedClassId);

  return (
    <div className="space-y-6 animate-fadeIn">
      <Toast toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Daily Attendance Marking</h1>
          <p className="text-xs text-slate-500">Select class, subject, and date to mark student attendance status.</p>
        </div>
        <Button onClick={handleSaveAttendance} isLoading={isSaving} icon={<Save className="w-4 h-4" />}>
          Save Attendance Register
        </Button>
      </div>

      {/* Selection Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <Select
          label="1. Select Class Batch"
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          options={classes.map((c) => ({ value: c.id, label: `${c.name} (${c.semester})` }))}
        />

        <Select
          label="2. Select Subject"
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          options={(filteredSubjects.length > 0 ? filteredSubjects : subjects).map((s) => ({
            value: s.id,
            label: `${s.name} (${s.code})`,
          }))}
        />

        <Input
          label="3. Lecture Date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Quick Mark All Buttons */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Marking Roster ({students.length} Students)
        </span>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => handleMarkAll('PRESENT')} icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}>
            Mark All Present
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleMarkAll('ABSENT')} icon={<XCircle className="w-3.5 h-3.5 text-rose-500" />}>
            Mark All Absent
          </Button>
        </div>
      </div>

      {/* Attendance Student List Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {students.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No students found in selected class batch.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Student ID</th>
                <th className="px-6 py-3.5">Student Name</th>
                <th className="px-6 py-3.5 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map((s) => {
                const currentStatus = attendanceRecords[s.id] || 'PRESENT';
                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                      {s.studentId}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{s.firstName} {s.lastName}</p>
                      <p className="text-xs text-slate-500">{s.email}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.id, 'PRESENT')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            currentStatus === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-emerald-500'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Present
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.id, 'LATE')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            currentStatus === 'LATE'
                              ? 'bg-amber-500 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-amber-500'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          Late
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.id, 'ABSENT')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            currentStatus === 'ABSENT'
                              ? 'bg-rose-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-rose-500'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { Award, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { Badge } from '@/components/Badge';
import { Toast, ToastMessage } from '@/components/Toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface ExamItem {
  id: string;
  name: string;
  subjectId: string;
  subjectName?: string;
  date: string;
  totalMarks: number;
  passingMarks: number;
}

interface StudentItem {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
}

export default function TeacherExaminationsPage() {
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [selectedExamId, setSelectedExamId] = useState('');

  const [marksRecords, setMarksRecords] = useState<Record<string, number>>({});
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

  const calculateGrade = (marks: number): string => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C';
    if (marks >= 40) return 'D';
    return 'F';
  };

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const [exRes, stdRes] = await Promise.all([fetch('/api/exams'), fetch('/api/students')]);
        const exData = await exRes.json();
        const stdData = await stdRes.json();

        if (exData.success && exData.data.length > 0) {
          setExams(exData.data);
          setSelectedExamId(exData.data[0].id);
        }
        if (stdData.success) {
          setStudents(stdData.data);
        }
      } catch (e) {}
      setLoading(false);
    }
    init();
  }, []);

  // Fetch existing results when selected exam changes
  useEffect(() => {
    async function loadResults() {
      if (!selectedExamId) return;
      try {
        const res = await fetch(`/api/results?examId=${selectedExamId}`);
        const data = await res.json();

        const initial: Record<string, number> = {};
        students.forEach((s) => {
          initial[s.id] = 75;
        });

        if (data.success && data.data.length > 0) {
          data.data.forEach((r: any) => {
            initial[r.studentId] = r.marks;
          });
        }
        setMarksRecords(initial);
      } catch (e) {}
    }
    loadResults();
  }, [selectedExamId, students]);

  const handleMarkChange = (studentId: string, val: number) => {
    setMarksRecords((prev) => ({ ...prev, [studentId]: val }));
  };

  const handleSaveResults = async () => {
    if (!selectedExamId) {
      showToast('error', 'Please select an examination');
      return;
    }

    setIsSaving(true);
    const records = Object.entries(marksRecords).map(([studentId, marks]) => ({
      studentId,
      marks: Number(marks),
    }));

    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: selectedExamId,
          records,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast('error', 'Failed to save marks', data.error);
        setIsSaving(false);
        return;
      }

      showToast('success', 'Exam Marks & Grades Saved Successfully');
    } catch (err) {
      showToast('error', 'An error occurred while saving marks');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Examination Marks Desk..." />;

  const selectedExam = exams.find((e) => e.id === selectedExamId);

  return (
    <div className="space-y-6 animate-fadeIn">
      <Toast toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Examination Marks Entry</h1>
          <p className="text-xs text-slate-500">Enter student evaluation scores and auto-calculate institutional letter grades.</p>
        </div>
        <Button onClick={handleSaveResults} isLoading={isSaving} icon={<Save className="w-4 h-4" />}>
          Save Examination Marks
        </Button>
      </div>

      {/* Select Exam Dropdown */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        <Select
          label="Select Target Examination"
          value={selectedExamId}
          onChange={(e) => setSelectedExamId(e.target.value)}
          options={exams.map((ex) => ({
            value: ex.id,
            label: `${ex.name} — ${ex.subjectName || ''} (${ex.date})`,
          }))}
        />

        {selectedExam && (
          <div className="flex items-center gap-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
            <span>Subject: <strong className="text-brand-600 dark:text-brand-400">{selectedExam.subjectName}</strong></span>
            <span>Total Marks: <strong className="text-slate-900 dark:text-slate-100">{selectedExam.totalMarks}</strong></span>
            <span>Passing Benchmark: <strong className="text-emerald-600 dark:text-emerald-400">{selectedExam.passingMarks}</strong></span>
          </div>
        )}
      </div>

      {/* Student Marks Entry Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {students.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No students found to evaluate.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Student ID</th>
                <th className="px-6 py-3.5">Student Name</th>
                <th className="px-6 py-3.5 text-center">Marks Obtained (Out of {selectedExam?.totalMarks || 100})</th>
                <th className="px-6 py-3.5 text-center">Calculated Grade</th>
                <th className="px-6 py-3.5 text-center">Result Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map((s) => {
                const marks = marksRecords[s.id] ?? 75;
                const grade = calculateGrade(marks);
                const isPassed = marks >= (selectedExam?.passingMarks || 40);

                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                      {s.studentId}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">
                      {s.firstName} {s.lastName}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="number"
                        min={0}
                        max={selectedExam?.totalMarks || 100}
                        value={marks}
                        onChange={(e) => handleMarkChange(s.id, Math.min(Number(e.target.value), selectedExam?.totalMarks || 100))}
                        className="w-24 text-center font-bold text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 focus:ring-2 focus:ring-brand-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={grade.startsWith('A') ? 'success' : grade.startsWith('B') ? 'purple' : grade === 'F' ? 'danger' : 'info'}>
                        Grade {grade}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-bold ${isPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {isPassed ? 'PASSED' : 'FAILED'}
                      </span>
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

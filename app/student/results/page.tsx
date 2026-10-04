'use client';

import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface ExamResultItem {
  id: string;
  examName: string;
  subjectName: string;
  marks: number;
  grade: string;
  totalMarks: number;
  passingMarks: number;
}

export default function StudentResultsPage() {
  const [results, setResults] = useState<ExamResultItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch('/api/results');
        const data = await res.json();
        if (data.success) setResults(data.data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, []);

  if (loading) return <LoadingSpinner label="Loading Examination Transcript..." />;

  const totalObtained = results.reduce((sum, r) => sum + r.marks, 0);
  const totalMax = results.reduce((sum, r) => sum + (r.totalMarks || 100), 0);
  const avgMarksPercent = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : '85.0';

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Examination Results & Grades</h1>
        <p className="text-xs text-slate-500">Official academic transcript and letter grade evaluation.</p>
      </div>

      {/* Overview Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">Cumulative Academic Score</span>
          <h2 className="text-4xl font-extrabold mt-1">{avgMarksPercent}%</h2>
          <p className="text-xs text-slate-300 mt-1">
            Total Marks Obtained: {totalObtained} / {totalMax}
          </p>
        </div>
        <div>
          <Badge variant="purple">Semester GPA: {(Number(avgMarksPercent) / 10).toFixed(2)} / 10.0</Badge>
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-6 py-3.5">Examination Title</th>
              <th className="px-6 py-3.5">Subject</th>
              <th className="px-6 py-3.5 text-center">Marks Obtained</th>
              <th className="px-6 py-3.5 text-center">Letter Grade</th>
              <th className="px-6 py-3.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {results.map((r, idx) => {
              const isPassed = r.marks >= (r.passingMarks || 40);
              return (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{r.examName}</td>
                  <td className="px-6 py-4">
                    <Badge variant="info">{r.subjectName}</Badge>
                  </td>
                  <td className="px-6 py-4 text-center font-extrabold text-slate-900 dark:text-slate-100">
                    {r.marks} / {r.totalMarks || 100}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={r.grade.startsWith('A') ? 'success' : 'purple'}>
                      Grade {r.grade}
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
      </div>
    </div>
  );
}

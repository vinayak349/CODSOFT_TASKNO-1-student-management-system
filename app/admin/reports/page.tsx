'use client';

import React, { useState } from 'react';
import { BarChart3, Download, Filter, FileText } from 'lucide-react';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
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

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState('academic');
  const [selectedClass, setSelectedClass] = useState('all');

  const gradeDistributionData = [
    { grade: 'A+', count: 18, color: '#10b981' },
    { grade: 'A', count: 32, color: '#06b6d4' },
    { grade: 'B+', count: 24, color: '#3b82f6' },
    { grade: 'B', count: 15, color: '#8b5cf6' },
    { grade: 'C', count: 6, color: '#f59e0b' },
    { grade: 'F', count: 2, color: '#ef4444' },
  ];

  const departmentPerformanceData = [
    { dept: 'Computer Science', avgScore: 84.5, attendance: 91 },
    { dept: 'Information Tech', avgScore: 81.2, attendance: 88 },
    { dept: 'Electronics', avgScore: 78.6, attendance: 85 },
    { dept: 'Mechanical Engg', avgScore: 76.4, attendance: 82 },
  ];

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Student ID,Name,Class,Attendance %,CGPA,Fee Status\nSTU2026001,Rahul Sharma,BCA (Sem 5),87%,8.5,PAID\nSTU2026002,Aman Kumar,BCA (Sem 5),92%,9.2,PARTIAL\nSTU2026003,Rohit Singh,BCA (Sem 5),74%,7.4,PENDING\nSTU2026004,Vikas Gupta,BCA (Sem 5),88%,8.8,OVERDUE\nSTU2026005,Priya Patel,B.Tech CS (Sem 3),95%,9.5,PAID";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EduManage_Academic_Report_${reportType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Institutional Analytics & Reports</h1>
          <p className="text-xs text-slate-500">Generate, view, and export academic performance, attendance, and fee collection summaries.</p>
        </div>
        <Button onClick={handleExportCSV} icon={<Download className="w-4 h-4" />}>
          Export CSV Report
        </Button>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 uppercase">Report Module:</span>
        </div>

        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="academic">Academic & Grade Distribution</option>
          <option value="attendance">Institutional Attendance Trends</option>
          <option value="fee">Fee Collection Analysis</option>
        </select>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="all">All Academic Batches</option>
          <option value="bca5">BCA - Semester 5</option>
          <option value="cs3">B.Tech CS - Semester 3</option>
          <option value="it1">B.Tech IT - Semester 1</option>
        </select>
      </div>

      {/* Summary Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Enrolled Students</span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">1,245</h3>
          <span className="text-[11px] text-emerald-500 font-semibold">98.2% Active Status</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">Overall Pass Percentage</span>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">94.8%</h3>
          <span className="text-[11px] text-slate-500">Passing Benchmark: 40 Marks</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">Average Attendance</span>
          <h3 className="text-2xl font-bold text-brand-600 dark:text-brand-400 mt-1">87.4%</h3>
          <span className="text-[11px] text-slate-500">Across 54 Course Subjects</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">Fee Recovery Rate</span>
          <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">82.1%</h3>
          <span className="text-[11px] text-slate-500">Total Receipts: ₹2,40,000</span>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution Bar Chart */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Grade Letter Distribution</h3>
              <p className="text-xs text-slate-500">Student count by final letter grade awarded in examinations</p>
            </div>
            <Badge variant="purple">Midterms 2026</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistributionData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="grade" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {gradeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Departmental Average Performance */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Departmental Performance Comparison</h3>
              <p className="text-xs text-slate-500">Average exam marks percentage across major departments</p>
            </div>
            <Badge variant="info">Semester 5</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentPerformanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" stroke="#94a3b8" domain={[0, 100]} />
                <YAxis dataKey="dept" type="category" stroke="#94a3b8" width={110} fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                  }}
                />
                <Bar dataKey="avgScore" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { Award, Plus, Trash2, Calendar, FileText } from 'lucide-react';
import { DataTable, Column } from '@/components/DataTable';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Badge } from '@/components/Badge';
import { ConfirmDialog } from '@/components/ConfirmDialog';
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

interface SubjectItem {
  id: string;
  name: string;
  code: string;
}

export default function AdminExaminationsPage() {
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentExam, setCurrentExam] = useState<ExamItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    subjectId: '',
    date: '2026-10-25',
    totalMarks: 100,
    passingMarks: 40,
  });

  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchExams = async () => {
    try {
      const res = await fetch('/api/exams');
      const data = await res.json();
      if (data.success) setExams(data.data);
    } catch (e) {
      showToast('error', 'Failed to fetch exams list');
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/subjects');
      const data = await res.json();
      if (data.success) setSubjects(data.data);
    } catch (e) {}
  };

  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([fetchExams(), fetchSubjects()]);
      setLoading(false);
    }
    init();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      subjectId: subjects[0]?.id || '',
      date: '2026-10-25',
      totalMarks: 100,
      passingMarks: 40,
    });
    setIsAddModalOpen(true);
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalMarks: Number(formData.totalMarks),
          passingMarks: Number(formData.passingMarks),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast('error', 'Unable to schedule examination', data.error);
        setIsSubmitting(false);
        return;
      }

      showToast('success', 'Examination Scheduled Successfully');
      setIsAddModalOpen(false);
      fetchExams();
    } catch (err) {
      showToast('error', 'An error occurred during exam scheduling');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExam = async () => {
    if (!currentExam) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/exams/${currentExam.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast('error', 'Unable to delete examination', data.error);
        setIsSubmitting(false);
        return;
      }
      showToast('success', 'Examination Removed');
      setIsDeleteOpen(false);
      fetchExams();
    } catch (err) {
      showToast('error', 'An error occurred during deletion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<ExamItem>[] = [
    {
      key: 'name',
      header: 'Examination Title',
      render: (ex) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 dark:text-slate-100">{ex.name}</span>
        </div>
      ),
    },
    {
      key: 'subjectName',
      header: 'Subject',
      render: (ex) => <Badge variant="info">{ex.subjectName || ex.subjectId}</Badge>,
    },
    {
      key: 'date',
      header: 'Scheduled Date',
      render: (ex) => <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{ex.date}</span>,
    },
    {
      key: 'totalMarks',
      header: 'Marks Scale',
      render: (ex) => (
        <span className="text-xs text-slate-600 dark:text-slate-300">
          Max: <span className="font-bold">{ex.totalMarks}</span> • Passing: <span className="font-bold text-emerald-600 dark:text-emerald-400">{ex.passingMarks}</span>
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (ex) => (
        <button
          onClick={() => {
            setCurrentExam(ex);
            setIsDeleteOpen(true);
          }}
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          title="Delete Exam"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  if (loading) return <LoadingSpinner label="Loading Examination Schedule..." />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <Toast toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Examination Management</h1>
          <p className="text-xs text-slate-500">Schedule midterms, finals, maximum total marks, and passing benchmarks.</p>
        </div>
        <Button onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
          Create New Examination
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={exams}
        searchPlaceholder="Search examination title or subject..."
        emptyMessage="No scheduled examinations found."
      />

      {/* Add Exam Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Schedule New Examination">
        <form onSubmit={handleCreateExam} className="space-y-4">
          <Input
            label="Examination Name"
            placeholder="e.g. Mid Semester Examination - DBMS"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Select
            label="Subject"
            value={formData.subjectId}
            onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
            options={subjects.map((s) => ({ value: s.id, label: `${s.name} (${s.code})` }))}
            required
          />

          <Input
            label="Examination Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Total Marks"
              type="number"
              value={formData.totalMarks}
              onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
              required
            />
            <Input
              label="Passing Marks"
              type="number"
              value={formData.passingMarks}
              onChange={(e) => setFormData({ ...formData, passingMarks: Number(e.target.value) })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Schedule Examination
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Exam Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteExam}
        message={`Are you sure you want to remove examination "${currentExam?.name}"?`}
        isLoading={isSubmitting}
      />
    </div>
  );
}

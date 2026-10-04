'use client';

import React, { useEffect, useState } from 'react';
import { School, Plus, Edit, Trash2, Users, BookOpen } from 'lucide-react';
import { DataTable, Column } from '@/components/DataTable';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Badge } from '@/components/Badge';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Toast, ToastMessage } from '@/components/Toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface ClassItem {
  id: string;
  name: string;
  semester: string;
  academicYear: string;
  studentCount?: number;
  subjectCount?: number;
}

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState<ClassItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    semester: 'Semester 1',
    academicYear: '2026-27',
  });

  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes');
      const data = await res.json();
      if (data.success) {
        setClasses(data.data);
      }
    } catch (e) {
      showToast('error', 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleOpenAdd = () => {
    setFormData({ name: '', semester: 'Semester 1', academicYear: '2026-27' });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (cls: ClassItem) => {
    setCurrentClass(cls);
    setFormData({ name: cls.name, semester: cls.semester, academicYear: cls.academicYear });
    setIsEditModalOpen(true);
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast('error', 'Unable to create class', data.error);
        setIsSubmitting(false);
        return;
      }
      showToast('success', 'Class Created Successfully');
      setIsAddModalOpen(false);
      fetchClasses();
    } catch (err) {
      showToast('error', 'An error occurred during class creation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClass) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/classes/${currentClass.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast('error', 'Unable to update class', data.error);
        setIsSubmitting(false);
        return;
      }
      showToast('success', 'Class Updated Successfully');
      setIsEditModalOpen(false);
      fetchClasses();
    } catch (err) {
      showToast('error', 'An error occurred during update');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClass = async () => {
    if (!currentClass) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/classes/${currentClass.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast('error', 'Unable to delete class', data.error);
        setIsSubmitting(false);
        return;
      }
      showToast('success', 'Class Removed Successfully');
      setIsDeleteOpen(false);
      fetchClasses();
    } catch (err) {
      showToast('error', 'An error occurred during deletion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<ClassItem>[] = [
    {
      key: 'name',
      header: 'Program / Degree Name',
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <School className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 dark:text-slate-100">{c.name}</span>
        </div>
      ),
    },
    {
      key: 'semester',
      header: 'Semester',
      render: (c) => <Badge variant="info">{c.semester}</Badge>,
    },
    {
      key: 'academicYear',
      header: 'Academic Session',
      render: (c) => <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">{c.academicYear}</span>,
    },
    {
      key: 'studentCount',
      header: 'Enrolled Students',
      render: (c) => (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
          <Users className="w-3.5 h-3.5 text-brand-500" />
          {c.studentCount ?? 0} Students
        </span>
      ),
    },
    {
      key: 'subjectCount',
      header: 'Course Subjects',
      render: (c) => (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
          <BookOpen className="w-3.5 h-3.5 text-purple-500" />
          {c.subjectCount ?? 0} Subjects
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (c) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEdit(c)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
            title="Edit Class"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setCurrentClass(c);
              setIsDeleteOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete Class"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner label="Loading Academic Classes..." />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <Toast toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Class & Batch Directory</h1>
          <p className="text-xs text-slate-500">Manage academic programs, semester divisions, and batch allocations.</p>
        </div>
        <Button onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
          Create New Class
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={classes}
        searchPlaceholder="Search classes by name, semester, or academic year..."
        emptyMessage="No academic classes created yet."
      />

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Class / Batch">
        <form onSubmit={handleCreateClass} className="space-y-4">
          <Input
            label="Program Name"
            placeholder="e.g. BCA or B.Tech Computer Science"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Semester"
            placeholder="e.g. Semester 5"
            value={formData.semester}
            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
            required
          />
          <Input
            label="Academic Year"
            placeholder="e.g. 2026-27"
            value={formData.academicYear}
            onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create Class
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Class Details">
        <form onSubmit={handleUpdateClass} className="space-y-4">
          <Input
            label="Program Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Semester"
            value={formData.semester}
            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
            required
          />
          <Input
            label="Academic Year"
            value={formData.academicYear}
            onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteClass}
        message={`Are you sure you want to remove ${currentClass?.name} (${currentClass?.semester})?`}
        isLoading={isSubmitting}
      />
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Edit, Trash2 } from 'lucide-react';
import { DataTable, Column } from '@/components/DataTable';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Badge } from '@/components/Badge';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Toast, ToastMessage } from '@/components/Toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface SubjectItem {
  id: string;
  name: string;
  code: string;
  credits: number;
  classId?: string;
  className?: string;
}

interface ClassOption {
  id: string;
  name: string;
  semester: string;
}

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<SubjectItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 4,
    classId: '',
  });

  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/subjects');
      const data = await res.json();
      if (data.success) setSubjects(data.data);
    } catch (e) {
      showToast('error', 'Failed to fetch subjects');
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
      await Promise.all([fetchSubjects(), fetchClasses()]);
      setLoading(false);
    }
    init();
  }, []);

  const handleOpenAdd = () => {
    setFormData({ name: '', code: '', credits: 4, classId: classes[0]?.id || '' });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (sub: SubjectItem) => {
    setCurrentSubject(sub);
    setFormData({ name: sub.name, code: sub.code, credits: sub.credits, classId: sub.classId || '' });
    setIsEditModalOpen(true);
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, credits: Number(formData.credits) }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast('error', 'Unable to create subject', data.error);
        setIsSubmitting(false);
        return;
      }
      showToast('success', 'Subject Added to Catalog');
      setIsAddModalOpen(false);
      fetchSubjects();
    } catch (err) {
      showToast('error', 'An error occurred while adding subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSubject) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/subjects/${currentSubject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, credits: Number(formData.credits) }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast('error', 'Unable to update subject', data.error);
        setIsSubmitting(false);
        return;
      }
      showToast('success', 'Subject Updated Successfully');
      setIsEditModalOpen(false);
      fetchSubjects();
    } catch (err) {
      showToast('error', 'An error occurred during update');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubject = async () => {
    if (!currentSubject) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/subjects/${currentSubject.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast('error', 'Unable to delete subject', data.error);
        setIsSubmitting(false);
        return;
      }
      showToast('success', 'Subject Removed');
      setIsDeleteOpen(false);
      fetchSubjects();
    } catch (err) {
      showToast('error', 'An error occurred during deletion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<SubjectItem>[] = [
    {
      key: 'code',
      header: 'Subject Code',
      render: (s) => <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">{s.code}</span>,
    },
    {
      key: 'name',
      header: 'Subject Name',
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-slate-100">{s.name}</span>
        </div>
      ),
    },
    {
      key: 'credits',
      header: 'Credit Hours',
      render: (s) => <Badge variant="purple">{s.credits} Credits</Badge>,
    },
    {
      key: 'className',
      header: 'Assigned Batch / Class',
      render: (s) => <Badge variant="info">{s.className || 'General'}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (s) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEdit(s)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
            title="Edit Subject"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setCurrentSubject(s);
              setIsDeleteOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete Subject"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner label="Loading Subject Catalog..." />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <Toast toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Subject & Course Catalog</h1>
          <p className="text-xs text-slate-500">Configure academic subjects, unique course codes, and credit hours.</p>
        </div>
        <Button onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
          Add New Subject
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={subjects}
        searchPlaceholder="Search subjects by name or code..."
        emptyMessage="No course subjects found in catalog."
      />

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Subject to Catalog">
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <Input
            label="Subject Title"
            placeholder="e.g. Database Management System"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Subject Code"
              placeholder="e.g. DBMS501"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
            <Input
              label="Credits"
              type="number"
              min={1}
              max={10}
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
              required
            />
          </div>
          <Select
            label="Assigned Class / Program"
            value={formData.classId}
            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
            options={classes.map((c) => ({ value: c.id, label: `${c.name} (${c.semester})` }))}
            placeholder="General / All Batches"
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Add Subject
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Subject Details">
        <form onSubmit={handleUpdateSubject} className="space-y-4">
          <Input
            label="Subject Title"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Subject Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
            <Input
              label="Credits"
              type="number"
              min={1}
              max={10}
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
              required
            />
          </div>
          <Select
            label="Assigned Class"
            value={formData.classId}
            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
            options={classes.map((c) => ({ value: c.id, label: `${c.name} (${c.semester})` }))}
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
        onConfirm={handleDeleteSubject}
        message={`Are you sure you want to remove subject ${currentSubject?.name} (${currentSubject?.code})?`}
        isLoading={isSubmitting}
      />
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { UserCheck, UserPlus, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { DataTable, Column } from '@/components/DataTable';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Badge } from '@/components/Badge';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Toast, ToastMessage } from '@/components/Toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface Teacher {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  subjectNames?: string[];
}

interface Subject {
  id: string;
  name: string;
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    password: 'teacher123',
    subjectIds: [] as string[],
  });

  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchTeachers = async () => {
    try {
      let url = '/api/teachers';
      if (selectedDeptFilter) url += `?department=${encodeURIComponent(selectedDeptFilter)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setTeachers(data.data);
      }
    } catch (e) {
      showToast('error', 'Failed to fetch teachers');
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/subjects');
      const data = await res.json();
      if (data.success) {
        setSubjects(data.data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([fetchTeachers(), fetchSubjects()]);
      setLoading(false);
    }
    init();
  }, [selectedDeptFilter]);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      employeeId: `EMP20260${Math.floor(10 + Math.random() * 89)}`,
      email: '',
      phone: '',
      department: 'Computer Science',
      password: 'teacher123',
      subjectIds: [],
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (teacher: Teacher) => {
    setCurrentTeacher(teacher);
    setFormData({
      name: teacher.name,
      employeeId: teacher.employeeId,
      email: teacher.email,
      phone: teacher.phone || '',
      department: teacher.department || 'Computer Science',
      password: '',
      subjectIds: [],
    });
    setIsEditModalOpen(true);
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast('error', 'Unable to create teacher', data.error);
        setIsSubmitting(false);
        return;
      }

      showToast('success', 'Teacher Account Created', `${formData.name} added to faculty.`);
      setIsAddModalOpen(false);
      fetchTeachers();
    } catch (err) {
      showToast('error', 'An error occurred during teacher creation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTeacher) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/teachers/${currentTeacher.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast('error', 'Unable to update teacher', data.error);
        setIsSubmitting(false);
        return;
      }

      showToast('success', 'Teacher Updated Successfully');
      setIsEditModalOpen(false);
      fetchTeachers();
    } catch (err) {
      showToast('error', 'An error occurred during update');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeacher = async () => {
    if (!currentTeacher) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/teachers/${currentTeacher.id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast('error', 'Unable to delete teacher', data.error);
        setIsSubmitting(false);
        return;
      }

      showToast('success', 'Teacher Removed', `${currentTeacher.name} removed from faculty.`);
      setIsDeleteOpen(false);
      fetchTeachers();
    } catch (err) {
      showToast('error', 'An error occurred during deletion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<Teacher>[] = [
    {
      key: 'employeeId',
      header: 'Employee ID',
      render: (t) => <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">{t.employeeId}</span>,
    },
    {
      key: 'name',
      header: 'Faculty Name',
      render: (t) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 font-bold flex items-center justify-center text-xs border border-purple-200 dark:border-purple-800">
            {t.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{t.name}</p>
            <p className="text-xs text-slate-500">{t.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      render: (t) => <Badge variant="purple">{t.department || 'General'}</Badge>,
    },
    {
      key: 'subjectNames',
      header: 'Assigned Subjects',
      render: (t) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {t.subjectNames && t.subjectNames.length > 0 ? (
            t.subjectNames.map((s, idx) => (
              <Badge key={idx} variant="info">{s}</Badge>
            ))
          ) : (
            <span className="text-xs text-slate-400">None assigned</span>
          )}
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Contact',
      render: (t) => <span className="text-xs text-slate-600 dark:text-slate-400">{t.phone || 'N/A'}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (t) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEdit(t)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
            title="Edit Faculty"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setCurrentTeacher(t);
              setIsDeleteOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete Faculty"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner label="Loading Faculty Roster..." />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <Toast toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Faculty Management</h1>
          <p className="text-xs text-slate-500">Manage institution professors, instructors, departments, and course assignments.</p>
        </div>
        <Button onClick={handleOpenAdd} icon={<UserPlus className="w-4 h-4" />}>
          Add Faculty Member
        </Button>
      </div>

      {/* Department Filter & Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 uppercase">Filter Department:</span>
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Communication">Electronics & Communication</option>
          </select>
        </div>

        <DataTable
          columns={columns}
          data={teachers}
          searchPlaceholder="Search faculty by name, employee ID, or email..."
          emptyMessage="No faculty members found matching search filters."
        />
      </div>

      {/* Add Teacher Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Faculty Member" maxWidth="lg">
        <form onSubmit={handleCreateTeacher} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name & Title"
              placeholder="e.g. Prof. Sarah Jenkins"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Employee ID"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Institutional Email"
              type="email"
              placeholder="name@edumanage.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Phone Number"
              placeholder="+1 555-0192"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <Select
            label="Department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            options={[
              { value: 'Computer Science', label: 'Computer Science' },
              { value: 'Information Technology', label: 'Information Technology' },
              { value: 'Electronics & Communication', label: 'Electronics & Communication' },
            ]}
          />

          <Input
            label="Account Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            helperText="Default initial password: teacher123"
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Register Faculty
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Teacher Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Faculty Profile" maxWidth="lg">
        <form onSubmit={handleUpdateTeacher} className="space-y-4">
          <Input
            label="Full Name & Title"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <Select
            label="Department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            options={[
              { value: 'Computer Science', label: 'Computer Science' },
              { value: 'Information Technology', label: 'Information Technology' },
              { value: 'Electronics & Communication', label: 'Electronics & Communication' },
            ]}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Save Faculty Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Teacher Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteTeacher}
        message={`Are you sure you want to remove ${currentTeacher?.name} (${currentTeacher?.employeeId}) from faculty?`}
        isLoading={isSubmitting}
      />
    </div>
  );
}

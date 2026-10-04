'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Eye, Edit, Trash2, UserPlus, Filter } from 'lucide-react';
import { DataTable, Column } from '@/components/DataTable';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Badge } from '@/components/Badge';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Toast, ToastMessage } from '@/components/Toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  status: string;
  classId?: string;
  className?: string;
}

interface ClassOption {
  id: string;
  name: string;
  semester: string;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedClassFilter, setSelectedClassFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    classId: '',
    password: 'student123',
  });

  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchStudents = async () => {
    try {
      let url = '/api/students';
      if (selectedClassFilter) url += `?classId=${selectedClassFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setStudents(data.data);
      }
    } catch (e) {
      showToast('error', 'Failed to load students list');
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes');
      const data = await res.json();
      if (data.success) {
        setClasses(data.data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([fetchStudents(), fetchClasses()]);
      setLoading(false);
    }
    init();
  }, [selectedClassFilter]);

  const handleOpenAdd = () => {
    setFormData({
      firstName: '',
      lastName: '',
      studentId: `STU20260${Math.floor(10 + Math.random() * 89)}`,
      email: '',
      phone: '',
      dateOfBirth: '2004-01-01',
      gender: 'Male',
      address: '',
      classId: classes[0]?.id || '',
      password: 'student123',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setCurrentStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      studentId: student.studentId,
      email: student.email,
      phone: student.phone || '',
      dateOfBirth: student.dateOfBirth || '',
      gender: student.gender || 'Male',
      address: student.address || '',
      classId: student.classId || '',
      password: '',
    });
    setIsEditModalOpen(true);
  };

  const handleOpenView = (student: Student) => {
    setCurrentStudent(student);
    setIsViewModalOpen(true);
  };

  const handleOpenDelete = (student: Student) => {
    setCurrentStudent(student);
    setIsDeleteOpen(true);
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast('error', 'Unable to create student', data.error);
        setIsSubmitting(false);
        return;
      }

      showToast('success', 'Student Created Successfully', `${formData.firstName} ${formData.lastName} has been enrolled.`);
      setIsAddModalOpen(false);
      fetchStudents();
    } catch (err) {
      showToast('error', 'An error occurred while creating student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/students/${currentStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast('error', 'Unable to update student', data.error);
        setIsSubmitting(false);
        return;
      }

      showToast('success', 'Student Updated Successfully');
      setIsEditModalOpen(false);
      fetchStudents();
    } catch (err) {
      showToast('error', 'An error occurred while updating student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!currentStudent) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/students/${currentStudent.id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast('error', 'Unable to delete student', data.error);
        setIsSubmitting(false);
        return;
      }

      showToast('success', 'Student Deleted', `Record for ${currentStudent.firstName} has been removed.`);
      setIsDeleteOpen(false);
      fetchStudents();
    } catch (err) {
      showToast('error', 'An error occurred while deleting student');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 font-bold flex items-center justify-center text-xs border border-brand-200 dark:border-brand-800">
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
      header: 'Class / Program',
      render: (s) => <Badge variant="info">{s.className || 'Unassigned'}</Badge>,
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (s) => <span className="text-xs text-slate-600 dark:text-slate-400">{s.phone || 'N/A'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (s) => (
        <Badge variant={s.status === 'ACTIVE' ? 'success' : 'warning'}>
          {s.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (s) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenView(s)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(s)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
            title="Edit Student"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenDelete(s)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete Student"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner label="Loading Institutional Students Database..." />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <Toast toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Student Directory</h1>
          <p className="text-xs text-slate-500">Manage enrolled student accounts, class assignments, and profiles.</p>
        </div>
        <Button onClick={handleOpenAdd} icon={<UserPlus className="w-4 h-4" />}>
          Add New Student
        </Button>
      </div>

      {/* Filters & Data Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 uppercase">Filter Class:</span>
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Batches & Classes</option>
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
          searchPlaceholder="Search by student name, ID, or email..."
          emptyMessage="No students found matching search filters."
        />
      </div>

      {/* Add Student Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Enroll New Student" maxWidth="lg">
        <form onSubmit={handleCreateStudent} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Student Roll/ID"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
            <Select
              label="Assigned Class"
              value={formData.classId}
              onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              options={classes.map((c) => ({ value: c.id, label: `${c.name} - ${c.semester}` }))}
              placeholder="Select Class"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
            />
          </div>

          <Input
            label="Home Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Address details..."
          />

          <Input
            label="Initial Account Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            helperText="Default password: student123"
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create Student Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Student Profile" maxWidth="lg">
        <form onSubmit={handleUpdateStudent} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email Address"
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

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Assigned Class"
              value={formData.classId}
              onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              options={classes.map((c) => ({ value: c.id, label: `${c.name} - ${c.semester}` }))}
            />
            <Input
              label="Home Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Save Student Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Student Details Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Student Comprehensive Record" maxWidth="md">
        {currentStudent && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60">
              <div className="w-14 h-14 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-xl">
                {currentStudent.firstName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {currentStudent.firstName} {currentStudent.lastName}
                </h3>
                <p className="font-mono text-xs text-brand-600 dark:text-brand-400 font-semibold">{currentStudent.studentId}</p>
                <div className="mt-1">
                  <Badge variant="info">{currentStudent.className || 'Unassigned'}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold uppercase">Email</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{currentStudent.email}</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold uppercase">Phone</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{currentStudent.phone || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold uppercase">Date of Birth</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{currentStudent.dateOfBirth || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold uppercase">Gender</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{currentStudent.gender || 'N/A'}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-400 block font-semibold uppercase">Residential Address</span>
              <span className="text-slate-800 dark:text-slate-200">{currentStudent.address || 'No address provided'}</span>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Student Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        message={`Are you sure you want to delete ${currentStudent?.firstName} ${currentStudent?.lastName} (${currentStudent?.studentId})? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  );
}

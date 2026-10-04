'use client';

import React, { useEffect, useState } from 'react';
import { CreditCard, Plus, DollarSign, CheckCircle2, Filter } from 'lucide-react';
import { DataTable, Column } from '@/components/DataTable';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Badge } from '@/components/Badge';
import { Toast, ToastMessage } from '@/components/Toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface FeeItem {
  id: string;
  studentId: string;
  studentName?: string;
  studentRollNo?: string;
  title: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE';
  paymentDate?: string;
}

interface StudentOption {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
}

export default function AdminFeesPage() {
  const [fees, setFees] = useState<FeeItem[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [currentFee, setCurrentFee] = useState<FeeItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [feeForm, setFeeForm] = useState({
    studentId: '',
    title: 'Semester 5 Tuition Fee',
    amount: 45000,
    dueDate: '2026-11-15',
  });

  const [payForm, setPayForm] = useState({
    amount: 0,
    paymentMethod: 'ONLINE',
    referenceNo: '',
  });

  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchFees = async () => {
    try {
      let url = '/api/fees';
      if (statusFilter) url += `?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setFees(data.data);
    } catch (e) {
      showToast('error', 'Failed to fetch fee records');
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      if (data.success) setStudents(data.data);
    } catch (e) {}
  };

  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([fetchFees(), fetchStudents()]);
      setLoading(false);
    }
    init();
  }, [statusFilter]);

  const handleOpenAdd = () => {
    setFeeForm({
      studentId: students[0]?.id || '',
      title: 'Semester 5 Tuition Fee',
      amount: 45000,
      dueDate: '2026-11-15',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenPay = (fee: FeeItem) => {
    setCurrentFee(fee);
    const remaining = fee.amount - fee.paidAmount;
    setPayForm({
      amount: remaining,
      paymentMethod: 'ONLINE',
      referenceNo: `PAY2026-${Math.floor(100000 + Math.random() * 900000)}`,
    });
    setIsPayModalOpen(true);
  };

  const handleCreateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...feeForm, amount: Number(feeForm.amount) }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast('error', 'Unable to create fee record', data.error);
        setIsSubmitting(false);
        return;
      }
      showToast('success', 'Fee Record Created');
      setIsAddModalOpen(false);
      fetchFees();
    } catch (err) {
      showToast('error', 'An error occurred during fee creation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFee) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/fees/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feeId: currentFee.id,
          amount: Number(payForm.amount),
          paymentMethod: payForm.paymentMethod,
          referenceNo: payForm.referenceNo,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast('error', 'Unable to record payment', data.error);
        setIsSubmitting(false);
        return;
      }
      showToast('success', 'Payment Recorded Successfully');
      setIsPayModalOpen(false);
      fetchFees();
    } catch (err) {
      showToast('error', 'An error occurred during payment processing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<FeeItem>[] = [
    {
      key: 'title',
      header: 'Fee Record Title',
      render: (f) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">{f.title}</p>
          <p className="text-xs text-slate-500">Due Date: {f.dueDate}</p>
        </div>
      ),
    },
    {
      key: 'studentName',
      header: 'Student Name',
      render: (f) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{f.studentName || f.studentId}</p>
          <p className="font-mono text-xs text-slate-500">{f.studentRollNo}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Total Fee',
      render: (f) => <span className="font-bold text-slate-900 dark:text-slate-100">₹{f.amount.toLocaleString()}</span>,
    },
    {
      key: 'paidAmount',
      header: 'Paid Amount',
      render: (f) => <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{f.paidAmount.toLocaleString()}</span>,
    },
    {
      key: 'remaining',
      header: 'Remaining',
      render: (f) => {
        const rem = f.amount - f.paidAmount;
        return <span className={`font-bold ${rem > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>₹{rem.toLocaleString()}</span>;
      },
    },
    {
      key: 'status',
      header: 'Payment Status',
      render: (f) => (
        <Badge
          variant={
            f.status === 'PAID'
              ? 'success'
              : f.status === 'PARTIAL'
              ? 'warning'
              : f.status === 'OVERDUE'
              ? 'danger'
              : 'neutral'
          }
        >
          {f.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (f) => (
        <div>
          {f.status !== 'PAID' && (
            <Button size="sm" variant="outline" onClick={() => handleOpenPay(f)} icon={<DollarSign className="w-3.5 h-3.5" />}>
              Record Payment
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner label="Loading Financial Fee Ledger..." />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <Toast toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Fee Ledger Management</h1>
          <p className="text-xs text-slate-500">Track semester tuition fees, partial receipts, pending balances, and payment records.</p>
        </div>
        <Button onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
          Issue Fee Record
        </Button>
      </div>

      {/* Status Filter Bar */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-semibold text-slate-500 uppercase">Filter Status:</span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Payment Statuses</option>
          <option value="PAID">PAID</option>
          <option value="PARTIAL">PARTIAL</option>
          <option value="PENDING">PENDING</option>
          <option value="OVERDUE">OVERDUE</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={fees}
        searchPlaceholder="Search by fee title, student name, or roll no..."
        emptyMessage="No fee records found matching status filter."
      />

      {/* Add Fee Record Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Issue Fee Record">
        <form onSubmit={handleCreateFee} className="space-y-4">
          <Select
            label="Select Student"
            value={feeForm.studentId}
            onChange={(e) => setFeeForm({ ...feeForm, studentId: e.target.value })}
            options={students.map((s) => ({ value: s.id, label: `${s.firstName} ${s.lastName} (${s.studentId})` }))}
            required
          />

          <Input
            label="Fee Title"
            value={feeForm.title}
            onChange={(e) => setFeeForm({ ...feeForm, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Total Fee Amount (₹)"
              type="number"
              value={feeForm.amount}
              onChange={(e) => setFeeForm({ ...feeForm, amount: Number(e.target.value) })}
              required
            />

            <Input
              label="Payment Due Date"
              type="date"
              value={feeForm.dueDate}
              onChange={(e) => setFeeForm({ ...feeForm, dueDate: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Issue Fee Record
            </Button>
          </div>
        </form>
      </Modal>

      {/* Record Payment Modal */}
      <Modal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} title="Record Fee Payment Receipt">
        {currentFee && (
          <form onSubmit={handleRecordPayment} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs space-y-1">
              <p className="font-semibold text-slate-900 dark:text-slate-100">{currentFee.title}</p>
              <p className="text-slate-500">Student: {currentFee.studentName} ({currentFee.studentRollNo})</p>
              <p className="text-slate-500">Total: ₹{currentFee.amount.toLocaleString()} | Already Paid: ₹{currentFee.paidAmount.toLocaleString()}</p>
            </div>

            <Input
              label="Payment Amount (₹)"
              type="number"
              value={payForm.amount}
              onChange={(e) => setPayForm({ ...payForm, amount: Number(e.target.value) })}
              max={currentFee.amount - currentFee.paidAmount}
              required
            />

            <Select
              label="Payment Method"
              value={payForm.paymentMethod}
              onChange={(e) => setPayForm({ ...payForm, paymentMethod: e.target.value })}
              options={[
                { value: 'ONLINE', label: 'Online Gateway / UPI' },
                { value: 'BANK_TRANSFER', label: 'Bank NEFT / IMPS' },
                { value: 'CASH', label: 'Cash Desk Receipt' },
                { value: 'CHECK', label: 'Demand Draft / Check' },
              ]}
            />

            <Input
              label="Transaction Ref / Receipt No"
              value={payForm.referenceNo}
              onChange={(e) => setPayForm({ ...payForm, referenceNo: e.target.value })}
              placeholder="e.g. PAY2026-99281"
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" type="button" onClick={() => setIsPayModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Record Payment
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

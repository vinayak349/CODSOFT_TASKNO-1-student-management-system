'use client';

import React, { useEffect, useState } from 'react';
import { CreditCard, DollarSign, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Toast, ToastMessage } from '@/components/Toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface FeePayment {
  id: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  referenceNo?: string;
}

interface FeeItem {
  id: string;
  title: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE';
  paymentDate?: string;
  payments?: FeePayment[];
}

export default function StudentFeesPage() {
  const [fees, setFees] = useState<FeeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [currentFee, setCurrentFee] = useState<FeeItem | null>(null);
  const [payAmount, setPayAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('ONLINE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchFees = async () => {
    try {
      const res = await fetch('/api/fees');
      const data = await res.json();
      if (data.success) setFees(data.data);
    } catch (e) {
      showToast('error', 'Failed to fetch fee records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleOpenPay = (fee: FeeItem) => {
    setCurrentFee(fee);
    setPayAmount(fee.amount - fee.paidAmount);
    setIsPayModalOpen(true);
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFee) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/fees/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feeId: currentFee.id,
          amount: Number(payAmount),
          paymentMethod,
          referenceNo: `ONLINE-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast('error', 'Payment failed', data.error);
        setIsSubmitting(false);
        return;
      }

      showToast('success', 'Tuition Fee Payment Successful', 'Payment transaction receipt generated.');
      setIsPayModalOpen(false);
      fetchFees();
    } catch (err) {
      showToast('error', 'An error occurred during payment processing');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Fee Accounts..." />;

  const totalFeeAmount = fees.reduce((sum, f) => sum + f.amount, 0);
  const totalPaidAmount = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  const remainingDue = totalFeeAmount - totalPaidAmount;

  return (
    <div className="space-y-6 animate-fadeIn">
      <Toast toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Fee Statements & Payments</h1>
        <p className="text-xs text-slate-500">Track semester tuition statements, cleared dues, and digital receipts.</p>
      </div>

      {/* Financial Summary Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-900 via-amber-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">Remaining Balance Due</span>
          <h2 className="text-4xl font-extrabold mt-1">₹{remainingDue.toLocaleString()}</h2>
          <p className="text-xs text-slate-300 mt-1">
            Total Fees: ₹{totalFeeAmount.toLocaleString()} • Paid to Date: ₹{totalPaidAmount.toLocaleString()}
          </p>
        </div>
        <div>
          <Badge variant={remainingDue === 0 ? 'success' : 'warning'}>
            {remainingDue === 0 ? 'Fully Cleared' : 'Payment Due'}
          </Badge>
        </div>
      </div>

      {/* Fees List */}
      <div className="space-y-4">
        {fees.map((fee) => {
          const remaining = fee.amount - fee.paidAmount;
          return (
            <div key={fee.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{fee.title}</h3>
                  <p className="text-xs text-slate-500">Payment Due Date: {fee.dueDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={fee.status === 'PAID' ? 'success' : fee.status === 'PARTIAL' ? 'warning' : 'danger'}>
                    {fee.status}
                  </Badge>
                  {fee.status !== 'PAID' && (
                    <Button size="sm" onClick={() => handleOpenPay(fee)} icon={<DollarSign className="w-3.5 h-3.5" />}>
                      Pay Due Amount
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <span className="text-slate-400 font-semibold uppercase">Total Amount</span>
                  <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">₹{fee.amount.toLocaleString()}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <span className="text-slate-400 font-semibold uppercase">Amount Paid</span>
                  <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">₹{fee.paidAmount.toLocaleString()}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <span className="text-slate-400 font-semibold uppercase">Remaining Balance</span>
                  <p className={`text-base font-bold mt-0.5 ${remaining > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>
                    ₹{remaining.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Payment Receipts History */}
              {fee.payments && fee.payments.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Payment Receipts History</h4>
                  <div className="space-y-2">
                    {fee.payments.map((p) => (
                      <div key={p.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/20 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            ₹{p.amount.toLocaleString()} via {p.paymentMethod}
                          </span>
                        </div>
                        <span className="font-mono text-slate-400">{p.paymentDate} • Ref: {p.referenceNo || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pay Modal */}
      <Modal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} title="Process Online Fee Payment">
        {currentFee && (
          <form onSubmit={handlePaySubmit} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs space-y-1">
              <p className="font-semibold text-slate-900 dark:text-slate-100">{currentFee.title}</p>
              <p className="text-slate-500">Remaining Balance: ₹{(currentFee.amount - currentFee.paidAmount).toLocaleString()}</p>
            </div>

            <Input
              label="Enter Payment Amount (₹)"
              type="number"
              value={payAmount}
              onChange={(e) => setPayAmount(Number(e.target.value))}
              max={currentFee.amount - currentFee.paidAmount}
              required
            />

            <Select
              label="Select Online Payment Gateway"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              options={[
                { value: 'ONLINE', label: 'UPI / Instant Bank NetBanking' },
                { value: 'CARD', label: 'Credit / Debit Card' },
              ]}
            />

            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Simulated Instant Receipt Payment. No real bank charges incurred.</span>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" type="button" onClick={() => setIsPayModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Confirm Payment
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

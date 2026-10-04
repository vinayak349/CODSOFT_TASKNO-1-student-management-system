'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraduationCap, Mail, Lock, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { LoadingSpinner } from '@/components/LoadingSpinner';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(
    urlError
      ? urlError === 'Forbidden'
        ? 'Access forbidden for your account role.'
        : 'Please log in to continue.'
      : ''
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid credentials');
        setIsLoading(false);
        return;
      }

      router.push(data.redirectUrl);
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white">Welcome Back</h2>
        <p className="text-xs text-slate-400">Sign in with your institutional credentials</p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-medium animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@edumanage.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          required
        />

        <Button
          type="submit"
          className="w-full mt-2"
          size="lg"
          isLoading={isLoading}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In to Portal
        </Button>
      </form>

      {/* Quick Demo Credentials */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center">
          Quick Demo One-Click Fill
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => fillDemoAccount('admin@edumanage.com', 'admin123')}
            className="px-2.5 py-2 rounded-xl border border-purple-800/60 bg-purple-950/30 hover:bg-purple-900/50 text-purple-300 text-xs font-medium transition-all text-center flex flex-col items-center gap-1"
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => fillDemoAccount('sarah.jenkins@edumanage.com', 'teacher123')}
            className="px-2.5 py-2 rounded-xl border border-sky-800/60 bg-sky-950/30 hover:bg-sky-900/50 text-sky-300 text-xs font-medium transition-all text-center flex flex-col items-center gap-1"
          >
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
            <span>Teacher</span>
          </button>

          <button
            type="button"
            onClick={() => fillDemoAccount('rahul.sharma@edumanage.com', 'student123')}
            className="px-2.5 py-2 rounded-xl border border-emerald-800/60 bg-emerald-950/30 hover:bg-emerald-900/50 text-emerald-300 text-xs font-medium transition-all text-center flex flex-col items-center gap-1"
          >
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Student</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white shadow-xl shadow-brand-600/30 mb-2">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">EduManage</h1>
          <p className="text-sm text-slate-400">Institutional Education & Management Operating System</p>
        </div>

        {/* Suspense Wrapped Content */}
        <Suspense fallback={<LoadingSpinner label="Loading Login Desk..." />}>
          <LoginFormContent />
        </Suspense>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500">
          EduManage v1.0 • Protected by End-to-End Session Authorization
        </p>
      </div>
    </div>
  );
}

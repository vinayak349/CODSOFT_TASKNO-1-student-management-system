'use client';

import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, School, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function StudentProfilePage() {
  const [profile, setProfile] = useState({
    studentId: 'STU2026001',
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul.sharma@edumanage.com',
    phone: '+91 98765 43210',
    dateOfBirth: '14 May 2003',
    gender: 'Male',
    address: '123 University Green, Sector 62, Tech City',
    className: 'BCA (Semester 5)',
    status: 'ACTIVE',
  });

  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">My Profile</h1>
        <p className="text-xs text-slate-500">Personal information, institutional ID, and batch allocation details.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-brand-700 to-indigo-900 relative">
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 p-1 shadow-xl">
              <div className="w-full h-full rounded-xl bg-brand-600 text-white font-bold text-2xl flex items-center justify-center">
                {profile.firstName.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="font-mono text-xs font-semibold text-brand-600 dark:text-brand-400 mt-0.5">
                {profile.studentId}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="info">{profile.className}</Badge>
              <Badge variant="success">{profile.status}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Email Address</span>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{profile.email}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Contact Phone</span>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{profile.phone}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Date of Birth</span>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{profile.dateOfBirth}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Gender</span>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{profile.gender}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Permanent Residence</span>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{profile.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

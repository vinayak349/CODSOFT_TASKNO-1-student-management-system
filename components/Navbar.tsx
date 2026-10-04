'use client';

import React from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { Badge } from './Badge';

interface NavbarProps {
  title?: string;
  userName?: string;
  role?: 'ADMIN' | 'TEACHER' | 'STUDENT';
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  title = 'EduManage Portal',
  userName = 'User',
  role = 'ADMIN',
  onToggleSidebar,
}) => {
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (e) {
      window.location.href = '/login';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 lg:px-8 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-xl p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h2>
          <p className="text-xs text-slate-500 hidden sm:block">Academic Year 2026-27 • Semester Portal</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Pill */}
        <div className="relative">
          <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white dark:ring-slate-900"></span>
          </button>
        </div>

        {/* User Info Bar */}
        <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">{userName}</p>
            <div className="mt-0.5">
              <Badge variant={role === 'ADMIN' ? 'purple' : role === 'TEACHER' ? 'info' : 'success'} size="sm">
                {role}
              </Badge>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold border border-brand-200 dark:border-brand-800">
            <User className="w-4 h-4" />
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

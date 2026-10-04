'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  CalendarCheck,
  Award,
  CreditCard,
  BarChart3,
  User,
  LogOut,
  ChevronRight,
  School,
} from 'lucide-react';
import { Badge } from './Badge';

interface SidebarProps {
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  userName?: string;
  email?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, userName, email, isOpen = true, onClose }) => {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (e) {
      window.location.href = '/login';
    }
  };

  const adminLinks = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Students', href: '/admin/students', icon: <Users className="w-5 h-5" /> },
    { label: 'Teachers', href: '/admin/teachers', icon: <UserCheck className="w-5 h-5" /> },
    { label: 'Classes', href: '/admin/classes', icon: <School className="w-5 h-5" /> },
    { label: 'Subjects', href: '/admin/subjects', icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Attendance', href: '/admin/attendance', icon: <CalendarCheck className="w-5 h-5" /> },
    { label: 'Examinations', href: '/admin/examinations', icon: <Award className="w-5 h-5" /> },
    { label: 'Fee Records', href: '/admin/fees', icon: <CreditCard className="w-5 h-5" /> },
    { label: 'Reports & Analytics', href: '/admin/reports', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  const teacherLinks = [
    { label: 'Teacher Dashboard', href: '/teacher/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'My Students', href: '/teacher/students', icon: <Users className="w-5 h-5" /> },
    { label: 'Mark Attendance', href: '/teacher/attendance', icon: <CalendarCheck className="w-5 h-5" /> },
    { label: 'Exams & Marks', href: '/teacher/examinations', icon: <Award className="w-5 h-5" /> },
  ];

  const studentLinks = [
    { label: 'Student Dashboard', href: '/student/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'My Profile', href: '/student/profile', icon: <User className="w-5 h-5" /> },
    { label: 'My Attendance', href: '/student/attendance', icon: <CalendarCheck className="w-5 h-5" /> },
    { label: 'Exam Results', href: '/student/results', icon: <Award className="w-5 h-5" /> },
    { label: 'Fee Payments', href: '/student/fees', icon: <CreditCard className="w-5 h-5" /> },
  ];

  const navLinks = role === 'ADMIN' ? adminLinks : role === 'TEACHER' ? teacherLinks : studentLinks;

  const roleBadgeVariant = role === 'ADMIN' ? 'purple' : role === 'TEACHER' ? 'info' : 'success';

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col justify-between border-r border-slate-800 shadow-xl`}
    >
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white shadow-md shadow-brand-600/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">EduManage</h1>
              <span className="text-[10px] uppercase font-semibold text-brand-400 tracking-wider">Institution OS</span>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="px-4 py-4 border-b border-slate-800/60 bg-slate-950/40">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-800 text-brand-400 font-bold border border-slate-700">
              {userName ? userName.charAt(0).toUpperCase() : role.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{userName || 'EduManage User'}</p>
              <div className="mt-0.5">
                <Badge variant={roleBadgeVariant} size="sm">{role}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-4 px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-400'}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-rose-950/40 hover:text-rose-400 transition-colors"
        >
          <LogOut className="w-5 h-5 text-rose-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

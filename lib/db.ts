import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

// Types for EduManage
export interface StudentRecord {
  id: string;
  userId: string;
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
  createdAt: string;
}

export interface TeacherRecord {
  id: string;
  userId: string;
  employeeId: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  subjectNames?: string[];
  createdAt: string;
}

export interface ClassRecord {
  id: string;
  name: string;
  semester: string;
  academicYear: string;
  studentCount?: number;
  subjectCount?: number;
  createdAt: string;
}

export interface SubjectRecord {
  id: string;
  name: string;
  code: string;
  credits: number;
  classId?: string;
  className?: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
  subjectId: string;
  subjectName?: string;
  teacherId?: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

export interface ExamRecord {
  id: string;
  name: string;
  subjectId: string;
  subjectName?: string;
  date: string;
  totalMarks: number;
  passingMarks: number;
}

export interface ExamResultRecord {
  id: string;
  examId: string;
  examName?: string;
  studentId: string;
  studentName?: string;
  studentRollNo?: string;
  marks: number;
  grade: string;
  totalMarks?: number;
  passingMarks?: number;
}

export interface FeeRecord {
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
  payments?: { id: string; amount: number; paymentDate: string; paymentMethod: string; referenceNo?: string }[];
}

// In-Memory Fallback State (initialized with seed data)
const memoryStore = {
  users: [
    { id: 'usr_admin', name: 'Dr. Alexander Vance', email: 'admin@edumanage.com', password: '', role: 'ADMIN' },
    { id: 'usr_t1', name: 'Prof. Sarah Jenkins', email: 'sarah.jenkins@edumanage.com', password: '', role: 'TEACHER' },
    { id: 'usr_t2', name: 'Dr. Robert Chen', email: 'robert.chen@edumanage.com', password: '', role: 'TEACHER' },
    { id: 'usr_s1', name: 'Rahul Sharma', email: 'rahul.sharma@edumanage.com', password: '', role: 'STUDENT' },
    { id: 'usr_s2', name: 'Aman Kumar', email: 'aman.kumar@edumanage.com', password: '', role: 'STUDENT' },
    { id: 'usr_s3', name: 'Rohit Singh', email: 'rohit.singh@edumanage.com', password: '', role: 'STUDENT' },
    { id: 'usr_s4', name: 'Vikas Gupta', email: 'vikas.gupta@edumanage.com', password: '', role: 'STUDENT' },
    { id: 'usr_s5', name: 'Priya Patel', email: 'priya.patel@edumanage.com', password: '', role: 'STUDENT' },
  ],
  classes: [
    { id: 'cls_bca5', name: 'BCA', semester: 'Semester 5', academicYear: '2026-27', createdAt: new Date().toISOString() },
    { id: 'cls_cs3', name: 'B.Tech CS', semester: 'Semester 3', academicYear: '2026-27', createdAt: new Date().toISOString() },
    { id: 'cls_it1', name: 'B.Tech IT', semester: 'Semester 1', academicYear: '2026-27', createdAt: new Date().toISOString() },
  ] as ClassRecord[],
  subjects: [
    { id: 'sub_dbms', name: 'Database Management System', code: 'DBMS501', credits: 4, classId: 'cls_bca5', createdAt: new Date().toISOString() },
    { id: 'sub_web', name: 'Web Technologies & Next.js', code: 'WEB502', credits: 4, classId: 'cls_bca5', createdAt: new Date().toISOString() },
    { id: 'sub_cn', name: 'Computer Networks', code: 'CN503', credits: 3, classId: 'cls_bca5', createdAt: new Date().toISOString() },
    { id: 'sub_os', name: 'Operating Systems', code: 'OS301', credits: 4, classId: 'cls_cs3', createdAt: new Date().toISOString() },
  ] as SubjectRecord[],
  teachers: [
    { id: 'tch_1', userId: 'usr_t1', employeeId: 'EMP2026001', name: 'Prof. Sarah Jenkins', email: 'sarah.jenkins@edumanage.com', phone: '+1 555-0192', department: 'Computer Science', subjectIds: ['sub_dbms', 'sub_web'], createdAt: new Date().toISOString() },
    { id: 'tch_2', userId: 'usr_t2', employeeId: 'EMP2026002', name: 'Dr. Robert Chen', email: 'robert.chen@edumanage.com', phone: '+1 555-0198', department: 'Information Technology', subjectIds: ['sub_cn', 'sub_os'], createdAt: new Date().toISOString() },
  ] as (TeacherRecord & { subjectIds?: string[] })[],
  students: [
    { id: 'std_1', userId: 'usr_s1', studentId: 'STU2026001', firstName: 'Rahul', lastName: 'Sharma', email: 'rahul.sharma@edumanage.com', phone: '+91 98765 43210', dateOfBirth: '2003-05-14', gender: 'Male', address: '123 University Green, Sector 62, Tech City', status: 'ACTIVE', classId: 'cls_bca5', createdAt: new Date().toISOString() },
    { id: 'std_2', userId: 'usr_s2', studentId: 'STU2026002', firstName: 'Aman', lastName: 'Kumar', email: 'aman.kumar@edumanage.com', phone: '+91 98765 43211', dateOfBirth: '2003-08-22', gender: 'Male', address: '45 Knowledge Park, Tech City', status: 'ACTIVE', classId: 'cls_bca5', createdAt: new Date().toISOString() },
    { id: 'std_3', userId: 'usr_s3', studentId: 'STU2026003', firstName: 'Rohit', lastName: 'Singh', email: 'rohit.singh@edumanage.com', phone: '+91 98765 43212', dateOfBirth: '2003-11-03', gender: 'Male', address: '78 College Avenue, Tech City', status: 'ACTIVE', classId: 'cls_bca5', createdAt: new Date().toISOString() },
    { id: 'std_4', userId: 'usr_s4', studentId: 'STU2026004', firstName: 'Vikas', lastName: 'Gupta', email: 'vikas.gupta@edumanage.com', phone: '+91 98765 43213', dateOfBirth: '2003-02-18', gender: 'Male', address: '12 Innovation Hub, Tech City', status: 'ACTIVE', classId: 'cls_bca5', createdAt: new Date().toISOString() },
    { id: 'std_5', userId: 'usr_s5', studentId: 'STU2026005', firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@edumanage.com', phone: '+91 98765 43214', dateOfBirth: '2004-01-30', gender: 'Female', address: '89 Science Block, Tech City', status: 'ACTIVE', classId: 'cls_cs3', createdAt: new Date().toISOString() },
  ] as StudentRecord[],
  attendances: [
    { id: 'att_1', studentId: 'std_1', subjectId: 'sub_dbms', teacherId: 'tch_1', date: '2026-10-01', status: 'PRESENT' },
    { id: 'att_2', studentId: 'std_1', subjectId: 'sub_dbms', teacherId: 'tch_1', date: '2026-10-02', status: 'PRESENT' },
    { id: 'att_3', studentId: 'std_1', subjectId: 'sub_dbms', teacherId: 'tch_1', date: '2026-10-03', status: 'PRESENT' },
    { id: 'att_4', studentId: 'std_1', subjectId: 'sub_dbms', teacherId: 'tch_1', date: '2026-10-04', status: 'LATE' },
    { id: 'att_5', studentId: 'std_2', subjectId: 'sub_dbms', teacherId: 'tch_1', date: '2026-10-04', status: 'PRESENT' },
    { id: 'att_6', studentId: 'std_3', subjectId: 'sub_dbms', teacherId: 'tch_1', date: '2026-10-04', status: 'ABSENT' },
    { id: 'att_7', studentId: 'std_4', subjectId: 'sub_dbms', teacherId: 'tch_1', date: '2026-10-04', status: 'PRESENT' },
  ] as AttendanceRecord[],
  exams: [
    { id: 'ex_1', name: 'Mid Semester Examination - DBMS', subjectId: 'sub_dbms', date: '2026-10-20', totalMarks: 100, passingMarks: 40 },
    { id: 'ex_2', name: 'Mid Semester Examination - Web Tech', subjectId: 'sub_web', date: '2026-10-25', totalMarks: 100, passingMarks: 40 },
  ] as ExamRecord[],
  examResults: [
    { id: 'res_1', examId: 'ex_1', studentId: 'std_1', marks: 85, grade: 'A' },
    { id: 'res_2', examId: 'ex_1', studentId: 'std_2', marks: 92, grade: 'A+' },
    { id: 'res_3', examId: 'ex_1', studentId: 'std_3', marks: 74, grade: 'B+' },
    { id: 'res_4', examId: 'ex_1', studentId: 'std_4', marks: 88, grade: 'A' },
    { id: 'res_5', examId: 'ex_1', studentId: 'std_5', marks: 65, grade: 'B' },
  ] as ExamResultRecord[],
  fees: [
    { id: 'fee_1', studentId: 'std_1', title: 'Semester 5 Tuition Fee', amount: 45000, paidAmount: 45000, dueDate: '2026-11-15', status: 'PAID', paymentDate: '2026-10-01', payments: [{ id: 'pay_1', amount: 45000, paymentDate: '2026-10-01', paymentMethod: 'ONLINE', referenceNo: 'PAY2026-889123' }] },
    { id: 'fee_2', studentId: 'std_2', title: 'Semester 5 Tuition Fee', amount: 45000, paidAmount: 25000, dueDate: '2026-11-15', status: 'PARTIAL', paymentDate: '2026-10-01', payments: [{ id: 'pay_2', amount: 25000, paymentDate: '2026-10-01', paymentMethod: 'ONLINE', referenceNo: 'PAY2026-771234' }] },
    { id: 'fee_3', studentId: 'std_3', title: 'Semester 5 Tuition Fee', amount: 45000, paidAmount: 0, dueDate: '2026-11-15', status: 'PENDING', payments: [] },
    { id: 'fee_4', studentId: 'std_4', title: 'Semester 5 Tuition Fee', amount: 45000, paidAmount: 0, dueDate: '2026-10-01', status: 'OVERDUE', payments: [] },
    { id: 'fee_5', studentId: 'std_5', title: 'Semester 3 Tuition Fee', amount: 42000, paidAmount: 42000, dueDate: '2026-11-15', status: 'PAID', paymentDate: '2026-09-28', payments: [{ id: 'pay_3', amount: 42000, paymentDate: '2026-09-28', paymentMethod: 'BANK_TRANSFER', referenceNo: 'TXN992811' }] },
  ] as FeeRecord[],
};

// Fast-fail PostgreSQL connectivity check to avoid 5-second socket timeouts
let isPgAvailable: boolean | null = null;

async function isPostgresAvailable(): Promise<boolean> {
  if (isPgAvailable !== null) return isPgAvailable;
  try {
    const res = await Promise.race([
      prisma.user.findFirst({ select: { id: true } }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('PG_TIMEOUT')), 300)),
    ]);
    isPgAvailable = true;
    return true;
  } catch (e) {
    isPgAvailable = false;
    return false;
  }
}

// Initialize hashed passwords in memory store
let passwordsHashed = false;
async function initMemoryPasswords() {
  if (passwordsHashed) return;
  const adminPass = await bcrypt.hash('admin123', 10);
  const teacherPass = await bcrypt.hash('teacher123', 10);
  const studentPass = await bcrypt.hash('student123', 10);

  memoryStore.users.forEach(u => {
    if (u.role === 'ADMIN') u.password = adminPass;
    else if (u.role === 'TEACHER') u.password = teacherPass;
    else u.password = studentPass;
  });
  passwordsHashed = true;
}

// Grade calculation utility
export function calculateGrade(marks: number): string {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B+';
  if (marks >= 60) return 'B';
  if (marks >= 50) return 'C';
  if (marks >= 40) return 'D';
  return 'F';
}

// Unified Database Services
export const db = {
  // --- AUTHENTICATION ---
  async getUserByEmail(email: string) {
    if (await isPostgresAvailable()) {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
          include: { student: true, teacher: true },
        });
        if (user) return user;
      } catch (e) {
        isPgAvailable = false;
      }
    }
    await initMemoryPasswords();
    const memUser = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!memUser) return null;
    const student = memoryStore.students.find(s => s.userId === memUser.id);
    const teacher = memoryStore.teachers.find(t => t.userId === memUser.id);
    return {
      ...memUser,
      student,
      teacher,
    };
  },

  // --- STUDENTS ---
  async getStudents(search?: string, classId?: string) {
    if (await isPostgresAvailable()) {
      try {
        const where: any = {};
        if (classId) where.classId = classId;
        if (search) {
          where.OR = [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { studentId: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ];
        }
        const students = await prisma.student.findMany({
          where,
          include: { class: true },
          orderBy: { createdAt: 'desc' },
        });
        return students.map(s => ({
          id: s.id,
          userId: s.userId,
          studentId: s.studentId,
          firstName: s.firstName,
          lastName: s.lastName,
          email: s.email,
          phone: s.phone || '',
          dateOfBirth: s.dateOfBirth ? s.dateOfBirth.toISOString().split('T')[0] : '',
          gender: s.gender || '',
          address: s.address || '',
          status: s.status,
          classId: s.classId || '',
          className: s.class ? `${s.class.name} (${s.class.semester})` : 'Unassigned',
          createdAt: s.createdAt.toISOString(),
        }));
      } catch (e) {
        isPgAvailable = false;
      }
    }

    let filtered = [...memoryStore.students];
    if (classId) filtered = filtered.filter(s => s.classId === classId);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(s =>
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }
    return filtered.map(s => {
      const cls = memoryStore.classes.find(c => c.id === s.classId);
      return {
        ...s,
        className: cls ? `${cls.name} (${cls.semester})` : 'Unassigned',
      };
    });
  },

  async getStudentById(id: string) {
    if (await isPostgresAvailable()) {
      try {
        const student = await prisma.student.findFirst({
          where: { OR: [{ id }, { userId: id }] },
          include: { class: true, attendances: { include: { subject: true } }, examResults: { include: { exam: { include: { subject: true } } } }, fees: true },
        });
        if (student) return student;
      } catch (e) {
        isPgAvailable = false;
      }
    }

    const s = memoryStore.students.find(std => std.id === id || std.userId === id);
    if (!s) return null;
    const cls = memoryStore.classes.find(c => c.id === s.classId);
    return {
      ...s,
      class: cls,
      className: cls ? `${cls.name} (${cls.semester})` : 'Unassigned',
    };
  },

  async createStudent(data: {
    firstName: string;
    lastName: string;
    studentId: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    classId?: string;
    password?: string;
  }) {
    const hashedPass = await bcrypt.hash(data.password || 'student123', 10);
    if (await isPostgresAvailable()) {
      try {
        const user = await prisma.user.create({
          data: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            password: hashedPass,
            role: 'STUDENT',
            student: {
              create: {
                studentId: data.studentId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
                gender: data.gender,
                address: data.address,
                classId: data.classId || undefined,
              },
            },
          },
          include: { student: true },
        });
        return user.student;
      } catch (e) {
        isPgAvailable = false;
      }
    }

    const userId = `usr_s_${Date.now()}`;
    const stdId = `std_${Date.now()}`;
    memoryStore.users.push({
      id: userId,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: hashedPass,
      role: 'STUDENT',
    });
    const newStudent: StudentRecord = {
      id: stdId,
      userId,
      studentId: data.studentId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      address: data.address,
      status: 'ACTIVE',
      classId: data.classId,
      createdAt: new Date().toISOString(),
    };
    memoryStore.students.push(newStudent);
    return newStudent;
  },

  async updateStudent(id: string, data: Partial<StudentRecord>) {
    if (await isPostgresAvailable()) {
      try {
        const updated = await prisma.student.update({
          where: { id },
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            gender: data.gender,
            address: data.address,
            classId: data.classId,
            status: data.status,
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
          },
        });
        return updated;
      } catch (e) {
        isPgAvailable = false;
      }
    }

    const idx = memoryStore.students.findIndex(s => s.id === id);
    if (idx !== -1) {
      memoryStore.students[idx] = { ...memoryStore.students[idx], ...data };
      return memoryStore.students[idx];
    }
    return null;
  },

  async deleteStudent(id: string) {
    if (await isPostgresAvailable()) {
      try {
        const s = await prisma.student.findUnique({ where: { id } });
        if (s) {
          await prisma.user.delete({ where: { id: s.userId } });
          return true;
        }
      } catch (e) {
        isPgAvailable = false;
      }
    }

    const idx = memoryStore.students.findIndex(s => s.id === id);
    if (idx !== -1) {
      const userId = memoryStore.students[idx].userId;
      memoryStore.students.splice(idx, 1);
      memoryStore.users = memoryStore.users.filter(u => u.id !== userId);
      return true;
    }
    return false;
  },

  // --- TEACHERS ---
  async getTeachers(search?: string, department?: string) {
    if (await isPostgresAvailable()) {
      try {
        const where: any = {};
        if (department) where.department = department;
        if (search) {
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { employeeId: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ];
        }
        const teachers = await prisma.teacher.findMany({
          where,
          include: { teacherSubjects: { include: { subject: true } } },
          orderBy: { createdAt: 'desc' },
        });
        return teachers.map(t => ({
          id: t.id,
          userId: t.userId,
          employeeId: t.employeeId,
          name: t.name,
          email: t.email,
          phone: t.phone || '',
          department: t.department || 'General',
          subjectNames: t.teacherSubjects.map(ts => ts.subject.name),
          createdAt: t.createdAt.toISOString(),
        }));
      } catch (e) {
        isPgAvailable = false;
      }
    }

    let filtered = [...memoryStore.teachers];
    if (department) filtered = filtered.filter(t => t.department === department);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.employeeId.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q)
      );
    }
    return filtered.map(t => ({
      ...t,
      subjectNames: (t.subjectIds || []).map(id => memoryStore.subjects.find(s => s.id === id)?.name || id),
    }));
  },

  async createTeacher(data: {
    name: string;
    employeeId: string;
    email: string;
    phone?: string;
    department?: string;
    password?: string;
    subjectIds?: string[];
  }) {
    const hashedPass = await bcrypt.hash(data.password || 'teacher123', 10);
    if (await isPostgresAvailable()) {
      try {
        const user = await prisma.user.create({
          data: {
            name: data.name,
            email: data.email,
            password: hashedPass,
            role: 'TEACHER',
            teacher: {
              create: {
                employeeId: data.employeeId,
                name: data.name,
                email: data.email,
                phone: data.phone,
                department: data.department,
                teacherSubjects: data.subjectIds ? {
                  create: data.subjectIds.map(subId => ({ subjectId: subId }))
                } : undefined,
              },
            },
          },
          include: { teacher: true },
        });
        return user.teacher;
      } catch (e) {
        isPgAvailable = false;
      }
    }

    const userId = `usr_t_${Date.now()}`;
    const tchId = `tch_${Date.now()}`;
    memoryStore.users.push({
      id: userId,
      name: data.name,
      email: data.email,
      password: hashedPass,
      role: 'TEACHER',
    });
    const newTeacher = {
      id: tchId,
      userId,
      employeeId: data.employeeId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      department: data.department || 'Computer Science',
      subjectIds: data.subjectIds || [],
      createdAt: new Date().toISOString(),
    };
    memoryStore.teachers.push(newTeacher);
    return newTeacher;
  },

  async updateTeacher(id: string, data: Partial<TeacherRecord>) {
    if (await isPostgresAvailable()) {
      try {
        const updated = await prisma.teacher.update({
          where: { id },
          data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            department: data.department,
          },
        });
        return updated;
      } catch (e) {
        isPgAvailable = false;
      }
    }

    const idx = memoryStore.teachers.findIndex(t => t.id === id);
    if (idx !== -1) {
      memoryStore.teachers[idx] = { ...memoryStore.teachers[idx], ...data };
      return memoryStore.teachers[idx];
    }
    return null;
  },

  async deleteTeacher(id: string) {
    if (await isPostgresAvailable()) {
      try {
        const t = await prisma.teacher.findUnique({ where: { id } });
        if (t) {
          await prisma.user.delete({ where: { id: t.userId } });
          return true;
        }
      } catch (e) {
        isPgAvailable = false;
      }
    }

    const idx = memoryStore.teachers.findIndex(t => t.id === id);
    if (idx !== -1) {
      const userId = memoryStore.teachers[idx].userId;
      memoryStore.teachers.splice(idx, 1);
      memoryStore.users = memoryStore.users.filter(u => u.id !== userId);
      return true;
    }
    return false;
  },

  // --- CLASSES ---
  async getClasses() {
    if (await isPostgresAvailable()) {
      try {
        const classes = await prisma.class.findMany({
          include: { _count: { select: { students: true, subjects: true } } },
          orderBy: { name: 'asc' },
        });
        return classes.map(c => ({
          id: c.id,
          name: c.name,
          semester: c.semester,
          academicYear: c.academicYear,
          studentCount: c._count.students,
          subjectCount: c._count.subjects,
          createdAt: c.createdAt.toISOString(),
        }));
      } catch (e) {
        isPgAvailable = false;
      }
    }

    return memoryStore.classes.map(c => ({
      ...c,
      studentCount: memoryStore.students.filter(s => s.classId === c.id).length,
      subjectCount: memoryStore.subjects.filter(sub => sub.classId === c.id).length,
    }));
  },

  async createClass(data: { name: string; semester: string; academicYear: string }) {
    if (await isPostgresAvailable()) {
      try {
        return await prisma.class.create({ data });
      } catch (e) {
        isPgAvailable = false;
      }
    }

    const newCls = {
      id: `cls_${Date.now()}`,
      name: data.name,
      semester: data.semester,
      academicYear: data.academicYear,
      createdAt: new Date().toISOString(),
    };
    memoryStore.classes.push(newCls);
    return newCls;
  },

  async updateClass(id: string, data: Partial<ClassRecord>) {
    if (await isPostgresAvailable()) {
      try {
        return await prisma.class.update({ where: { id }, data });
      } catch (e) {
        isPgAvailable = false;
      }
    }

    const idx = memoryStore.classes.findIndex(c => c.id === id);
    if (idx !== -1) {
      memoryStore.classes[idx] = { ...memoryStore.classes[idx], ...data };
      return memoryStore.classes[idx];
    }
    return null;
  },

  async deleteClass(id: string) {
    if (await isPostgresAvailable()) {
      try {
        await prisma.class.delete({ where: { id } });
        return true;
      } catch (e) {
        isPgAvailable = false;
      }
    }

    const idx = memoryStore.classes.findIndex(c => c.id === id);
    if (idx !== -1) {
      memoryStore.classes.splice(idx, 1);
      return true;
    }
    return false;
  },

  // --- SUBJECTS ---
  async getSubjects(classId?: string) {
    if (await isPostgresAvailable()) {
      try {
        const where = classId ? { classId } : {};
        const subjects = await prisma.subject.findMany({
          where,
          include: { class: true },
          orderBy: { code: 'asc' },
        });
        return subjects.map(sub => ({
          id: sub.id,
          name: sub.name,
          code: sub.code,
          credits: sub.credits,
          classId: sub.classId || '',
          className: sub.class ? `${sub.class.name} (${sub.class.semester})` : 'General',
          createdAt: sub.createdAt.toISOString(),
        }));
      } catch (e) {
        isPgAvailable = false;
      }
    }

    let list = memoryStore.subjects;
    if (classId) list = list.filter(sub => sub.classId === classId);
    return list.map(sub => {
      const cls = memoryStore.classes.find(c => c.id === sub.classId);
      return {
        ...sub,
        className: cls ? `${cls.name} (${cls.semester})` : 'General',
      };
    });
  },

  async createSubject(data: { name: string; code: string; credits: number; classId?: string }) {
    if (await isPostgresAvailable()) {
      try {
        return await prisma.subject.create({ data });
      } catch (e) {
        isPgAvailable = false;
      }
    }

    const newSub = {
      id: `sub_${Date.now()}`,
      name: data.name,
      code: data.code,
      credits: Number(data.credits),
      classId: data.classId,
      createdAt: new Date().toISOString(),
    };
    memoryStore.subjects.push(newSub);
    return newSub;
  },

  async updateSubject(id: string, data: Partial<SubjectRecord>) {
    if (await isPostgresAvailable()) {
      try {
        return await prisma.subject.update({ where: { id }, data });
      } catch (e) {
        isPgAvailable = false;
      }
    }

    const idx = memoryStore.subjects.findIndex(sub => sub.id === id);
    if (idx !== -1) {
      memoryStore.subjects[idx] = { ...memoryStore.subjects[idx], ...data };
      return memoryStore.subjects[idx];
    }
    return null;
  },

  async deleteSubject(id: string) {
    if (await isPostgresAvailable()) {
      try {
        await prisma.subject.delete({ where: { id } });
        return true;
      } catch (e) {
        isPgAvailable = false;
      }
    }

    const idx = memoryStore.subjects.findIndex(sub => sub.id === id);
    if (idx !== -1) {
      memoryStore.subjects.splice(idx, 1);
      return true;
    }
    return false;
  },

  // --- ATTENDANCE ---
  async getAttendance(filters: { classId?: string; subjectId?: string; date?: string; studentId?: string }) {
    if (await isPostgresAvailable()) {
      try {
        const where: any = {};
        if (filters.subjectId) where.subjectId = filters.subjectId;
        if (filters.studentId) where.studentId = filters.studentId;
        if (filters.date) where.date = new Date(filters.date);
        if (filters.classId) where.student = { classId: filters.classId };

        const records = await prisma.attendance.findMany({
          where,
          include: { student: true, subject: true },
          orderBy: { date: 'desc' },
        });

        return records.map(r => ({
          id: r.id,
          studentId: r.studentId,
          studentName: `${r.student.firstName} ${r.student.lastName}`,
          subjectId: r.subjectId,
          subjectName: r.subject.name,
          teacherId: r.teacherId || undefined,
          date: r.date.toISOString().split('T')[0],
          status: r.status,
        }));
      } catch (e) {
        isPgAvailable = false;
      }
    }

    let filtered = [...memoryStore.attendances];
    if (filters.studentId) filtered = filtered.filter(a => a.studentId === filters.studentId);
    if (filters.subjectId) filtered = filtered.filter(a => a.subjectId === filters.subjectId);
    if (filters.date) filtered = filtered.filter(a => a.date === filters.date);

    return filtered.map(a => {
      const std = memoryStore.students.find(s => s.id === a.studentId);
      const sub = memoryStore.subjects.find(s => s.id === a.subjectId);
      return {
        ...a,
        studentName: std ? `${std.firstName} ${std.lastName}` : a.studentId,
        subjectName: sub ? sub.name : a.subjectId,
      };
    });
  },

  async saveAttendance(data: { classId: string; subjectId: string; date: string; records: { studentId: string; status: 'PRESENT' | 'ABSENT' | 'LATE' }[]; teacherId?: string }) {
    if (await isPostgresAvailable()) {
      const targetDate = new Date(data.date);
      try {
        for (const rec of data.records) {
          await prisma.attendance.upsert({
            where: {
              studentId_subjectId_date: {
                studentId: rec.studentId,
                subjectId: data.subjectId,
                date: targetDate,
              },
            },
            update: { status: rec.status, teacherId: data.teacherId },
            create: {
              studentId: rec.studentId,
              subjectId: data.subjectId,
              date: targetDate,
              status: rec.status,
              teacherId: data.teacherId,
            },
          });
        }
        return { success: true };
      } catch (e) {
        isPgAvailable = false;
      }
    }

    for (const rec of data.records) {
      const existingIdx = memoryStore.attendances.findIndex(
        a => a.studentId === rec.studentId && a.subjectId === data.subjectId && a.date === data.date
      );
      if (existingIdx !== -1) {
        memoryStore.attendances[existingIdx].status = rec.status;
      } else {
        memoryStore.attendances.push({
          id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          studentId: rec.studentId,
          subjectId: data.subjectId,
          teacherId: data.teacherId,
          date: data.date,
          status: rec.status,
        });
      }
    }
    return { success: true };
  },

  // --- EXAMS & RESULTS ---
  async getExams(subjectId?: string) {
    if (await isPostgresAvailable()) {
      try {
        const where = subjectId ? { subjectId } : {};
        const exams = await prisma.exam.findMany({
          where,
          include: { subject: true },
          orderBy: { date: 'asc' },
        });
        return exams.map(ex => ({
          id: ex.id,
          name: ex.name,
          subjectId: ex.subjectId,
          subjectName: ex.subject.name,
          date: ex.date.toISOString().split('T')[0],
          totalMarks: ex.totalMarks,
          passingMarks: ex.passingMarks,
        }));
      } catch (e) {
        isPgAvailable = false;
      }
    }

    let list = memoryStore.exams;
    if (subjectId) list = list.filter(ex => ex.subjectId === subjectId);
    return list.map(ex => {
      const sub = memoryStore.subjects.find(s => s.id === ex.subjectId);
      return {
        ...ex,
        subjectName: sub ? sub.name : 'Subject',
      };
    });
  },

  async createExam(data: { name: string; subjectId: string; date: string; totalMarks: number; passingMarks: number }) {
    if (await isPostgresAvailable()) {
      try {
        return await prisma.exam.create({
          data: {
            name: data.name,
            subjectId: data.subjectId,
            date: new Date(data.date),
            totalMarks: Number(data.totalMarks),
            passingMarks: Number(data.passingMarks),
          },
        });
      } catch (e) {
        isPgAvailable = false;
      }
    }

    const newEx = {
      id: `ex_${Date.now()}`,
      name: data.name,
      subjectId: data.subjectId,
      date: data.date,
      totalMarks: Number(data.totalMarks),
      passingMarks: Number(data.passingMarks),
    };
    memoryStore.exams.push(newEx);
    return newEx;
  },

  async deleteExam(id: string) {
    if (await isPostgresAvailable()) {
      try {
        await prisma.exam.delete({ where: { id } });
        return true;
      } catch (e) {
        isPgAvailable = false;
      }
    }

    const idx = memoryStore.exams.findIndex(ex => ex.id === id);
    if (idx !== -1) {
      memoryStore.exams.splice(idx, 1);
      return true;
    }
    return false;
  },

  async getExamResults(examId?: string, studentId?: string) {
    if (await isPostgresAvailable()) {
      try {
        const where: any = {};
        if (examId) where.examId = examId;
        if (studentId) where.studentId = studentId;

        const results = await prisma.examResult.findMany({
          where,
          include: { exam: { include: { subject: true } }, student: true },
        });

        return results.map(r => ({
          id: r.id,
          examId: r.examId,
          examName: r.exam.name,
          studentId: r.studentId,
          studentName: `${r.student.firstName} ${r.student.lastName}`,
          studentRollNo: r.student.studentId,
          marks: r.marks,
          grade: r.grade,
          totalMarks: r.exam.totalMarks,
          passingMarks: r.exam.passingMarks,
        }));
      } catch (e) {
        isPgAvailable = false;
      }
    }

    let filtered = [...memoryStore.examResults];
    if (examId) filtered = filtered.filter(r => r.examId === examId);
    if (studentId) filtered = filtered.filter(r => r.studentId === studentId);

    return filtered.map(r => {
      const ex = memoryStore.exams.find(e => e.id === r.examId);
      const std = memoryStore.students.find(s => s.id === r.studentId);
      return {
        ...r,
        examName: ex ? ex.name : 'Examination',
        studentName: std ? `${std.firstName} ${std.lastName}` : r.studentId,
        studentRollNo: std ? std.studentId : '',
        totalMarks: ex ? ex.totalMarks : 100,
        passingMarks: ex ? ex.passingMarks : 40,
      };
    });
  },

  async saveExamResults(data: { examId: string; records: { studentId: string; marks: number }[] }) {
    if (await isPostgresAvailable()) {
      try {
        for (const rec of data.records) {
          const grade = calculateGrade(rec.marks);
          await prisma.examResult.upsert({
            where: {
              examId_studentId: {
                examId: data.examId,
                studentId: rec.studentId,
              },
            },
            update: { marks: rec.marks, grade },
            create: {
              examId: data.examId,
              studentId: rec.studentId,
              marks: rec.marks,
              grade,
            },
          });
        }
        return { success: true };
      } catch (e) {
        isPgAvailable = false;
      }
    }

    for (const rec of data.records) {
      const grade = calculateGrade(rec.marks);
      const idx = memoryStore.examResults.findIndex(r => r.examId === data.examId && r.studentId === rec.studentId);
      if (idx !== -1) {
        memoryStore.examResults[idx].marks = rec.marks;
        memoryStore.examResults[idx].grade = grade;
      } else {
        memoryStore.examResults.push({
          id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          examId: data.examId,
          studentId: rec.studentId,
          marks: rec.marks,
          grade,
        });
      }
    }
    return { success: true };
  },

  // --- FEES ---
  async getFees(studentId?: string, status?: string) {
    if (await isPostgresAvailable()) {
      try {
        const where: any = {};
        if (studentId) where.studentId = studentId;
        if (status) where.status = status;

        const fees = await prisma.fee.findMany({
          where,
          include: { student: true, payments: true },
          orderBy: { dueDate: 'asc' },
        });

        return fees.map(f => ({
          id: f.id,
          studentId: f.studentId,
          studentName: `${f.student.firstName} ${f.student.lastName}`,
          studentRollNo: f.student.studentId,
          title: f.title,
          amount: f.amount,
          paidAmount: f.paidAmount,
          dueDate: f.dueDate.toISOString().split('T')[0],
          status: f.status,
          paymentDate: f.paymentDate ? f.paymentDate.toISOString().split('T')[0] : undefined,
          payments: f.payments.map(p => ({
            id: p.id,
            amount: p.amount,
            paymentDate: p.paymentDate.toISOString().split('T')[0],
            paymentMethod: p.paymentMethod,
            referenceNo: p.referenceNo || undefined,
          })),
        }));
      } catch (e) {
        isPgAvailable = false;
      }
    }

    let filtered = [...memoryStore.fees];
    if (studentId) filtered = filtered.filter(f => f.studentId === studentId);
    if (status) filtered = filtered.filter(f => f.status === status);

    return filtered.map(f => {
      const std = memoryStore.students.find(s => s.id === f.studentId);
      return {
        ...f,
        studentName: std ? `${std.firstName} ${std.lastName}` : f.studentId,
        studentRollNo: std ? std.studentId : '',
      };
    });
  },

  async createFee(data: { studentId: string; title: string; amount: number; dueDate: string }) {
    if (await isPostgresAvailable()) {
      try {
        return await prisma.fee.create({
          data: {
            studentId: data.studentId,
            title: data.title,
            amount: Number(data.amount),
            paidAmount: 0,
            dueDate: new Date(data.dueDate),
            status: 'PENDING',
          },
        });
      } catch (e) {
        isPgAvailable = false;
      }
    }

    const newFee = {
      id: `fee_${Date.now()}`,
      studentId: data.studentId,
      title: data.title,
      amount: Number(data.amount),
      paidAmount: 0,
      dueDate: data.dueDate,
      status: 'PENDING' as const,
      payments: [],
    };
    memoryStore.fees.push(newFee);
    return newFee;
  },

  async payFee(data: { feeId: string; amount: number; paymentMethod: string; referenceNo?: string }) {
    if (await isPostgresAvailable()) {
      try {
        const fee = await prisma.fee.findUnique({ where: { id: data.feeId } });
        if (fee) {
          const newPaidAmount = fee.paidAmount + Number(data.amount);
          const newStatus = newPaidAmount >= fee.amount ? 'PAID' : 'PARTIAL';

          await prisma.feePayment.create({
            data: {
              feeId: data.feeId,
              amount: Number(data.amount),
              paymentMethod: data.paymentMethod,
              referenceNo: data.referenceNo || `PAY-${Date.now()}`,
            },
          });

          return await prisma.fee.update({
            where: { id: data.feeId },
            data: {
              paidAmount: newPaidAmount,
              status: newStatus,
              paymentDate: new Date(),
            },
          });
        }
      } catch (e) {
        isPgAvailable = false;
      }
    }

    const feeIdx = memoryStore.fees.findIndex(f => f.id === data.feeId);
    if (feeIdx !== -1) {
      const f = memoryStore.fees[feeIdx];
      const newPaidAmount = f.paidAmount + Number(data.amount);
      const newStatus = newPaidAmount >= f.amount ? 'PAID' : 'PARTIAL';
      f.paidAmount = newPaidAmount;
      f.status = newStatus;
      f.paymentDate = new Date().toISOString().split('T')[0];
      if (!f.payments) f.payments = [];
      f.payments.push({
        id: `pay_${Date.now()}`,
        amount: Number(data.amount),
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: data.paymentMethod,
        referenceNo: data.referenceNo || `PAY-${Date.now()}`,
      });
      return f;
    }
    return null;
  },

  // --- STATS & REPORTS ---
  async getAdminStats() {
    const students = await this.getStudents();
    const teachers = await this.getTeachers();
    const classes = await this.getClasses();
    const fees = await this.getFees();
    const attendances = await this.getAttendance({});

    const totalStudents = students.length;
    const totalTeachers = teachers.length;
    const totalClasses = classes.length;

    const totalFeesAmount = fees.reduce((sum, f) => sum + f.amount, 0);
    const paidFeesAmount = fees.reduce((sum, f) => sum + f.paidAmount, 0);
    const pendingFeesAmount = totalFeesAmount - paidFeesAmount;

    const presentCount = attendances.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const avgAttendance = attendances.length > 0 ? Math.round((presentCount / attendances.length) * 100) : 87;

    return {
      totalStudents,
      totalTeachers,
      totalClasses,
      avgAttendance,
      totalFeesAmount,
      paidFeesAmount,
      pendingFeesAmount,
      upcomingExams: (await this.getExams()).length,
    };
  }
};

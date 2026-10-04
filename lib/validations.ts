import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

export const studentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  classId: z.string().optional(),
  password: z.string().min(4, 'Password must be at least 4 characters').optional(),
});

export const teacherSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  employeeId: z.string().min(1, 'Employee ID is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  department: z.string().optional(),
  password: z.string().min(4, 'Password must be at least 4 characters').optional(),
  subjectIds: z.array(z.string()).optional(),
});

export const classSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  semester: z.string().min(1, 'Semester is required'),
  academicYear: z.string().min(1, 'Academic year is required'),
});

export const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().min(1, 'Subject code is required'),
  credits: z.number().min(1, 'Credits must be at least 1').max(10, 'Max 10 credits'),
  classId: z.string().optional(),
});

export const attendanceMarkSchema = z.object({
  classId: z.string().min(1, 'Class is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  date: z.string().min(1, 'Date is required'),
  records: z.array(
    z.object({
      studentId: z.string(),
      status: z.enum(['PRESENT', 'ABSENT', 'LATE']),
    })
  ),
});

export const examSchema = z.object({
  name: z.string().min(1, 'Exam name is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  date: z.string().min(1, 'Exam date is required'),
  totalMarks: z.number().min(1, 'Total marks must be > 0'),
  passingMarks: z.number().min(1, 'Passing marks must be > 0'),
});

export const examResultSchema = z.object({
  examId: z.string().min(1, 'Exam is required'),
  records: z.array(
    z.object({
      studentId: z.string(),
      marks: z.number().min(0, 'Marks cannot be negative'),
    })
  ),
});

export const feeSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  title: z.string().min(1, 'Title is required'),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  dueDate: z.string().min(1, 'Due date is required'),
});

export const feePaymentSchema = z.object({
  feeId: z.string().min(1, 'Fee ID is required'),
  amount: z.number().min(1, 'Payment amount must be greater than 0'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  referenceNo: z.string().optional(),
});

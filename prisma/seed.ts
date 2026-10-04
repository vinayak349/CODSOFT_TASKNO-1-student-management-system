import { PrismaClient, Role, AttendanceStatus, FeeStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding EduManage database...');

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10);
  const teacherPassword = await bcrypt.hash('teacher123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);

  // 1. Create Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@edumanage.com' },
    update: {},
    create: {
      name: 'Dr. Alexander Vance',
      email: 'admin@edumanage.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log('Admin created:', adminUser.email);

  // 2. Create Classes
  const classBca5 = await prisma.class.create({
    data: {
      name: 'BCA',
      semester: 'Semester 5',
      academicYear: '2026-27',
    },
  });

  const classCs3 = await prisma.class.create({
    data: {
      name: 'B.Tech CS',
      semester: 'Semester 3',
      academicYear: '2026-27',
    },
  });

  const classIt1 = await prisma.class.create({
    data: {
      name: 'B.Tech IT',
      semester: 'Semester 1',
      academicYear: '2026-27',
    },
  });

  console.log('Classes created.');

  // 3. Create Subjects
  const dbmsSubject = await prisma.subject.create({
    data: {
      name: 'Database Management System',
      code: 'DBMS501',
      credits: 4,
      classId: classBca5.id,
    },
  });

  const webTechSubject = await prisma.subject.create({
    data: {
      name: 'Web Technologies & Next.js',
      code: 'WEB502',
      credits: 4,
      classId: classBca5.id,
    },
  });

  const cnSubject = await prisma.subject.create({
    data: {
      name: 'Computer Networks',
      code: 'CN503',
      credits: 3,
      classId: classBca5.id,
    },
  });

  const osSubject = await prisma.subject.create({
    data: {
      name: 'Operating Systems',
      code: 'OS301',
      credits: 4,
      classId: classCs3.id,
    },
  });

  console.log('Subjects created.');

  // 4. Create Teacher Users & Profiles
  const teacher1User = await prisma.user.create({
    data: {
      name: 'Prof. Sarah Jenkins',
      email: 'sarah.jenkins@edumanage.com',
      password: teacherPassword,
      role: Role.TEACHER,
      teacher: {
        create: {
          employeeId: 'EMP2026001',
          name: 'Prof. Sarah Jenkins',
          email: 'sarah.jenkins@edumanage.com',
          phone: '+1 555-0192',
          department: 'Computer Science',
        },
      },
    },
    include: { teacher: true },
  });

  const teacher2User = await prisma.user.create({
    data: {
      name: 'Dr. Robert Chen',
      email: 'robert.chen@edumanage.com',
      password: teacherPassword,
      role: Role.TEACHER,
      teacher: {
        create: {
          employeeId: 'EMP2026002',
          name: 'Dr. Robert Chen',
          email: 'robert.chen@edumanage.com',
          phone: '+1 555-0198',
          department: 'Information Technology',
        },
      },
    },
    include: { teacher: true },
  });

  // Assign subjects to teachers
  if (teacher1User.teacher) {
    await prisma.teacherSubject.createMany({
      data: [
        { teacherId: teacher1User.teacher.id, subjectId: dbmsSubject.id },
        { teacherId: teacher1User.teacher.id, subjectId: webTechSubject.id },
      ],
    });
  }

  if (teacher2User.teacher) {
    await prisma.teacherSubject.createMany({
      data: [
        { teacherId: teacher2User.teacher.id, subjectId: cnSubject.id },
        { teacherId: teacher2User.teacher.id, subjectId: osSubject.id },
      ],
    });
  }

  console.log('Teachers created and subjects assigned.');

  // 5. Create Students
  const studentData = [
    {
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul.sharma@edumanage.com',
      studentId: 'STU2026001',
      phone: '+91 98765 43210',
      dateOfBirth: new Date('2003-05-14'),
      gender: 'Male',
      address: '123 University Green, Sector 62, Tech City',
      classId: classBca5.id,
    },
    {
      firstName: 'Aman',
      lastName: 'Kumar',
      email: 'aman.kumar@edumanage.com',
      studentId: 'STU2026002',
      phone: '+91 98765 43211',
      dateOfBirth: new Date('2003-08-22'),
      gender: 'Male',
      address: '45 Knowledge Park, Tech City',
      classId: classBca5.id,
    },
    {
      firstName: 'Rohit',
      lastName: 'Singh',
      email: 'rohit.singh@edumanage.com',
      studentId: 'STU2026003',
      phone: '+91 98765 43212',
      dateOfBirth: new Date('2003-11-03'),
      gender: 'Male',
      address: '78 College Avenue, Tech City',
      classId: classBca5.id,
    },
    {
      firstName: 'Vikas',
      lastName: 'Gupta',
      email: 'vikas.gupta@edumanage.com',
      studentId: 'STU2026004',
      phone: '+91 98765 43213',
      dateOfBirth: new Date('2003-02-18'),
      gender: 'Male',
      address: '12 Innovation Hub, Tech City',
      classId: classBca5.id,
    },
    {
      firstName: 'Priya',
      lastName: 'Patel',
      email: 'priya.patel@edumanage.com',
      studentId: 'STU2026005',
      phone: '+91 98765 43214',
      dateOfBirth: new Date('2004-01-30'),
      gender: 'Female',
      address: '89 Science Block, Tech City',
      classId: classCs3.id,
    },
  ];

  const createdStudents = [];

  for (const s of studentData) {
    const sUser = await prisma.user.create({
      data: {
        name: `${s.firstName} ${s.lastName}`,
        email: s.email,
        password: studentPassword,
        role: Role.STUDENT,
        student: {
          create: {
            studentId: s.studentId,
            firstName: s.firstName,
            lastName: s.lastName,
            email: s.email,
            phone: s.phone,
            dateOfBirth: s.dateOfBirth,
            gender: s.gender,
            address: s.address,
            classId: s.classId,
          },
        },
      },
      include: { student: true },
    });
    if (sUser.student) createdStudents.push(sUser.student);
  }

  console.log(`Created ${createdStudents.length} students.`);

  // 6. Create Attendance Records
  const today = new Date();
  const pastDates = [
    new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000),
    new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
    new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
    new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
  ];

  for (const student of createdStudents) {
    for (const d of pastDates) {
      await prisma.attendance.create({
        data: {
          studentId: student.id,
          subjectId: dbmsSubject.id,
          teacherId: teacher1User.teacher?.id,
          date: d,
          status: Math.random() > 0.15 ? AttendanceStatus.PRESENT : (Math.random() > 0.5 ? AttendanceStatus.LATE : AttendanceStatus.ABSENT),
        },
      });

      await prisma.attendance.create({
        data: {
          studentId: student.id,
          subjectId: webTechSubject.id,
          teacherId: teacher1User.teacher?.id,
          date: d,
          status: Math.random() > 0.1 ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT,
        },
      });
    }
  }

  console.log('Attendance records seeded.');

  // 7. Create Exams & Exam Results
  const midExam = await prisma.exam.create({
    data: {
      name: 'Mid Semester Examination - DBMS',
      subjectId: dbmsSubject.id,
      date: new Date('2026-10-20'),
      totalMarks: 100,
      passingMarks: 40,
    },
  });

  const webExam = await prisma.exam.create({
    data: {
      name: 'Mid Semester Examination - Web Tech',
      subjectId: webTechSubject.id,
      date: new Date('2026-10-25'),
      totalMarks: 100,
      passingMarks: 40,
    },
  });

  const examMarksList = [
    { student: createdStudents[0], marks: 85, grade: 'A' },
    { student: createdStudents[1], marks: 92, grade: 'A+' },
    { student: createdStudents[2], marks: 74, grade: 'B+' },
    { student: createdStudents[3], marks: 88, grade: 'A' },
    { student: createdStudents[4], marks: 65, grade: 'B' },
  ];

  for (const item of examMarksList) {
    if (item.student) {
      await prisma.examResult.create({
        data: {
          examId: midExam.id,
          studentId: item.student.id,
          marks: item.marks,
          grade: item.grade,
        },
      });
    }
  }

  console.log('Exams and Exam Results seeded.');

  // 8. Create Fee Records
  for (const student of createdStudents) {
    const isPaid = student.studentId === 'STU2026001';
    const isPartial = student.studentId === 'STU2026002';
    
    const fee = await prisma.fee.create({
      data: {
        studentId: student.id,
        title: 'Semester 5 Tuition Fee',
        amount: 45000,
        paidAmount: isPaid ? 45000 : (isPartial ? 25000 : 0),
        dueDate: new Date('2026-11-15'),
        status: isPaid ? FeeStatus.PAID : (isPartial ? FeeStatus.PARTIAL : FeeStatus.PENDING),
        paymentDate: isPaid || isPartial ? new Date('2026-10-01') : null,
      },
    });

    if (isPaid || isPartial) {
      await prisma.feePayment.create({
        data: {
          feeId: fee.id,
          amount: fee.paidAmount,
          paymentMethod: 'ONLINE',
          referenceNo: `PAY2026-${Math.floor(100000 + Math.random() * 900000)}`,
        },
      });
    }
  }

  console.log('Fees seeded.');
  console.log('Database seeding completed successfully!');
}

main()
  .catch((e: any) => {
    if (e?.message?.includes("Can't reach database server") || e?.code === 'P1001') {
      console.log('\n------------------------------------------------------------');
      console.log('⚠️ PostgreSQL database server is not currently running on localhost:5432.');
      console.log('ℹ️ EduManage includes a zero-downtime pre-seeded dataset.');
      console.log('You can start the web app immediately with: npm run start');
      console.log('To seed a live PostgreSQL database: start PostgreSQL service on port 5432 and run: npm run seed');
      console.log('------------------------------------------------------------\n');
      process.exit(0);
    } else {
      console.error('Error during seeding:', e);
      process.exit(1);
    }
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

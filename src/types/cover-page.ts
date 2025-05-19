
export interface CoverPageData {
  reportType: 'Assignment' | 'Lab Report' | '';
  courseTitle: string;
  courseCode: string;
  teacherName: string;
  teacherDesignation: string;
  teacherDepartment: string;
  studentName: string;
  studentId: string;
  studentDepartment: string;
  studentBatch: string;
  studentSemester: string;
  universityName: string;
  universityAcronym: string;
  mainDepartmentName: string;
  universityLogoUrl?: string;
  submissionDate: Date | null;
}

export const initialCoverPageData: CoverPageData = {
  reportType: '',
  courseTitle: '',
  courseCode: '',
  teacherName: '',
  teacherDesignation: '',
  teacherDepartment: '',
  studentName: '',
  studentId: '',
  studentDepartment: '',
  studentBatch: '',
  studentSemester: '',
  universityName: 'SHEIKH FAZILATUNNESA MUJIB UNIVERSITY',
  universityAcronym: 'SFMU',
  mainDepartmentName: 'Dept. Of Computer Science & Engineering',
  universityLogoUrl: 'https://sfmu.edu.bd/wp-content/uploads/2023/10/logo.png', // Updated logo URL
  submissionDate: new Date(),
};

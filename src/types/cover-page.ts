
export interface CoverPageData {
  reportType: 'Assignment' | 'Lab Report' | undefined; // Ensure this allows undefined
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
  submissionDate: string;
}

export const initialCoverPageData: CoverPageData = {
  reportType: undefined, // Ensure this is initialized as undefined
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
  universityLogoUrl: '/images/university-logo.png',
  submissionDate: '',
};

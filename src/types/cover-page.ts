
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
  universityLogoUrl?: string; // Optional, for placeholder or future use
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
  universityName: 'SHEIKH FAZILATUNNESA MUJIB UNIVERSITY', // Default example
  universityAcronym: 'SFMU', // Default example
  mainDepartmentName: 'Dept. Of Computer Science & Engineering', // Default example
  universityLogoUrl: '',
  submissionDate: new Date(), // Default to today
};

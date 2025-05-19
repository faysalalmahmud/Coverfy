
export interface CoverPageData {
  reportType: 'Assignment' | 'Lab Report' | undefined; // Changed from '' to undefined
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
  reportType: undefined, // Changed from ''
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
  universityLogoUrl: 'https://school360.xyz/200837/200837_media/logos/contact_1711082709_2024-03-22.png',
  submissionDate: null, // Changed from new Date()
};

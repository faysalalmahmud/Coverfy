
export interface CoverPageData {
  reportType: 'Assignment' | 'Lab Report' | undefined;
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
  reportType: undefined,
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
  universityLogoUrl: 'https://drive.google.com/uc?export=download&id=1Rdjp5m6fjqhWD0bvQHotEUrSMemoXeyw',
  submissionDate: null,
};

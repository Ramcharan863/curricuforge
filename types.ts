
export type AppRole = 'Management' | 'Department' | 'Faculty' | 'Student';

export type AppView = 
  | 'dashboard'
  | 'curriculum' 
  | 'lesson-plan' 
  | 'assignment' 
  | 'update' 
  | 'institutional'
  | 'dept-details'
  | 'college-ai'
  | 'announcement'
  | 'student-study-plan'
  | 'student-time-mgmt'
  | 'student-practice'
  | 'student-interest-course'
  | 'timetable'
  | 'blooms'
  | 'student-announcements'
  | 'student-reminders'
  | 'student-tools';

export interface UserInfo {
  name: string;
  role: AppRole;
  collegeName: string;
  department: string;
  roleSpecificData: Record<string, string>;
}

export interface BaseParams {
  role: AppRole;
  collegeName: string;
  userName: string;
  department: string;
  roleSpecificData?: Record<string, string>;
}

export type ApprovalStatus = 'Pending' | 'Approved_Dept' | 'Approved_Mgmt' | 'Rejected';

export interface GeneratedContent {
  id: string;
  type: AppView;
  role: AppRole;
  userName: string;
  title: string;
  content: string;
  timestamp: number;
  isPublished?: boolean;
  collegeName: string;
  department: string;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  feedback?: string;
  targetAudience?: 'All' | 'Department' | 'Class';
  targetSection?: string;
  durationMillis?: number; // For time-locked answer keys
}

// Departmental Asset Types
export interface FacultyAsset {
  id: string;
  name: string;
  designation: string;
  specialization: string;
  load: string;
}

export interface StudentAsset {
  id: string;
  name: string;
  rollNo: string;
  year: string;
  section: string;
}

export interface SectionAsset {
  id: string;
  name: string;
  strength: number;
  classTeacher: string;
}

export interface ClassroomAsset {
  id: string;
  roomNo: string;
  type: 'Theory' | 'Lab' | 'Seminar';
  capacity: number;
}

export interface SyllabusDocument {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'image';
  postedAt: number;
  author: string;
}

export interface CurriculumParams extends BaseParams {
  subject: string;
  level: string;
  department: string;
  duration: string;
  difficulty: string;
}

export interface LessonPlanParams extends BaseParams {
  syllabus: string;
  prerequisites: string;
}

export interface AssignmentParams extends BaseParams {
  subject: string;
  durationHours: string;
  targetSection?: string;
}

export interface BloomsParams extends BaseParams {
  outcomes: string;
}

export interface UpdateParams extends BaseParams {
  existingCurriculum: string;
  changeRequest: string;
}

export interface InstitutionalParams extends BaseParams {
  institutionType: string;
  department: string;
  subject: string;
}

export interface CollegeAIParams extends BaseParams {
  query: string;
  context: string;
}

export interface StudentPlanParams extends BaseParams {
  currentCourses: string;
  goals: string;
}

export interface StudentPracticeParams extends BaseParams {
  subject: string;
  topic: string;
  intensity: 'Basic' | 'Challenge';
}

export interface StudentInterestCourseParams extends BaseParams {
  interestSubject: string;
  collegeHours: string;
  priorKnowledge: string;
}

export interface TimetableParams extends BaseParams {
  department: string;
  subjectsAndFaculty: string;
  sections: string;
  workingDays: string;
  periodsPerDay: number;
}

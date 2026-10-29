export type UserRole = 'peserta' | 'mentor' | 'admin';

export type InternStatus = 'Aktif' | 'Selesai' | 'Cuti';
export type AttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
export type LogbookStatus = 'Draft' | 'Menunggu Review' | 'Disetujui' | 'Perlu Revisi';
export type TaskStatus = 'Belum Dikerjakan' | 'Sedang Dikerjakan' | 'Menunggu Review' | 'Selesai';
export type TaskPriority = 'Tinggi' | 'Sedang' | 'Rendah';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  institution: string; // Universitas / SMK
  major: string; // Jurusan
  nimOrNis: string;
  divisionId: string;
  divisionName: string;
  mentorId: string;
  mentorName: string;
  startDate: string;
  endDate: string;
  status: InternStatus;
  phone: string;
  address: string;
  bio: string;
  skills: string[];
}

export interface Division {
  id: string;
  name: string;
  headName: string;
  description: string;
  internCount: number;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: string; // YYYY-MM-DD
  checkInTime: string | null; // HH:mm
  checkOutTime: string | null; // HH:mm
  status: AttendanceStatus;
  workMode: 'WFO' | 'WFH';
  location: string;
  notes?: string;
  attachmentUrl?: string;
}

export interface LogbookEntry {
  id: string;
  userId: string;
  userName: string;
  divisionName: string;
  date: string; // YYYY-MM-DD
  activityTitle: string;
  workDescription: string;
  learningGained: string;
  blockersOrChallenges: string;
  nextDayPlan: string;
  hoursSpent: number;
  status: LogbookStatus;
  mentorFeedback?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  assignedToUserId: string;
  assignedToUserName: string;
  assignedByMentorId: string;
  assignedByMentorName: string;
  divisionName: string;
  dueDate: string; // YYYY-MM-DD
  priority: TaskPriority;
  status: TaskStatus;
  submissionLink?: string;
  submissionNotes?: string;
  submittedAt?: string;
  score?: number; // 0 - 100
  mentorFeedback?: string;
  createdAt: string;
}

export interface LearningJournalEntry {
  id: string;
  userId: string;
  date: string;
  title: string;
  keyLearning: string; // Apa yang saya pelajari hari ini?
  improvementPlan: string; // Apa yang akan saya tingkatkan besok?
  category: 'Hard Skill' | 'Soft Skill' | 'Kolaborasi' | 'Problem Solving';
  tags: string[];
  mood: 'Sangat Semangat' | 'Produktif' | 'Tantangan Berat' | 'Butuh Dukungan';
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Disiplin' | 'Produktivitas' | 'Pembelajaran' | 'Kolaborasi';
  unlockedAt: string | null;
  progress: number; // 0 to 100
  targetLabel: string;
}

export interface InternEvaluation {
  id: string;
  internId: string;
  mentorId: string;
  period: string; // Bulan 1 / Tengah Periode / Akhir Periode
  date: string;
  criteria: {
    discipline: number; // 1-5
    workQuality: number; // 1-5
    initiative: number; // 1-5
    communication: number; // 1-5
    teamwork: number; // 1-5
  };
  overallNotes: string;
  strengths: string;
  areasToImprove: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

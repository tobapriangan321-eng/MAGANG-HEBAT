import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfile,
  UserRole,
  Division,
  AttendanceRecord,
  LogbookEntry,
  TaskItem,
  LearningJournalEntry,
  AchievementBadge,
  InternEvaluation,
  ToastMessage,
  AttendanceStatus,
  LogbookStatus,
  TaskStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_DIVISIONS,
  INITIAL_ATTENDANCE,
  INITIAL_LOGBOOKS,
  INITIAL_TASKS,
  INITIAL_JOURNALS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_EVALUATIONS,
} from '../data/mockData';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

export type ActiveView =
  | 'dashboard'
  | 'logbook'
  | 'tasks'
  | 'attendance'
  | 'journal'
  | 'achievements'
  | 'profile'
  | 'mentor-review'
  | 'admin-panel'
  | 'settings';

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: UserRole) => void;
  allUsers: UserProfile[];
  divisions: Division[];
  attendanceRecords: AttendanceRecord[];
  logbooks: LogbookEntry[];
  tasks: TaskItem[];
  journals: LearningJournalEntry[];
  achievements: AchievementBadge[];
  evaluations: InternEvaluation[];
  toasts: ToastMessage[];
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;

  // Firebase Auth
  firebaseUser: FirebaseUser | null;
  signInWithGoogle: () => Promise<void>;
  signOutFromGoogle: () => Promise<void>;
  isFirebaseConnected: boolean;

  // Actions
  handleCheckIn: (workMode: 'WFO' | 'WFH', location: string, notes?: string) => void;
  handleCheckOut: (notes?: string) => void;
  handleRequestLeave: (status: AttendanceStatus, date: string, notes: string) => void;
  getTodayAttendance: () => AttendanceRecord | undefined;

  // Logbook Actions
  saveLogbook: (entry: Omit<LogbookEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'userName' | 'divisionName'> & { id?: string }) => void;
  deleteLogbook: (id: string) => void;
  reviewLogbook: (id: string, status: LogbookStatus, feedback: string) => void;

  // Task Actions
  saveTask: (task: Partial<TaskItem> & { title: string; description: string; dueDate: string; priority: TaskItem['priority'] }) => void;
  deleteTask: (id: string) => void;
  submitTaskWork: (id: string, submissionLink: string, submissionNotes: string) => void;
  reviewTaskSubmission: (id: string, status: TaskStatus, score?: number, feedback?: string) => void;
  updateTaskStatusDirectly: (id: string, status: TaskStatus) => void;

  // Journal Actions
  saveJournal: (journal: Omit<LearningJournalEntry, 'id' | 'userId'> & { id?: string }) => void;
  deleteJournal: (id: string) => void;

  // Admin Actions
  updateUserStatus: (userId: string, status: UserProfile['status']) => void;
  saveUserProfile: (profile: Partial<UserProfile> & { id: string }) => void;
  addUser: (user: Omit<UserProfile, 'id'>) => void;
  deleteUser: (id: string) => void;
  addDivision: (division: Omit<Division, 'id' | 'internCount'>) => void;

  // Stats
  internStats: {
    totalDays: number;
    daysCompleted: number;
    progressPercentage: number;
    pendingTasksCount: number;
    totalLoggedActivities: number;
    attendanceCount: number;
  };

  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'magang_hebat_users_v1',
  DIVISIONS: 'magang_hebat_divisions_v1',
  ATTENDANCE: 'magang_hebat_attendance_v1',
  LOGBOOKS: 'magang_hebat_logbooks_v1',
  TASKS: 'magang_hebat_tasks_v1',
  JOURNALS: 'magang_hebat_journals_v1',
  ACHIEVEMENTS: 'magang_hebat_achievements_v1',
  EVALUATIONS: 'magang_hebat_evaluations_v1',
  CURRENT_USER_ID: 'magang_hebat_current_user_id_v1',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  // Load initial states from localStorage with fallbacks
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      return stored ? JSON.parse(stored) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user-intern-1';
    } catch {
      return 'user-intern-1';
    }
  });

  const [divisions, setDivisions] = useState<Division[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DIVISIONS);
      return stored ? JSON.parse(stored) : INITIAL_DIVISIONS;
    } catch {
      return INITIAL_DIVISIONS;
    }
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return stored ? JSON.parse(stored) : INITIAL_ATTENDANCE;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  });

  const [logbooks, setLogbooks] = useState<LogbookEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LOGBOOKS);
      return stored ? JSON.parse(stored) : INITIAL_LOGBOOKS;
    } catch {
      return INITIAL_LOGBOOKS;
    }
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
      return stored ? JSON.parse(stored) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [journals, setJournals] = useState<LearningJournalEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.JOURNALS);
      return stored ? JSON.parse(stored) : INITIAL_JOURNALS;
    } catch {
      return INITIAL_JOURNALS;
    }
  });

  const [achievements, setAchievements] = useState<AchievementBadge[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return stored ? JSON.parse(stored) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  });

  const [evaluations, setEvaluations] = useState<InternEvaluation[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EVALUATIONS);
      return stored ? JSON.parse(stored) : INITIAL_EVALUATIONS;
    } catch {
      return INITIAL_EVALUATIONS;
    }
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        setIsFirebaseConnected(true);
        // If user logged in with Google, check if user profile exists
        setAllUsers((prev) => {
          const existing = prev.find((u) => u.email === user.email || u.id === user.uid);
          if (existing) {
            setCurrentUserId(existing.id);
            return prev;
          } else {
            const isDefaultAdmin = user.email === 'tobapriangan321@gmail.com';
            const newUser: UserProfile = {
              id: user.uid,
              name: user.displayName || 'Akun Google Terverifikasi',
              email: user.email || '',
              role: isDefaultAdmin ? 'admin' : 'peserta',
              avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
              institution: isDefaultAdmin ? 'Sekretariat Magang Hebat' : 'Politeknik / Universitas',
              major: isDefaultAdmin ? 'Program Management' : 'Teknologi Informasi',
              nimOrNis: `ID-${user.uid.substring(0, 6)}`,
              divisionId: 'div-1',
              divisionName: 'Software Engineering',
              mentorId: 'user-mentor-1',
              mentorName: 'Budi Wicaksono, S.Kom',
              startDate: '2026-09-01',
              endDate: '2026-11-30',
              status: 'Aktif',
              phone: '+62 812-0000-0000',
              address: 'Jakarta, Indonesia',
              bio: 'Pengguna terverifikasi melalui Google Firebase Authentication.',
              skills: ['Teknologi', 'Kolaborasi', 'Manajemen'],
            };
            setCurrentUserId(newUser.id);
            return [newUser, ...prev];
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to Firestore Logbooks if signed in
  useEffect(() => {
    if (!firebaseUser) return;

    const path = 'logbooks';
    const unsub = onSnapshot(
      collection(db, path),
      (snapshot) => {
        if (!snapshot.empty) {
          const firestoreLogs: LogbookEntry[] = [];
          snapshot.forEach((d) => {
            firestoreLogs.push(d.data() as LogbookEntry);
          });
          if (firestoreLogs.length > 0) {
            setLogbooks((prev) => {
              const map = new Map<string, LogbookEntry>();
              prev.forEach((l) => map.set(l.id, l));
              firestoreLogs.forEach((l) => map.set(l.id, l));
              return Array.from(map.values()).sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
              );
            });
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return () => unsub();
  }, [firebaseUser]);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [allUsers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DIVISIONS, JSON.stringify(divisions));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [divisions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [attendanceRecords]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGBOOKS, JSON.stringify(logbooks));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [logbooks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [journals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [achievements]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(evaluations));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [evaluations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [currentUserId]);

  const currentUser = allUsers.find((u) => u.id === currentUserId) || allUsers[0];

  const setCurrentUser = (user: UserProfile) => {
    setCurrentUserId(user.id);
  };

  const switchRole = (role: UserRole) => {
    const targetUser = allUsers.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUserId(targetUser.id);
      showToast(
        'Ganti Peran Berhasil',
        `Sekarang Anda masuk sebagai ${targetUser.name} (${role.toUpperCase()})`,
        'info'
      );
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      showToast(
        'Login Google Berhasil! 🚀',
        `Selamat datang, ${result.user.displayName || result.user.email}! Data tersinkronisasi ke Cloud Firestore.`,
        'success'
      );
    } catch (error) {
      console.error('Google Sign-in error:', error);
      showToast('Gagal Login', 'Proses login Google dibatalkan atau terkendala popup.', 'error');
    }
  };

  const signOutFromGoogle = async () => {
    try {
      await signOut(auth);
      showToast('Logout Berhasil', 'Anda telah keluar dari sesi Google Firebase.', 'info');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const showToast = (title: string, message: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper date
  const getTodayDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getCurrentTimeString = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const getTodayAttendance = () => {
    const today = getTodayDateString();
    return attendanceRecords.find((a) => a.userId === currentUser.id && a.date === today);
  };

  // Check In
  const handleCheckIn = async (workMode: 'WFO' | 'WFH', location: string, notes?: string) => {
    const today = getTodayDateString();
    const timeNow = getCurrentTimeString();
    const existing = attendanceRecords.find((a) => a.userId === currentUser.id && a.date === today);

    if (existing && existing.checkInTime) {
      showToast('Sudah Check-In', 'Anda sudah melakukan check-in untuk hari ini.', 'warning');
      return;
    }

    let updatedRecord: AttendanceRecord;
    if (existing) {
      updatedRecord = {
        ...existing,
        checkInTime: timeNow,
        status: 'Hadir',
        workMode,
        location,
        notes: notes || existing.notes,
      };
      setAttendanceRecords((prev) =>
        prev.map((rec) => (rec.id === existing.id ? updatedRecord : rec))
      );
    } else {
      updatedRecord = {
        id: `att-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        date: today,
        checkInTime: timeNow,
        checkOutTime: null,
        status: 'Hadir',
        workMode,
        location,
        notes: notes || 'Check-in tepat waktu via web Magang Hebat.',
      };
      setAttendanceRecords((prev) => [updatedRecord, ...prev]);
    }

    // Sync to Firestore if authenticated
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'attendance', updatedRecord.id), updatedRecord, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `attendance/${updatedRecord.id}`);
      }
    }

    showToast('Check-In Berhasil! 🎉', `Tercatat pukul ${timeNow} WIB (${workMode}). Selamat berkarya!`, 'success');
  };

  // Check Out
  const handleCheckOut = async (notes?: string) => {
    const today = getTodayDateString();
    const timeNow = getCurrentTimeString();
    const existing = attendanceRecords.find((a) => a.userId === currentUser.id && a.date === today);

    if (!existing || !existing.checkInTime) {
      showToast('Belum Check-In', 'Anda harus melakukan check-in terlebih dahulu.', 'warning');
      return;
    }

    if (existing.checkOutTime) {
      showToast('Sudah Check-Out', 'Anda sudah melakukan check-out hari ini.', 'warning');
      return;
    }

    const updated = {
      ...existing,
      checkOutTime: timeNow,
      notes: notes ? `${existing.notes || ''} | Pulang: ${notes}` : existing.notes,
    };

    setAttendanceRecords((prev) =>
      prev.map((rec) => (rec.id === existing.id ? updated : rec))
    );

    // Sync to Firestore
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'attendance', updated.id), updated, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `attendance/${updated.id}`);
      }
    }

    showToast('Check-Out Berhasil! 👋', `Tercatat pukul ${timeNow} WIB. Terima kasih atas dedikasi Anda hari ini!`, 'success');
  };

  // Request Leave / Sick
  const handleRequestLeave = async (status: AttendanceStatus, date: string, notes: string) => {
    const newRecord: AttendanceRecord = {
      id: `att-leave-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      date,
      checkInTime: null,
      checkOutTime: null,
      status,
      workMode: 'WFH',
      location: 'Pengajuan Resmi',
      notes,
    };

    setAttendanceRecords((prev) => [newRecord, ...prev]);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'attendance', newRecord.id), newRecord, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `attendance/${newRecord.id}`);
      }
    }

    showToast('Pengajuan Terkirim', `Permohonan ${status} untuk tanggal ${date} berhasil dicatat.`, 'info');
  };

  // Logbook Management
  const saveLogbook = async (entryData: Omit<LogbookEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'userName' | 'divisionName'> & { id?: string }) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let targetEntry: LogbookEntry;

    if (entryData.id) {
      const existing = logbooks.find((l) => l.id === entryData.id);
      targetEntry = {
        ...existing,
        ...entryData,
        id: entryData.id,
        userId: existing?.userId || currentUser.id,
        userName: existing?.userName || currentUser.name,
        divisionName: existing?.divisionName || currentUser.divisionName,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
      } as LogbookEntry;

      setLogbooks((prev) =>
        prev.map((item) => (item.id === entryData.id ? targetEntry : item))
      );
      showToast('Logbook Diperbarui', `Laporan kegiatan "${entryData.activityTitle}" berhasil disimpan.`, 'success');
    } else {
      targetEntry = {
        ...entryData,
        id: `log-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        divisionName: currentUser.divisionName || 'Umum',
        createdAt: now,
        updatedAt: now,
      };
      setLogbooks((prev) => [targetEntry, ...prev]);
      showToast(
        entryData.status === 'Draft' ? 'Draft Disimpan' : 'Laporan Terkirim! 🚀',
        entryData.status === 'Draft'
          ? 'Logbook disimpan sebagai draft.'
          : 'Logbook diteruskan ke mentor untuk ditinjau.',
        'success'
      );
    }

    // Sync to Firestore
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'logbooks', targetEntry.id), targetEntry, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `logbooks/${targetEntry.id}`);
      }
    }
  };

  const deleteLogbook = async (id: string) => {
    setLogbooks((prev) => prev.filter((l) => l.id !== id));
    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'logbooks', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `logbooks/${id}`);
      }
    }
    showToast('Logbook Dihapus', 'Catatan aktivitas harian telah dihapus.', 'info');
  };

  const reviewLogbook = async (id: string, status: LogbookStatus, feedback: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let updatedLog: LogbookEntry | undefined;

    setLogbooks((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          updatedLog = {
            ...l,
            status,
            mentorFeedback: feedback,
            reviewedAt: now,
            reviewedBy: currentUser.name,
            updatedAt: now,
          };
          return updatedLog;
        }
        return l;
      })
    );

    if (updatedLog && auth.currentUser) {
      try {
        await setDoc(doc(db, 'logbooks', id), updatedLog, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `logbooks/${id}`);
      }
    }

    showToast(
      'Review Berhasil Disimpan',
      `Status logbook diperbarui menjadi "${status}".`,
      status === 'Disetujui' ? 'success' : 'warning'
    );
  };

  // Task Management
  const saveTask = async (taskData: Partial<TaskItem> & { title: string; description: string; dueDate: string; priority: TaskItem['priority'] }) => {
    let targetTask: TaskItem;

    if (taskData.id) {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskData.id) {
            targetTask = { ...t, ...taskData } as TaskItem;
            return targetTask;
          }
          return t;
        })
      );
      showToast('Tugas Diperbarui', `Tugas "${taskData.title}" berhasil diubah.`, 'success');
    } else {
      const assignedUser = allUsers.find((u) => u.id === taskData.assignedToUserId) || currentUser;
      targetTask = {
        id: `task-${Date.now()}`,
        title: taskData.title,
        description: taskData.description,
        assignedToUserId: assignedUser.id,
        assignedToUserName: assignedUser.name,
        assignedByMentorId: currentUser.id,
        assignedByMentorName: currentUser.name,
        divisionName: assignedUser.divisionName,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        status: taskData.status || 'Belum Dikerjakan',
        createdAt: getTodayDateString(),
      };
      setTasks((prev) => [targetTask, ...prev]);
      showToast('Tugas Baru Dibuat! 📋', `Tugas ditugaskan kepada ${assignedUser.name}.`, 'success');
    }

    if (targetTask! && auth.currentUser) {
      try {
        await setDoc(doc(db, 'tasks', targetTask.id), targetTask, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `tasks/${targetTask.id}`);
      }
    }
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'tasks', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `tasks/${id}`);
      }
    }
    showToast('Tugas Dihapus', 'Tugas berhasil dihapus dari sistem.', 'info');
  };

  const submitTaskWork = async (id: string, submissionLink: string, submissionNotes: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let targetTask: TaskItem | undefined;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          targetTask = {
            ...t,
            status: 'Menunggu Review',
            submissionLink,
            submissionNotes,
            submittedAt: now,
          };
          return targetTask;
        }
        return t;
      })
    );

    if (targetTask && auth.currentUser) {
      try {
        await setDoc(doc(db, 'tasks', id), targetTask, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `tasks/${id}`);
      }
    }

    showToast('Tugas Dikirim! 🎯', 'Hasil pengerjaan tugas telah diteruskan ke mentor untuk dievaluasi.', 'success');
  };

  const reviewTaskSubmission = async (id: string, status: TaskStatus, score?: number, feedback?: string) => {
    let targetTask: TaskItem | undefined;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          targetTask = {
            ...t,
            status,
            score: score !== undefined ? score : t.score,
            mentorFeedback: feedback !== undefined ? feedback : t.mentorFeedback,
          };
          return targetTask;
        }
        return t;
      })
    );

    if (targetTask && auth.currentUser) {
      try {
        await setDoc(doc(db, 'tasks', id), targetTask, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `tasks/${id}`);
      }
    }

    showToast('Evaluasi Tugas Disimpan', `Status tugas diubah menjadi "${status}".`, 'success');
  };

  const updateTaskStatusDirectly = async (id: string, status: TaskStatus) => {
    let targetTask: TaskItem | undefined;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          targetTask = { ...t, status };
          return targetTask;
        }
        return t;
      })
    );

    if (targetTask && auth.currentUser) {
      try {
        await setDoc(doc(db, 'tasks', id), targetTask, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `tasks/${id}`);
      }
    }

    showToast('Status Tugas Berubah', `Tugas kini berstatus "${status}".`, 'info');
  };

  // Learning Journal
  const saveJournal = async (journalData: Omit<LearningJournalEntry, 'id' | 'userId'> & { id?: string }) => {
    let targetJournal: LearningJournalEntry;

    if (journalData.id) {
      setJournals((prev) =>
        prev.map((j) => {
          if (j.id === journalData.id) {
            targetJournal = { ...j, ...journalData } as LearningJournalEntry;
            return targetJournal;
          }
          return j;
        })
      );
      showToast('Jurnal Diperbarui', 'Refleksi pembelajaran berhasil disimpan.', 'success');
    } else {
      targetJournal = {
        ...journalData,
        id: `journal-${Date.now()}`,
        userId: currentUser.id,
      };
      setJournals((prev) => [targetJournal, ...prev]);
      showToast('Jurnal Belajar Tersimpan! 💡', 'Bagus! Refleksi harian membantu pertumbuhan kariermu.', 'success');
    }

    if (targetJournal! && auth.currentUser) {
      try {
        await setDoc(doc(db, 'journals', targetJournal.id), targetJournal, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `journals/${targetJournal.id}`);
      }
    }
  };

  const deleteJournal = async (id: string) => {
    setJournals((prev) => prev.filter((j) => j.id !== id));
    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'journals', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `journals/${id}`);
      }
    }
    showToast('Jurnal Dihapus', 'Catatan refleksi telah dihapus.', 'info');
  };

  // Admin / User Management
  const updateUserStatus = async (userId: string, status: UserProfile['status']) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'users', userId), { status }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${userId}`);
      }
    }
    showToast('Status Peserta Diubah', `Status berhasil diubah menjadi ${status}.`, 'info');
  };

  const saveUserProfile = async (profile: Partial<UserProfile> & { id: string }) => {
    let updated: UserProfile | undefined;
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === profile.id) {
          updated = { ...u, ...profile } as UserProfile;
          return updated;
        }
        return u;
      })
    );
    if (updated && auth.currentUser) {
      try {
        await setDoc(doc(db, 'users', profile.id), updated, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${profile.id}`);
      }
    }
    showToast('Profil Diperbarui', 'Perubahan data profil berhasil disimpan.', 'success');
  };

  const addUser = async (userData: Omit<UserProfile, 'id'>) => {
    const newUser: UserProfile = {
      ...userData,
      id: `user-${Date.now()}`,
    };
    setAllUsers((prev) => [...prev, newUser]);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'users', newUser.id), newUser, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${newUser.id}`);
      }
    }

    showToast('Pengguna Ditambahkan', `Akun untuk ${newUser.name} berhasil dibuat.`, 'success');
  };

  const deleteUser = async (id: string) => {
    if (id === currentUser.id) {
      showToast('Aksi Ditolak', 'Tidak dapat menghapus akun yang sedang aktif digunakan.', 'error');
      return;
    }
    setAllUsers((prev) => prev.filter((u) => u.id !== id));

    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'users', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${id}`);
      }
    }

    showToast('Pengguna Dihapus', 'Data pengguna telah dihapus dari sistem.', 'info');
  };

  const addDivision = async (divisionData: Omit<Division, 'id' | 'internCount'>) => {
    const newDivision: Division = {
      ...divisionData,
      id: `div-${Date.now()}`,
      internCount: 0,
    };
    setDivisions((prev) => [...prev, newDivision]);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'divisions', newDivision.id), newDivision, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `divisions/${newDivision.id}`);
      }
    }

    showToast('Divisi Ditambahkan', `Divisi "${newDivision.name}" berhasil dibuat.`, 'success');
  };

  // Stats Calculations
  const calculateInternStats = () => {
    const start = new Date(currentUser.startDate || '2026-09-01').getTime();
    const end = new Date(currentUser.endDate || '2026-11-30').getTime();
    const today = new Date().getTime();

    const totalDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
    const daysPassed = Math.max(0, Math.min(totalDays, Math.round((today - start) / (1000 * 60 * 60 * 24))));
    const progressPercentage = Math.min(100, Math.round((daysPassed / totalDays) * 100));

    const userTasks = tasks.filter((t) => t.assignedToUserId === currentUser.id);
    const pendingTasksCount = userTasks.filter((t) => t.status !== 'Selesai').length;

    const userLogbooks = logbooks.filter((l) => l.userId === currentUser.id);
    const totalLoggedActivities = userLogbooks.length;

    const userAttendance = attendanceRecords.filter((a) => a.userId === currentUser.id && a.status === 'Hadir');

    return {
      totalDays,
      daysCompleted: daysPassed,
      progressPercentage,
      pendingTasksCount,
      totalLoggedActivities,
      attendanceCount: userAttendance.length,
    };
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setAllUsers(INITIAL_USERS);
    setCurrentUserId('user-intern-1');
    setDivisions(INITIAL_DIVISIONS);
    setAttendanceRecords(INITIAL_ATTENDANCE);
    setLogbooks(INITIAL_LOGBOOKS);
    setTasks(INITIAL_TASKS);
    setJournals(INITIAL_JOURNALS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setEvaluations(INITIAL_EVALUATIONS);
    setActiveView('dashboard');
    showToast('Reset Selesai', 'Data sampel berhasil dikembalikan ke kondisi awal pabrik.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        allUsers,
        divisions,
        attendanceRecords,
        logbooks,
        tasks,
        journals,
        achievements,
        evaluations,
        toasts,
        activeView,
        setActiveView,
        showToast,
        dismissToast,
        firebaseUser,
        signInWithGoogle,
        signOutFromGoogle,
        isFirebaseConnected,
        handleCheckIn,
        handleCheckOut,
        handleRequestLeave,
        getTodayAttendance,
        saveLogbook,
        deleteLogbook,
        reviewLogbook,
        saveTask,
        deleteTask,
        submitTaskWork,
        reviewTaskSubmission,
        updateTaskStatusDirectly,
        saveJournal,
        deleteJournal,
        updateUserStatus,
        saveUserProfile,
        addUser,
        deleteUser,
        addDivision,
        internStats: calculateInternStats(),
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

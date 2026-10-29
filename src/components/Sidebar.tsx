import React from 'react';
import { useApp, ActiveView } from '../context/AppContext';
import {
  LayoutDashboard,
  BookOpenCheck,
  CheckSquare,
  CalendarCheck2,
  Sparkles,
  Award,
  UserCircle2,
  Settings,
  Users2,
  FileSpreadsheet,
  GraduationCap,
  TrendingUp,
  X,
  Layers,
  ChevronRight,
  Shield,
  Briefcase,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentUser, activeView, setActiveView, tasks, logbooks } = useApp();

  const userPendingTasks = tasks.filter(
    (t) => t.assignedToUserId === currentUser.id && t.status !== 'Selesai'
  ).length;

  const pendingLogbookReviews = logbooks.filter(
    (l) => l.status === 'Menunggu Review'
  ).length;

  const navItemClass = (viewKey: ActiveView) => {
    const isActive = activeView === viewKey;
    return `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
      isActive
        ? 'bg-[#173B65] text-white shadow-md shadow-[#173B65]/20 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;
  };

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header & Brand */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo & Tagline */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#173B65] to-[#255792] flex items-center justify-center text-white shadow-md shadow-[#173B65]/25 relative">
                <GraduationCap className="w-6 h-6 text-white" />
                <span className="absolute -bottom-1 -right-1 bg-[#F59E0B] rounded-full p-0.5 text-white shadow-xs">
                  <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-[#173B65] leading-none">
                  MAGANG <span className="text-[#F59E0B]">HEBAT</span>
                </h1>
                <p className="text-[11px] font-medium text-slate-500 mt-1">
                  Belajar, Berkembang, Berdampak.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Tutup menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current User Role Pill */}
          <div className="px-4 pt-4 pb-2">
            <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                      currentUser.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : currentUser.role === 'mentor'
                        ? 'bg-blue-100 text-[#173B65]'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {currentUser.role === 'admin'
                      ? 'Administrator'
                      : currentUser.role === 'mentor'
                      ? 'Mentor'
                      : 'Peserta Magang'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <div className="p-3.5 space-y-5">
            {/* Primary Navigation */}
            <div>
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Menu Utama
              </p>
              <nav className="space-y-1">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className={navItemClass('dashboard')}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4 shrink-0" />
                    <span>Dashboard</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-0.5 transition" />
                </button>

                <button
                  onClick={() => handleNavClick('logbook')}
                  className={navItemClass('logbook')}
                >
                  <div className="flex items-center gap-3">
                    <BookOpenCheck className="w-4 h-4 shrink-0" />
                    <span>Logbook Harian</span>
                  </div>
                  {currentUser.role === 'peserta' ? (
                    <span className="text-[11px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-md font-semibold">
                      {logbooks.filter((l) => l.userId === currentUser.id).length}
                    </span>
                  ) : null}
                </button>

                <button
                  onClick={() => handleNavClick('tasks')}
                  className={navItemClass('tasks')}
                >
                  <div className="flex items-center gap-3">
                    <CheckSquare className="w-4 h-4 shrink-0" />
                    <span>Tugas Saya</span>
                  </div>
                  {userPendingTasks > 0 && currentUser.role === 'peserta' && (
                    <span className="text-[11px] bg-[#F59E0B] text-white px-2 py-0.5 rounded-full font-bold">
                      {userPendingTasks}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleNavClick('attendance')}
                  className={navItemClass('attendance')}
                >
                  <div className="flex items-center gap-3">
                    <CalendarCheck2 className="w-4 h-4 shrink-0" />
                    <span>Kehadiran</span>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('journal')}
                  className={navItemClass('journal')}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 shrink-0 text-[#F59E0B]" />
                    <span>Jurnal Belajar</span>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('achievements')}
                  className={navItemClass('achievements')}
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 shrink-0 text-amber-500" />
                    <span>Pencapaian & Sertifikat</span>
                  </div>
                </button>
              </nav>
            </div>

            {/* Dedicated Role Section for Mentor / Admin */}
            {(currentUser.role === 'mentor' || currentUser.role === 'admin') && (
              <div className="pt-2 border-t border-slate-100">
                <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>{currentUser.role === 'admin' ? 'Portal Pengelola' : 'Portal Pembimbing'}</span>
                  <Shield className="w-3 h-3 text-[#173B65]" />
                </p>
                <nav className="space-y-1">
                  {currentUser.role === 'mentor' && (
                    <button
                      onClick={() => handleNavClick('mentor-review')}
                      className={navItemClass('mentor-review')}
                    >
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-4 h-4 shrink-0" />
                        <span>Review & Evaluasi Peserta</span>
                      </div>
                      {pendingLogbookReviews > 0 && (
                        <span className="text-[11px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">
                          {pendingLogbookReviews}
                        </span>
                      )}
                    </button>
                  )}

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => handleNavClick('admin-panel')}
                      className={navItemClass('admin-panel')}
                    >
                      <div className="flex items-center gap-3">
                        <Layers className="w-4 h-4 shrink-0" />
                        <span>Master Kelola & Rekap</span>
                      </div>
                    </button>
                  )}
                </nav>
              </div>
            )}

            {/* Account & App Settings */}
            <div className="pt-2 border-t border-slate-100">
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Akun & Preferensi
              </p>
              <nav className="space-y-1">
                <button
                  onClick={() => handleNavClick('profile')}
                  className={navItemClass('profile')}
                >
                  <div className="flex items-center gap-3">
                    <UserCircle2 className="w-4 h-4 shrink-0" />
                    <span>Profil Saya</span>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('settings')}
                  className={navItemClass('settings')}
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 shrink-0" />
                    <span>Pengaturan</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Sidebar Footer info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">MAGANG HEBAT v2.4</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Aktif
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Program Magang Vokasi & Kampus Mandiri
          </p>
        </div>
      </aside>
    </>
  );
};

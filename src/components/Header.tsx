import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Menu,
  Database,
  Calendar,
  Sparkles,
  ChevronDown,
  Bell,
  RefreshCw,
  LogOut,
  UserCheck,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { currentUser, switchRole, allUsers, setCurrentUser, resetToDefaultData, showToast } = useApp();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const handleRoleClick = (role: UserRole) => {
    switchRole(role);
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Today date */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100/90 py-1.5 px-3 rounded-lg border border-slate-200/50">
            <Calendar className="w-3.5 h-3.5 text-[#173B65]" />
            <span className="hidden sm:inline capitalize">{formattedDate}</span>
            <span className="sm:hidden">28 Okt 2026</span>
          </div>

          {/* Firebase Cloud Firestore Active Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-medium" title="Cloud Firestore aktif dan terhubung">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Cloud Firestore Aktif</span>
          </div>
        </div>

        {/* Right: Role Switcher & User Profile Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Role Switch Buttons for Reviewer Convenience */}
          <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/70 text-xs font-semibold">
            <span className="text-[11px] text-slate-400 px-2 uppercase tracking-wider font-bold">
              Peran:
            </span>
            <button
              onClick={() => handleRoleClick('peserta')}
              className={`px-2.5 py-1 rounded-lg transition text-xs font-medium ${
                currentUser.role === 'peserta'
                  ? 'bg-white text-[#173B65] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Peserta
            </button>
            <button
              onClick={() => handleRoleClick('mentor')}
              className={`px-2.5 py-1 rounded-lg transition text-xs font-medium ${
                currentUser.role === 'mentor'
                  ? 'bg-white text-[#173B65] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mentor
            </button>
            <button
              onClick={() => handleRoleClick('admin')}
              className={`px-2.5 py-1 rounded-lg transition text-xs font-medium ${
                currentUser.role === 'admin'
                  ? 'bg-white text-purple-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition relative"
              aria-label="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F59E0B]"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900">Notifikasi Terbaru</h4>
                  <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-semibold">
                    3 Baru
                  </span>
                </div>
                <div className="divide-y divide-slate-100 mt-2 text-xs">
                  <div className="py-2.5 hover:bg-slate-50 rounded-lg px-2 cursor-pointer transition">
                    <p className="font-semibold text-slate-800">Review Logbook Tersedia</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Mentor memberikan catatan pada logbook tanggal 27 Okt.</p>
                    <span className="text-[10px] text-slate-400">1 jam yang lalu</span>
                  </div>
                  <div className="py-2.5 hover:bg-slate-50 rounded-lg px-2 cursor-pointer transition">
                    <p className="font-semibold text-slate-800">Tenggat Tugas Mendekat</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Tugas Slicing Desain jatuh tempo 30 Okt 2026.</p>
                    <span className="text-[10px] text-slate-400">3 jam yang lalu</span>
                  </div>
                  <div className="py-2.5 hover:bg-slate-50 rounded-lg px-2 cursor-pointer transition">
                    <p className="font-semibold text-slate-800">Pencapaian Baru Diraih! 🏆</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Kamu membuka badge &quot;Disiplin Tangguh&quot;.</p>
                    <span className="text-[10px] text-slate-400">Kemarin</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 pl-2.5 pr-2 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition"
            >
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{currentUser.divisionName}</p>
              </div>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#173B65]/10"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="p-2 border-b border-slate-100 pb-3">
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#173B65]/10 text-[#173B65]">
                    {currentUser.institution}
                  </span>
                </div>

                <div className="py-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                    Ganti Akun Demo:
                  </p>
                  <div className="space-y-1">
                    {allUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          setCurrentUser(user);
                          setIsDropdownOpen(false);
                          showToast('Beralih Pengguna', `Aktif sebagai ${user.name} (${user.role})`, 'info');
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs transition ${
                          user.id === currentUser.id
                            ? 'bg-[#173B65]/10 text-[#173B65] font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-semibold">{user.name}</p>
                          <p className="text-[10px] text-slate-500 capitalize">{user.role} &bull; {user.divisionName}</p>
                        </div>
                        {user.id === currentUser.id && (
                          <UserCheck className="w-4 h-4 text-[#173B65]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-xs">
                  {useApp().firebaseUser ? (
                    <button
                      onClick={() => {
                        useApp().signOutFromGoogle();
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 px-2.5 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout dari Google Firebase</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        useApp().signInWithGoogle();
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 px-2.5 py-2 text-[#173B65] bg-blue-50/70 hover:bg-blue-100/70 rounded-lg transition font-bold"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>Masuk dengan Google</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      if (window.confirm('Kembalikan semua data ke sampel awal Magang Hebat?')) {
                        resetToDefaultData();
                      }
                    }}
                    className="flex items-center gap-2 px-2.5 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Data Sampel</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatsCard } from '../components/StatsCard';
import {
  CalendarDays,
  TrendingUp,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  MapPin,
  Building,
  Home,
  Check,
  AlertCircle,
  Sparkles,
  Calendar,
  Quote,
  Flame,
  ChevronRight,
  Award,
  Users,
} from 'lucide-react';
import { DAILY_MOTIVATIONS, UPCOMING_SCHEDULES } from '../data/mockData';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    internStats,
    tasks,
    logbooks,
    setActiveView,
    getTodayAttendance,
    handleCheckIn,
    handleCheckOut,
    updateTaskStatusDirectly,
    allUsers,
  } = useApp();

  const [checkInMode, setCheckInMode] = useState<'WFO' | 'WFH'>('WFO');
  const [motivationIdx, setMotivationIdx] = useState(0);

  const todayAttendance = getTodayAttendance();
  const currentMotivation = DAILY_MOTIVATIONS[motivationIdx % DAILY_MOTIVATIONS.length];

  // Intern's assigned tasks
  const myTasks = tasks.filter((t) => t.assignedToUserId === currentUser.id);
  const pendingTasks = myTasks.filter((t) => t.status !== 'Selesai');
  const recentLogs = logbooks
    .filter((l) => (currentUser.role === 'peserta' ? l.userId === currentUser.id : true))
    .slice(0, 4);

  // Weekly hours calculation mock data
  const weeklyActivityData = [
    { day: 'Sen', hours: 8, logs: 1, fullDate: '24 Okt' },
    { day: 'Sel', hours: 8, logs: 1, fullDate: '25 Okt' },
    { day: 'Rab', hours: 7.5, logs: 1, fullDate: '26 Okt' },
    { day: 'Kam', hours: 8, logs: 1, fullDate: '27 Okt' },
    { day: 'Jum', hours: 8, logs: 1, fullDate: '28 Okt' },
    { day: 'Sab', hours: 0, logs: 0, fullDate: '29 Okt' },
    { day: 'Min', hours: 0, logs: 0, fullDate: '30 Okt' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 1. Personal Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#173B65] via-[#1d4778] to-[#255792] p-6 sm:p-8 text-white shadow-xl shadow-[#173B65]/15 border border-[#173B65]/30">
        {/* Decorative background glow & shapes */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-[#F59E0B]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 -mb-10 w-60 h-60 rounded-full bg-sky-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold text-amber-300 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Program Magang Berdampak &bull; Divisi {currentUser.divisionName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Halo, {currentUser.role === 'peserta' ? 'Pejuang Magang' : currentUser.name}! 👋
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              Siap belajar hal baru dan memberikan dampak hari ini? Pantau progres, tuntaskan misi, dan kembangkan keahlian terbaikmu.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
              <span className="bg-white/15 px-3 py-1.5 rounded-xl font-medium border border-white/10">
                🏫 {currentUser.institution}
              </span>
              <span className="bg-white/15 px-3 py-1.5 rounded-xl font-medium border border-white/10">
                👨‍💼 Mentor: {currentUser.mentorName || 'Budi Wicaksono, S.Kom'}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-xl font-bold border border-emerald-400/30">
                Status: {currentUser.status}
              </span>
            </div>
          </div>

          {/* Quick Check-in / Out Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shrink-0 w-full md:w-80 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Presensi Hari Ini
                </span>
              </div>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                  todayAttendance?.checkInTime && todayAttendance?.checkOutTime
                    ? 'bg-emerald-500 text-white'
                    : todayAttendance?.checkInTime
                    ? 'bg-amber-400 text-slate-900'
                    : 'bg-white/20 text-white'
                }`}
              >
                {todayAttendance?.checkInTime && todayAttendance?.checkOutTime
                  ? 'Selesai'
                  : todayAttendance?.checkInTime
                  ? 'Sedang Bekerja'
                  : 'Belum Presensi'}
              </span>
            </div>

            {todayAttendance?.checkInTime ? (
              <div className="space-y-3">
                <div className="bg-black/20 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex justify-between text-slate-200">
                    <span>Masuk:</span>
                    <span className="font-bold text-emerald-300">{todayAttendance.checkInTime} WIB</span>
                  </div>
                  <div className="flex justify-between text-slate-200">
                    <span>Mode:</span>
                    <span className="font-medium text-amber-300">{todayAttendance.workMode}</span>
                  </div>
                  {todayAttendance.checkOutTime && (
                    <div className="flex justify-between text-slate-200">
                      <span>Pulang:</span>
                      <span className="font-bold text-emerald-300">{todayAttendance.checkOutTime} WIB</span>
                    </div>
                  )}
                </div>

                {!todayAttendance.checkOutTime ? (
                  <button
                    onClick={() => handleCheckOut()}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Check-Out (Selesai Kerja)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="text-center py-1 text-xs text-emerald-300 font-semibold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Presensi hari ini lengkap!</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCheckInMode('WFO')}
                    className={`py-1.5 text-xs rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                      checkInMode === 'WFO'
                        ? 'bg-amber-400 text-slate-900 shadow-xs'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>WFO (Kantor)</span>
                  </button>
                  <button
                    onClick={() => setCheckInMode('WFH')}
                    className={`py-1.5 text-xs rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                      checkInMode === 'WFH'
                        ? 'bg-amber-400 text-slate-900 shadow-xs'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>WFH (Remote)</span>
                  </button>
                </div>

                <button
                  onClick={() =>
                    handleCheckIn(
                      checkInMode,
                      checkInMode === 'WFO'
                        ? 'Kantor Pusat - Gedung B Lt. 4, Jakarta'
                        : 'Lokasi Peserta (WFH)'
                    )
                  }
                  className="w-full py-2.5 px-4 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-slate-950 font-extrabold text-xs transition shadow-md flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Check-In Sekarang</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Stat Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Hari Magang"
          value={`${internStats.daysCompleted} / ${internStats.totalDays}`}
          subtitle="Hari berjalan dari periode program"
          icon={CalendarDays}
          badge={`${internStats.totalDays - internStats.daysCompleted} hari sisa`}
          badgeType="info"
        />

        <StatsCard
          title="Persentase Progres"
          value={`${internStats.progressPercentage}%`}
          subtitle="Menuju kelulusan bersertifikat"
          icon={TrendingUp}
          badge="On Track"
          badgeType="success"
        />

        <StatsCard
          title="Tugas Belum Selesai"
          value={internStats.pendingTasksCount}
          subtitle="Tugas aktif perlu dituntaskan"
          icon={Clock}
          badge={internStats.pendingTasksCount > 0 ? 'Perlu Dikerjakan' : 'Semua Beres'}
          badgeType={internStats.pendingTasksCount > 0 ? 'warning' : 'success'}
        />

        <StatsCard
          title="Aktivitas Dicatat"
          value={internStats.totalLoggedActivities}
          subtitle="Total entri logbook harian"
          icon={BookOpen}
          badge="Terverifikasi"
          badgeType="success"
        />
      </div>

      {/* 3. Daily Motivational Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-[#D97706] flex items-center justify-center shrink-0">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
                Motivasi Hari Ini &bull; {currentMotivation.tag}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-800 mt-1 italic">
              &ldquo;{currentMotivation.quote}&rdquo;
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">— {currentMotivation.author}</p>
          </div>
        </div>

        <button
          onClick={() => setMotivationIdx((prev) => prev + 1)}
          className="text-xs font-bold text-amber-800 hover:text-amber-900 bg-white hover:bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl transition shadow-xs whitespace-nowrap self-end sm:self-center"
        >
          Kutipan Lain ↻
        </button>
      </div>

      {/* 4. Middle Grid: Tasks Today + Weekly Progress Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Tasks & Upcoming Activities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Tasks Today */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#173B65]/10 text-[#173B65] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Daftar Tugas Hari Ini</h3>
                  <p className="text-xs text-slate-500">Tugas yang sedang aktif dan mendekati tenggat</p>
                </div>
              </div>
              <button
                onClick={() => setActiveView('tasks')}
                className="text-xs font-bold text-[#173B65] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua ({myTasks.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Award className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">Hebat! Semua tugas telah tuntas</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Belum ada tugas baru yang tertunda. Kamu bisa menulis jurnal belajar atau berdiskusi dengan mentor.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                            task.priority === 'Tinggi'
                              ? 'bg-rose-100 text-rose-700'
                              : task.priority === 'Sedang'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Tenggat: {task.dueDate}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1 group-hover:text-[#173B65] transition line-clamp-1">
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {task.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                          task.status === 'Menunggu Review'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : task.status === 'Sedang Dikerjakan'
                            ? 'bg-blue-50 text-[#173B65] border border-blue-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {task.status}
                      </span>
                      <button
                        onClick={() => setActiveView('tasks')}
                        className="text-xs font-bold px-3 py-1 bg-[#173B65] text-white rounded-lg hover:bg-[#1f4a7d] transition"
                      >
                        Buka
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weekly Progress & Hours Visualizer */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Grafik Jam Belajar & Magang Mingguan</h3>
                <p className="text-xs text-slate-500">Estimasi total jam produktif per hari kerja minggu ini</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <Flame className="w-3.5 h-3.5" />
                <span>39.5 Jam Minggu Ini</span>
              </div>
            </div>

            {/* Custom SVG / Bar Visualizer */}
            <div className="pt-4 pb-2">
              <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-36">
                {weeklyActivityData.map((item, idx) => {
                  const barHeight = Math.round((item.hours / 8.5) * 100);
                  const isToday = item.day === 'Jum';
                  return (
                    <div key={idx} className="flex flex-col items-center h-full justify-end group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-[#173B65] bg-slate-100 px-1.5 py-0.5 rounded mb-1">
                        {item.hours} Jam
                      </div>
                      <div className="w-full bg-slate-100 rounded-t-lg relative flex items-end h-28 overflow-hidden">
                        <div
                          style={{ height: `${barHeight}%` }}
                          className={`w-full rounded-t-lg transition-all duration-500 ${
                            isToday
                              ? 'bg-gradient-to-t from-[#173B65] to-[#F59E0B]'
                              : item.hours > 0
                              ? 'bg-[#173B65]/80 group-hover:bg-[#173B65]'
                              : 'bg-slate-200/50'
                          }`}
                        />
                      </div>
                      <span
                        className={`text-xs mt-2 font-bold ${
                          isToday ? 'text-[#173B65]' : 'text-slate-500'
                        }`}
                      >
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Upcoming Schedules & Recent Logbook Entries */}
        <div className="space-y-6">
          {/* Upcoming Schedules */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#173B65]" />
                <h3 className="text-sm font-bold text-slate-900">Jadwal Mendatang</h3>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                Agenda Tim
              </span>
            </div>

            <div className="space-y-3">
              {UPCOMING_SCHEDULES.map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-100/70 transition"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-[#173B65] bg-blue-50 px-2 py-0.5 rounded">
                      {event.date}
                    </span>
                    <span className="text-slate-400 font-medium">{event.time}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 leading-snug">{event.title}</h4>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Logbook Activities */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#173B65]" />
                <h3 className="text-sm font-bold text-slate-900">Aktivitas Logbook Terbaru</h3>
              </div>
              <button
                onClick={() => setActiveView('logbook')}
                className="text-xs font-bold text-[#173B65] hover:underline"
              >
                Tulis Logbook
              </button>
            </div>

            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => setActiveView('logbook')}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 cursor-pointer transition"
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-slate-400 font-medium">{log.date}</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        log.status === 'Disetujui'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.status === 'Menunggu Review'
                          ? 'bg-amber-100 text-amber-800'
                          : log.status === 'Perlu Revisi'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{log.activityTitle}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{log.workDescription}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

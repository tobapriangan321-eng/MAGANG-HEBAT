import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AttendanceRecord, AttendanceStatus } from '../types';
import {
  CalendarCheck2,
  Clock,
  MapPin,
  Building,
  Home,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  Calendar,
  Camera,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  Percent,
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const {
    currentUser,
    attendanceRecords,
    handleCheckIn,
    handleCheckOut,
    handleRequestLeave,
    getTodayAttendance,
  } = useApp();

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [leaveData, setLeaveData] = useState({
    status: 'Izin' as AttendanceStatus,
    date: new Date().toISOString().substring(0, 10),
    notes: '',
  });

  const todayAttendance = getTodayAttendance();

  // Filter records for current user
  const userRecords = attendanceRecords.filter((rec) => {
    if (currentUser.role === 'peserta') {
      return rec.userId === currentUser.id;
    }
    return true;
  });

  // Calculations
  const totalHadir = userRecords.filter((r) => r.status === 'Hadir').length;
  const totalIzin = userRecords.filter((r) => r.status === 'Izin').length;
  const totalSakit = userRecords.filter((r) => r.status === 'Sakit').length;
  const totalAlpa = userRecords.filter((r) => r.status === 'Alpa').length;
  const totalHari = totalHadir + totalIzin + totalSakit + totalAlpa || 1;
  const kehadiranPersen = Math.round((totalHadir / totalHari) * 100);

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveData.notes.trim()) {
      alert('Alasan pengajuan permohonan wajib diisi!');
      return;
    }
    handleRequestLeave(leaveData.status, leaveData.date, leaveData.notes);
    setIsLeaveModalOpen(false);
    setLeaveData({
      status: 'Izin',
      date: new Date().toISOString().substring(0, 10),
      notes: '',
    });
  };

  // Generate calendar days for October 2026
  const generateOctoberDays = () => {
    const days = [];
    const totalDaysInMonth = 31;
    // 1 Oct 2026 is Thursday (idx 4 if Mon=1)
    const startDayOfWeek = 4; // Kamis

    // Padding empty days before Oct 1
    for (let i = 1; i < startDayOfWeek; i++) {
      days.push({ dayNumber: null, dateStr: null });
    }

    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dayStr = String(d).padStart(2, '0');
      const dateStr = `2026-10-${dayStr}`;
      const record = userRecords.find((r) => r.date === dateStr);
      days.push({
        dayNumber: d,
        dateStr,
        record,
      });
    }

    return days;
  };

  const calendarDays = generateOctoberDays();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#173B65]/10 text-[#173B65] flex items-center justify-center">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Presensi & Kehadiran
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Catat jam masuk & pulang kerja, pantau rekap kedisiplinan, atau ajukan izin resmi.
          </p>
        </div>

        {currentUser.role === 'peserta' && (
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition border border-slate-200 shrink-0"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Ajukan Izin / Sakit</span>
          </button>
        )}
      </div>

      {/* Real-time Check-In Action Card (for Peserta) */}
      {currentUser.role === 'peserta' && (
        <div className="bg-gradient-to-r from-[#173B65] to-[#204e84] text-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-[#173B65]/15 border border-[#173B65]/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold border border-white/20">
              <Clock className="w-3.5 h-3.5" />
              <span>Jam Kerja Normal: 08:00 - 17:00 WIB</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {todayAttendance?.checkInTime && todayAttendance?.checkOutTime
                ? 'Presensi Selesai! Kerja Luar Biasa Hari Ini 🌟'
                : todayAttendance?.checkInTime
                ? 'Sedang Bertugas! Jangan Lupa Check-Out Saat Pulang 💼'
                : 'Selamat Pagi! Waktunya Melakukan Check-In ⏰'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
              Lokasi kantor terdeteksi: <strong>Gedung B Lt. 4, Jakarta Selatan</strong>. Presensi tepat waktu mendukung poin penilaian kedisiplinan pada akhir magang.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {!todayAttendance?.checkInTime ? (
              <>
                <button
                  onClick={() =>
                    handleCheckIn('WFO', 'Kantor Pusat - Gedung B Lt. 4, Jakarta')
                  }
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#F59E0B] hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Building className="w-4 h-4 stroke-[2.5]" />
                  <span>Check-In WFO (Kantor)</span>
                </button>
                <button
                  onClick={() =>
                    handleCheckIn('WFH', 'Lokasi Peserta (WFH Mandiri)')
                  }
                  className="w-full sm:w-auto px-5 py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Check-In WFH</span>
                </button>
              </>
            ) : !todayAttendance.checkOutTime ? (
              <button
                onClick={() => handleCheckOut()}
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Check-Out (Selesai Bekerja)</span>
              </button>
            ) : (
              <div className="bg-white/20 backdrop-blur px-5 py-3 rounded-xl border border-white/30 text-center">
                <p className="text-xs font-bold text-amber-300">Tercatat Hadir</p>
                <p className="text-xs text-white mt-0.5">
                  Masuk: {todayAttendance.checkInTime} &bull; Pulang: {todayAttendance.checkOutTime}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Attendance Summary Stat Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hadir</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{totalHadir}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Hari kerja</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Izin</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{totalIzin}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Terencana</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sakit</p>
          <p className="text-2xl font-black text-sky-600 mt-1">{totalSakit}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Dengan surat</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Alpa</p>
          <p className="text-2xl font-black text-rose-600 mt-1">{totalAlpa}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Tanpa kabar</p>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Disiplin</p>
          <p className="text-2xl font-black text-[#173B65] mt-1">{kehadiranPersen}%</p>
          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Tingkat kehadiran</p>
        </div>
      </div>

      {/* Calendar & History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#173B65]" />
              <h3 className="text-sm font-bold text-slate-900">Kalender Kehadiran (Oktober 2026)</h3>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Hadir
              </span>
              <span className="flex items-center gap-1 text-[11px] text-amber-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Izin/Sakit
              </span>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 uppercase py-2 border-b border-slate-100">
            <span>Sen</span>
            <span>Sel</span>
            <span>Rab</span>
            <span>Kam</span>
            <span>Jum</span>
            <span className="text-rose-400">Sab</span>
            <span className="text-rose-400">Min</span>
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1.5 pt-2">
            {calendarDays.map((item, idx) => {
              if (!item.dayNumber) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="h-16 rounded-xl bg-slate-50/40 border border-transparent"
                  />
                );
              }

              const status = item.record?.status;
              const isToday = item.dayNumber === 28;

              return (
                <div
                  key={`day-${item.dayNumber}`}
                  className={`h-16 rounded-xl p-1.5 border flex flex-col justify-between transition group relative ${
                    isToday
                      ? 'border-[#173B65] ring-2 ring-[#173B65]/10 bg-slate-50'
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday ? 'text-[#173B65]' : 'text-slate-700'
                      }`}
                    >
                      {item.dayNumber}
                    </span>
                    {isToday && (
                      <span className="text-[9px] font-black uppercase tracking-tighter bg-[#173B65] text-white px-1 rounded">
                        Hari Ini
                      </span>
                    )}
                  </div>

                  {item.record ? (
                    <div
                      className={`text-[10px] font-bold px-1 py-0.5 rounded truncate text-center ${
                        status === 'Hadir'
                          ? 'bg-emerald-100 text-emerald-800'
                          : status === 'Izin'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {status} {item.record.workMode && `(${item.record.workMode})`}
                    </div>
                  ) : (
                    <div className="text-[9px] text-slate-300 text-center italic">-</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Attendance Log History (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Riwayat Presensi Harian</h3>
            <span className="text-xs text-slate-400 font-semibold">{userRecords.length} Catatan</span>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {userRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800">{rec.date}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      rec.status === 'Hadir'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rec.status === 'Izin'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {rec.status} &bull; {rec.workMode}
                  </span>
                </div>

                {rec.status === 'Hadir' ? (
                  <div className="text-[11px] text-slate-600 space-y-0.5 mt-1">
                    <p className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#173B65]" />
                      <span>Masuk: {rec.checkInTime || '-'} &bull; Pulang: {rec.checkOutTime || 'Belum'}</span>
                    </p>
                    <p className="flex items-center gap-1 text-slate-400 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{rec.location}</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic mt-1">
                    Keterangan: {rec.notes || 'Pengajuan resmi.'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL: AJUKAN IZIN / SAKIT */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Pengajuan Izin / Sakit</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Permohonan akan dicatat dan diberitahukan kepada mentor
                </p>
              </div>
              <button
                onClick={() => setIsLeaveModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit} className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Jenis Pengajuan
                </label>
                <select
                  value={leaveData.status}
                  onChange={(e) =>
                    setLeaveData({
                      ...leaveData,
                      status: e.target.value as AttendanceStatus,
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                >
                  <option value="Izin">Izin (Keperluan Kampus / Mendesak)</option>
                  <option value="Sakit">Sakit (Kondisi Kesehatan)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tanggal Tidak Hadir
                </label>
                <input
                  type="date"
                  value={leaveData.date}
                  onChange={(e) => setLeaveData({ ...leaveData, date: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Alasan & Keterangan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan alasan izin / sakit secara sopan..."
                  value={leaveData.notes}
                  onChange={(e) => setLeaveData({ ...leaveData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#173B65] hover:bg-[#1f4a7d] text-white font-bold text-xs shadow-md"
                >
                  Kirim Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

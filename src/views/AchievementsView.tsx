import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AchievementBadge } from '../types';
import confetti from 'canvas-confetti';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Users,
  Zap,
  Download,
  Printer,
  X,
  QrCode,
  GraduationCap,
  Calendar,
  Lock,
  ChevronRight,
  Check,
} from 'lucide-react';

export const AchievementsView: React.FC = () => {
  const { currentUser, internStats, achievements } = useApp();
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-500" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-6 h-6 text-[#173B65]" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-amber-500" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-sky-500" />;
      case 'Users':
        return <Users className="w-6 h-6 text-indigo-500" />;
      default:
        return <Zap className="w-6 h-6 text-amber-500" />;
    }
  };

  const handleOpenCertificate = () => {
    setIsCertificateOpen(true);
    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#173B65', '#F59E0B', '#10B981', '#3B82F6'],
      });
    } catch {
      // ignore
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const certificateId = `MH-${currentUser.id.replace('user-', '').toUpperCase()}-202610`;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Pencapaian & Sertifikat Magang
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rayakan setiap tonggak kemajuan dan lihat sertifikat resmi kelulusan program.
          </p>
        </div>

        <button
          onClick={handleOpenCertificate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#173B65] to-[#255792] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md shadow-[#173B65]/20 transition shrink-0"
        >
          <GraduationCap className="w-4 h-4 text-amber-300 stroke-[2.2]" />
          <span>Buka Sertifikat Kelulusan</span>
        </button>
      </div>

      {/* Program Completion Milestone Card */}
      <div className="bg-gradient-to-br from-[#173B65] via-[#1a4474] to-[#225591] text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#173B65]/20 border border-[#173B65]/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              Menuju Penyelesaian Program Magang
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-3">
              Progres Keseluruhan: {internStats.progressPercentage}% Selesai
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
              Kamu telah menuntaskan <strong>{internStats.daysCompleted}</strong> dari total{' '}
              <strong>{internStats.totalDays} hari</strong> masa magang. Jaga konsistensi pengisian logbook dan ketepatan tugas untuk meraih predikat <em>Magang Berpredikat Sangat Baik</em>.
            </p>

            {/* Micro milestones */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10">
                <p className="text-[10px] text-slate-300 uppercase font-semibold">Kehadiran</p>
                <p className="text-lg font-bold text-emerald-300 mt-0.5">96%</p>
                <p className="text-[10px] text-slate-300">Target &gt;85%</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10">
                <p className="text-[10px] text-slate-300 uppercase font-semibold">Logbook</p>
                <p className="text-lg font-bold text-amber-300 mt-0.5">85%</p>
                <p className="text-[10px] text-slate-300">Tersertifikasi</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10">
                <p className="text-[10px] text-slate-300 uppercase font-semibold">Nilai Rata-rata</p>
                <p className="text-lg font-bold text-sky-300 mt-0.5">92.5</p>
                <p className="text-[10px] text-slate-300">Skala 100</p>
              </div>
            </div>
          </div>

          {/* Radial / Progress Circle Widget */}
          <div className="flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shrink-0 w-full md:w-60">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-white/20"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[#F59E0B] transition-all duration-1000"
                  strokeWidth="10"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * internStats.progressPercentage) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black">{internStats.progressPercentage}%</span>
                <span className="text-[10px] uppercase font-bold text-amber-300">Lulus</span>
              </div>
            </div>
            <button
              onClick={handleOpenCertificate}
              className="mt-4 w-full py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-xs transition text-center"
            >
              Pratinjau Sertifikat
            </button>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Koleksi Lencana Penghargaan (Badges)</h2>
            <p className="text-xs text-slate-500">
              Lencana diberikan otomatis saat kamu memenuhi kriteria disiplin dan kinerja.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
            {achievements.filter((a) => a.unlockedAt !== null).length} / {achievements.length} Terbuka
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((badge) => {
            const isUnlocked = badge.unlockedAt !== null;

            return (
              <div
                key={badge.id}
                className={`rounded-2xl border p-5 transition-all relative overflow-hidden flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-white border-slate-200/90 shadow-xs hover:shadow-md'
                    : 'bg-slate-50/70 border-slate-200/50 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        isUnlocked
                          ? 'bg-amber-50 border border-amber-200/80 shadow-xs'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {getBadgeIcon(badge.icon)}
                    </div>

                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Diraih</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-200/70 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" />
                        <span>Terkunci</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{badge.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-400 font-medium">Progres:</span>
                    <span className="font-bold text-slate-700">{badge.targetLabel}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      style={{ width: `${badge.progress}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked ? 'bg-gradient-to-r from-emerald-500 to-[#173B65]' : 'bg-slate-300'
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* OFFICIAL CERTIFICATE MODAL */}
      {isCertificateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full p-6 sm:p-10 my-6 animate-in fade-in zoom-in-95">
            {/* Modal Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 no-print">
              <div>
                <h3 className="text-lg font-black text-slate-900">Sertifikat Kelulusan Resmi</h3>
                <p className="text-xs text-slate-500">
                  Diterbitkan oleh PT Inovasi Digital Nusantara & Platform MAGANG HEBAT
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintCertificate}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#173B65] text-white hover:bg-[#1f4a7d] text-xs font-bold rounded-xl transition shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  onClick={() => setIsCertificateOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* CERTIFICATE ARTBOARD (PRINTABLE) */}
            <div className="mt-6 border-8 border-double border-[#173B65]/30 p-8 sm:p-12 rounded-3xl bg-radial from-amber-50/20 via-white to-slate-50 relative overflow-hidden shadow-inner text-center">
              {/* Corner Watermark Ornaments */}
              <div className="absolute top-4 left-4 text-xs font-bold text-slate-400 tracking-widest uppercase">
                MAGANG HEBAT &bull; VOKASI INDONESIA
              </div>
              <div className="absolute top-4 right-4 text-xs font-semibold text-slate-400">
                No. Seri: {certificateId}
              </div>

              {/* Logo Emblem */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#173B65] to-[#245791] text-white mx-auto flex items-center justify-center shadow-lg relative">
                <GraduationCap className="w-9 h-9 text-amber-300" />
              </div>

              <div className="mt-4">
                <h2 className="text-2xl sm:text-4xl font-black text-[#173B65] tracking-tight uppercase font-['Plus_Jakarta_Sans',sans-serif]">
                  SERTIFIKAT KELULUSAN
                </h2>
                <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-amber-700 mt-1">
                  Certificate of Internship Excellence
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 mt-6 font-medium">
                Diberikan dengan penuh penghargaan kepada:
              </p>

              <div className="mt-2 py-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 underline decoration-amber-400 decoration-4 underline-offset-8">
                  {currentUser.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 font-semibold">
                  NIM / NIS: {currentUser.nimOrNis} &bull; {currentUser.institution}
                </p>
              </div>

              <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-700 mt-6 leading-relaxed">
                Telah berhasil menyelesaikan seluruh rangkaian <strong>Program Magang Terpadu</strong> pada divisi <strong>{currentUser.divisionName}</strong> dengan predikat <strong>SANGAT BAIK (EXCELLENT)</strong>, memenuhi standar kompetensi industri, kedisiplinan kerja, dan kolaborasi aktif sepanjang periode magang.
              </p>

              {/* Signatures & Verification */}
              <div className="mt-12 pt-6 grid grid-cols-3 items-end gap-6 text-center border-t border-slate-200">
                <div>
                  <div className="h-14 flex items-center justify-center italic text-slate-600 text-sm font-serif">
                    Budi Wicaksono
                  </div>
                  <p className="text-xs font-bold text-slate-900 border-t border-slate-300 pt-1">
                    Budi Wicaksono, S.Kom
                  </p>
                  <p className="text-[10px] text-slate-500">Pembimbing Lapangan (Mentor)</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-white p-1 rounded-xl border border-slate-300 shadow-2xs flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-[#173B65]" />
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 uppercase font-semibold">
                    Verifikasi Digital Resmi
                  </span>
                </div>

                <div>
                  <div className="h-14 flex items-center justify-center italic text-slate-600 text-sm font-serif">
                    Sarah Annisa
                  </div>
                  <p className="text-xs font-bold text-slate-900 border-t border-slate-300 pt-1">
                    Sarah Annisa, S.Psi
                  </p>
                  <p className="text-[10px] text-slate-500">Program Lead & Human Capital</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end no-print">
              <button
                onClick={() => setIsCertificateOpen(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

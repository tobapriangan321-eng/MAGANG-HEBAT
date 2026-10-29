import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogbookEntry, LogbookStatus, InternEvaluation } from '../types';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Clock,
  Star,
  FileCheck,
  Calendar,
  X,
  Send,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const MentorReviewView: React.FC = () => {
  const {
    currentUser,
    allUsers,
    logbooks,
    tasks,
    attendanceRecords,
    evaluations,
    reviewLogbook,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending-logs' | 'my-mentees' | 'evaluations'>('pending-logs');
  const [selectedLogForReview, setSelectedLogForReview] = useState<LogbookEntry | null>(null);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [reviewDecision, setReviewDecision] = useState<LogbookStatus>('Disetujui');

  // Evaluation modal
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [selectedMenteeForEval, setSelectedMenteeForEval] = useState<string>('user-intern-1');
  const [evalCriteria, setEvalCriteria] = useState({
    discipline: 5,
    workQuality: 5,
    initiative: 4,
    communication: 4,
    teamwork: 5,
  });
  const [evalNotes, setEvalNotes] = useState('');
  const [evalStrengths, setEvalStrengths] = useState('');
  const [evalAreas, setEvalAreas] = useState('');

  // Mentees list
  const mentees = allUsers.filter((u) => u.role === 'peserta');

  // Pending logs needing mentor review
  const pendingLogs = logbooks.filter((l) => l.status === 'Menunggu Review');

  const handleOpenReview = (log: LogbookEntry) => {
    setSelectedLogForReview(log);
    setReviewDecision('Disetujui');
    setFeedbackNote('Laporan aktivitas jelas, detail pekerjaan telah sesuai target.');
  };

  const handleConfirmReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLogForReview) return;
    reviewLogbook(selectedLogForReview.id, reviewDecision, feedbackNote);
    setSelectedLogForReview(null);
  };

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      'Evaluasi Tersimpan',
      'Nilai kompetensi berkala peserta magang berhasil disimpan.',
      'success'
    );
    setIsEvalModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#173B65]/10 text-[#173B65] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Portal Pembimbing (Mentor)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tinjau logbook harian, berikan umpan balik konstruktif, dan nilai kompetensi peserta bimbingan.
          </p>
        </div>

        <button
          onClick={() => setIsEvalModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#173B65] hover:bg-[#1f4a7d] text-white font-bold text-xs rounded-xl shadow-md transition shrink-0"
        >
          <Star className="w-4 h-4 text-amber-300" />
          <span>Buat Evaluasi Berkala</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('pending-logs')}
          className={`pb-3 px-3 text-xs font-bold transition relative ${
            activeTab === 'pending-logs'
              ? 'text-[#173B65] border-b-2 border-[#173B65]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Antrean Logbook Menunggu Review</span>
          {pendingLogs.length > 0 && (
            <span className="ml-2 text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full">
              {pendingLogs.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('my-mentees')}
          className={`pb-3 px-3 text-xs font-bold transition relative ${
            activeTab === 'my-mentees'
              ? 'text-[#173B65] border-b-2 border-[#173B65]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Peserta Bimbingan ({mentees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('evaluations')}
          className={`pb-3 px-3 text-xs font-bold transition relative ${
            activeTab === 'evaluations'
              ? 'text-[#173B65] border-b-2 border-[#173B65]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Rekap Evaluasi Nilai</span>
        </button>
      </div>

      {/* TAB 1: PENDING LOGS REVIEW */}
      {activeTab === 'pending-logs' && (
        <div className="space-y-4">
          {pendingLogs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">Semua Logbook Sudah Ditinjau!</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Tidak ada laporan kegiatan yang tertunda saat ini. Anda akan mendapatkan notifikasi jika ada peserta mengirim laporan baru.
              </p>
            </div>
          ) : (
            pendingLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      👤 {log.userName}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{log.divisionName}</span>
                    <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-bold">
                      {log.date}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{log.activityTitle}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {log.workDescription}
                  </p>

                  <div className="mt-2 text-xs text-slate-500">
                    <span className="font-semibold text-emerald-700">Pembelajaran: </span>
                    <span>{log.learningGained}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenReview(log)}
                    className="px-4 py-2.5 bg-[#173B65] hover:bg-[#1f4a7d] text-white font-bold text-xs rounded-xl shadow-md transition"
                  >
                    Tinjau & Beri Feedback
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: MY MENTEES */}
      {activeTab === 'my-mentees' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentees.map((mentee) => {
            const menteeTasks = tasks.filter((t) => t.assignedToUserId === mentee.id);
            const menteeLogs = logbooks.filter((l) => l.userId === mentee.id);
            const completedTasks = menteeTasks.filter((t) => t.status === 'Selesai').length;

            return (
              <div
                key={mentee.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={mentee.avatar}
                      alt={mentee.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#173B65]/20"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{mentee.name}</h3>
                      <p className="text-[11px] text-slate-500 truncate">{mentee.institution}</p>
                      <span className="inline-block mt-0.5 text-[10px] font-bold text-[#173B65] bg-blue-50 px-2 py-0.5 rounded">
                        {mentee.divisionName}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2 rounded-xl text-center">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Tugas Selesai</p>
                      <p className="font-extrabold text-slate-800 text-sm mt-0.5">
                        {completedTasks} / {menteeTasks.length}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl text-center">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Logbook</p>
                      <p className="font-extrabold text-slate-800 text-sm mt-0.5">
                        {menteeLogs.length} Laporan
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {mentee.status}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedMenteeForEval(mentee.id);
                      setIsEvalModalOpen(true);
                    }}
                    className="text-xs font-bold text-[#173B65] hover:underline"
                  >
                    Beri Evaluasi &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: REKAP EVALUASI NILAI */}
      {activeTab === 'evaluations' && (
        <div className="space-y-4">
          {evaluations.map((evalItem) => {
            const internUser = allUsers.find((u) => u.id === evalItem.internId);

            return (
              <div
                key={evalItem.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-[#173B65] bg-blue-50 px-2.5 py-0.5 rounded-md">
                      {evalItem.period}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      Peserta: {internUser?.name} ({internUser?.institution})
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Tanggal: {evalItem.date}</span>
                </div>

                {/* Rubric scores */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Kedisiplinan</p>
                    <p className="text-lg font-black text-amber-600 mt-0.5">
                      {evalItem.criteria.discipline} / 5
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Kualitas Kerja</p>
                    <p className="text-lg font-black text-amber-600 mt-0.5">
                      {evalItem.criteria.workQuality} / 5
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Inisiatif</p>
                    <p className="text-lg font-black text-amber-600 mt-0.5">
                      {evalItem.criteria.initiative} / 5
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Komunikasi</p>
                    <p className="text-lg font-black text-amber-600 mt-0.5">
                      {evalItem.criteria.communication} / 5
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Kerja Tim</p>
                    <p className="text-lg font-black text-amber-600 mt-0.5">
                      {evalItem.criteria.teamwork} / 5
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-xs text-slate-600 space-y-2 bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                  <p>
                    <strong>Catatan Keseluruhan: </strong>
                    {evalItem.overallNotes}
                  </p>
                  <p>
                    <strong>Kekuatan Menonjol: </strong>
                    <span className="text-emerald-700 font-semibold">{evalItem.strengths}</span>
                  </p>
                  <p>
                    <strong>Rekomendasi Peningkatan: </strong>
                    <span className="text-amber-800 font-semibold">{evalItem.areasToImprove}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: REVIEW LOGBOOK */}
      {selectedLogForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Review Laporan Logbook</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Peserta: <strong>{selectedLogForReview.userName}</strong> &bull; {selectedLogForReview.date}
                </p>
              </div>
              <button
                onClick={() => setSelectedLogForReview(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReview} className="space-y-4 py-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-600 uppercase text-[10px] block">
                  Aktivitas yang dilaporkan:
                </span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedLogForReview.activityTitle}</p>
                <p className="text-slate-600 mt-1">{selectedLogForReview.workDescription}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Keputusan Verifikasi
                </label>
                <select
                  value={reviewDecision}
                  onChange={(e) => setReviewDecision(e.target.value as LogbookStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                >
                  <option value="Disetujui">Disetujui (Laporan Valid)</option>
                  <option value="Perlu Revisi">Perlu Revisi (Minta Perbaikan)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Catatan Masukan / Umpan Balik Mentor <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  placeholder="Berikan umpan balik yang membangun atau instruksi perbaikan..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedLogForReview(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#173B65] hover:bg-[#1f4a7d] text-white font-bold text-xs shadow-md"
                >
                  Simpan Keputusan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BUAT EVALUASI BERKALA */}
      {isEvalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Formulir Evaluasi Kompetensi</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Penilaian berkala berdasarkan 5 pilar kompetensi industri
                </p>
              </div>
              <button
                onClick={() => setIsEvalModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvaluation} className="space-y-4 py-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pilih Peserta Magang
                </label>
                <select
                  value={selectedMenteeForEval}
                  onChange={(e) => setSelectedMenteeForEval(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                >
                  {mentees.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — {m.institution} ({m.divisionName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Rubric Sliders / Inputs */}
              <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Nilai Kriteria (Skala 1 - 5)
                </span>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Kedisiplinan & Waktu:</span>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={evalCriteria.discipline}
                    onChange={(e) =>
                      setEvalCriteria({ ...evalCriteria, discipline: Number(e.target.value) })
                    }
                    className="w-16 px-2 py-1 rounded-lg border border-slate-300 text-center font-bold"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Kualitas & Kerapian Kerja:</span>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={evalCriteria.workQuality}
                    onChange={(e) =>
                      setEvalCriteria({ ...evalCriteria, workQuality: Number(e.target.value) })
                    }
                    className="w-16 px-2 py-1 rounded-lg border border-slate-300 text-center font-bold"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Inisiatif & Keaktifan:</span>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={evalCriteria.initiative}
                    onChange={(e) =>
                      setEvalCriteria({ ...evalCriteria, initiative: Number(e.target.value) })
                    }
                    className="w-16 px-2 py-1 rounded-lg border border-slate-300 text-center font-bold"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Komunikasi & Sikap Kerja:</span>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={evalCriteria.communication}
                    onChange={(e) =>
                      setEvalCriteria({ ...evalCriteria, communication: Number(e.target.value) })
                    }
                    className="w-16 px-2 py-1 rounded-lg border border-slate-300 text-center font-bold"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Kolaborasi & Kerjasama Tim:</span>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={evalCriteria.teamwork}
                    onChange={(e) =>
                      setEvalCriteria({ ...evalCriteria, teamwork: Number(e.target.value) })
                    }
                    className="w-16 px-2 py-1 rounded-lg border border-slate-300 text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Catatan Keseluruhan Mentor
                </label>
                <textarea
                  rows={2}
                  value={evalNotes}
                  onChange={(e) => setEvalNotes(e.target.value)}
                  placeholder="Ulasan komprehensif performa peserta..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEvalModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  Simpan Evaluasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

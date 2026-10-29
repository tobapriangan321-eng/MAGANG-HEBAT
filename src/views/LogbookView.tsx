import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogbookEntry, LogbookStatus } from '../types';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
  MessageSquare,
  Edit3,
  Trash2,
  X,
  Send,
  Save,
  ChevronRight,
  Eye,
  Info,
} from 'lucide-react';

export const LogbookView: React.FC = () => {
  const { currentUser, logbooks, saveLogbook, deleteLogbook, reviewLogbook } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('SEMUA');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLogForDetail, setSelectedLogForDetail] = useState<LogbookEntry | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().substring(0, 10),
    activityTitle: '',
    workDescription: '',
    learningGained: '',
    blockersOrChallenges: '',
    nextDayPlan: '',
    hoursSpent: 8,
  });

  // Filter logs according to role
  const relevantLogs = logbooks.filter((l) => {
    if (currentUser.role === 'peserta') {
      return l.userId === currentUser.id;
    }
    // Mentor can see all their mentees or all
    return true;
  });

  const filteredLogs = relevantLogs.filter((log) => {
    const matchesSearch =
      log.activityTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.workDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'SEMUA' || log.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().substring(0, 10),
      activityTitle: '',
      workDescription: '',
      learningGained: '',
      blockersOrChallenges: '',
      nextDayPlan: '',
      hoursSpent: 8,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (log: LogbookEntry) => {
    setEditingId(log.id);
    setFormData({
      date: log.date,
      activityTitle: log.activityTitle,
      workDescription: log.workDescription,
      learningGained: log.learningGained,
      blockersOrChallenges: log.blockersOrChallenges,
      nextDayPlan: log.nextDayPlan,
      hoursSpent: log.hoursSpent,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (targetStatus: 'Draft' | 'Menunggu Review') => {
    if (!formData.activityTitle.trim()) {
      alert('Judul kegiatan wajib diisi!');
      return;
    }
    if (!formData.workDescription.trim()) {
      alert('Deskripsi pekerjaan wajib diisi!');
      return;
    }

    saveLogbook({
      id: editingId || undefined,
      date: formData.date,
      activityTitle: formData.activityTitle,
      workDescription: formData.workDescription,
      learningGained: formData.learningGained,
      blockersOrChallenges: formData.blockersOrChallenges,
      nextDayPlan: formData.nextDayPlan,
      hoursSpent: Number(formData.hoursSpent) || 8,
      status: targetStatus,
    });

    setIsModalOpen(false);
  };

  const getStatusBadge = (status: LogbookStatus) => {
    switch (status) {
      case 'Disetujui':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Disetujui</span>
          </span>
        );
      case 'Menunggu Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu Review</span>
          </span>
        );
      case 'Perlu Revisi':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Perlu Revisi</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <FileText className="w-3.5 h-3.5" />
            <span>Draft</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#173B65]/10 text-[#173B65] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Logbook Harian
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Catat pekerjaan harian, hasil pembelajaran, kendala, dan rencana langkah esok hari.
          </p>
        </div>

        {currentUser.role === 'peserta' && (
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#173B65] hover:bg-[#1f4a7d] text-white font-bold text-xs rounded-xl shadow-md shadow-[#173B65]/20 transition shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tulis Logbook Baru</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari aktivitas, kendala, atau peserta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#173B65] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
            Status:
          </span>
          {['SEMUA', 'DISLESAIKAN', 'MENUNGGU REVIEW', 'PERLU REVISI', 'DRAFT'].map((tab) => {
            const filterKey = tab === 'DISLESAIKAN' ? 'Disetujui' : tab;
            const isSelected =
              statusFilter.toUpperCase() === (tab === 'DISLESAIKAN' ? 'DISETUJUI' : tab);
            return (
              <button
                key={tab}
                onClick={() =>
                  setStatusFilter(tab === 'DISLESAIKAN' ? 'Disetujui' : tab)
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-[#173B65] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab === 'SEMUA' ? 'Semua' : tab === 'DISLESAIKAN' ? 'Disetujui' : tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Logbook Items Grid */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Tidak ada logbook ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'SEMUA'
              ? 'Coba ganti filter atau kata kunci pencarian Anda.'
              : 'Mulai dokumentasikan aktivitas magang pertamamu dengan tombol "Tulis Logbook Baru".'}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-200 group relative"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {getStatusBadge(log.status)}
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#173B65]" />
                      {log.date}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      ⏱ {log.hoursSpent} Jam Kerja
                    </span>
                    {currentUser.role !== 'peserta' && (
                      <span className="text-xs font-semibold text-[#173B65] bg-blue-50 px-2 py-0.5 rounded-md">
                        👤 {log.userName} ({log.divisionName})
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#173B65] transition">
                    {log.activityTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {log.workDescription}
                  </p>

                  {/* Highlights Grid */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-emerald-50/70 border border-emerald-100/80 p-2.5 rounded-xl">
                      <span className="font-bold text-emerald-800 block text-[11px] uppercase tracking-wide">
                        💡 Pembelajaran Utama:
                      </span>
                      <p className="text-emerald-900 mt-0.5 line-clamp-1">{log.learningGained || '-'}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/70 p-2.5 rounded-xl">
                      <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wide">
                        🎯 Rencana Hari Berikutnya:
                      </span>
                      <p className="text-slate-600 mt-0.5 line-clamp-1">{log.nextDayPlan || '-'}</p>
                    </div>
                  </div>

                  {/* Mentor feedback if present */}
                  {log.mentorFeedback && (
                    <div className="mt-3 bg-blue-50/90 border border-blue-200/80 rounded-xl p-3 flex items-start gap-2.5">
                      <MessageSquare className="w-4 h-4 text-[#173B65] shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <span className="font-bold text-[#173B65]">
                          Catatan Mentor ({log.reviewedBy || 'Mentor'}):
                        </span>
                        <p className="text-slate-700 mt-0.5">{log.mentorFeedback}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center lg:flex-col justify-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <button
                    onClick={() => setSelectedLogForDetail(log)}
                    className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Detail</span>
                  </button>

                  {/* Edit action if owner & editable */}
                  {currentUser.role === 'peserta' &&
                    log.userId === currentUser.id &&
                    log.status !== 'Disetujui' && (
                      <button
                        onClick={() => handleOpenEditModal(log)}
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl transition border border-amber-200/70"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    )}

                  {/* Mentor quick review buttons */}
                  {currentUser.role === 'mentor' && log.status === 'Menunggu Review' && (
                    <button
                      onClick={() => {
                        const feedback = prompt('Catatan persetujuan (opsional):', 'Laporan lengkap dan disetujui.');
                        if (feedback !== null) {
                          reviewLogbook(log.id, 'Disetujui', feedback);
                        }
                      }}
                      className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Setujui</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 my-8 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#173B65]/10 text-[#173B65] flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {editingId ? 'Edit Laporan Logbook' : 'Tulis Logbook Kegiatan Harian'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pengisian transparan membantu mentor mengevaluasi progres belajarmu
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tanggal Kegiatan
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Total Durasi (Jam)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    step="0.5"
                    value={formData.hoursSpent}
                    onChange={(e) => setFormData({ ...formData, hoursSpent: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Judul Kegiatan / Pekerjaan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Misal: Slicing Komponen Card & Integrasi State Management"
                  value={formData.activityTitle}
                  onChange={(e) => setFormData({ ...formData, activityTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Deskripsi Lengkap Pekerjaan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan secara rinci apa yang Anda kerjakan, teknologi yang dipakai, serta hasilnya..."
                  value={formData.workDescription}
                  onChange={(e) => setFormData({ ...formData, workDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pembelajaran yang Diperoleh (Key Learnings)
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterampilan atau wawasan baru apa yang didapatkan hari ini?"
                  value={formData.learningGained}
                  onChange={(e) => setFormData({ ...formData, learningGained: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kendala / Hambatan
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Kendala teknis atau koordinasi (jika ada)..."
                    value={formData.blockersOrChallenges}
                    onChange={(e) => setFormData({ ...formData, blockersOrChallenges: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Rencana Hari Berikutnya
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Apa target utama yang akan diselesaikan besok?"
                    value={formData.nextDayPlan}
                    onChange={(e) => setFormData({ ...formData, nextDayPlan: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleSubmit('Draft')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
              >
                <Save className="w-4 h-4 text-slate-500" />
                <span>Simpan Draft</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit('Menunggu Review')}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#173B65] hover:bg-[#1f4a7d] text-white font-bold text-xs shadow-md transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Laporan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedLogForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 sm:p-7 max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getStatusBadge(selectedLogForDetail.status)}
                  <span className="text-xs text-slate-400 font-semibold">{selectedLogForDetail.date}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  {selectedLogForDetail.activityTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLogForDetail(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-slate-700">
              <div>
                <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                  Deskripsi Pekerjaan
                </p>
                <p className="mt-1 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedLogForDetail.workDescription}
                </p>
              </div>

              <div>
                <p className="font-bold uppercase tracking-wider text-emerald-600 text-[10px]">
                  Pembelajaran yang Diperoleh
                </p>
                <p className="mt-1 leading-relaxed bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-emerald-950">
                  {selectedLogForDetail.learningGained || 'Tidak ada catatan khusus.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="font-bold uppercase tracking-wider text-rose-500 text-[10px]">
                    Kendala / Hambatan
                  </p>
                  <p className="mt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {selectedLogForDetail.blockersOrChallenges || 'Lancar tanpa kendala.'}
                  </p>
                </div>
                <div>
                  <p className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                    Rencana Besok
                  </p>
                  <p className="mt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {selectedLogForDetail.nextDayPlan || 'Melanjutkan tugas berkala.'}
                  </p>
                </div>
              </div>

              {selectedLogForDetail.mentorFeedback && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <p className="text-xs font-bold text-[#173B65] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Catatan Review Mentor ({selectedLogForDetail.reviewedBy})</span>
                  </p>
                  <p className="text-xs text-slate-700 mt-1">{selectedLogForDetail.mentorFeedback}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Ditinjau pada: {selectedLogForDetail.reviewedAt}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedLogForDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

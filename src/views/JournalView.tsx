import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LearningJournalEntry } from '../types';
import {
  Sparkles,
  Plus,
  Search,
  BookOpen,
  Calendar,
  Smile,
  Tag,
  Trash2,
  Edit2,
  X,
  Send,
  HelpCircle,
  Lightbulb,
  Target,
} from 'lucide-react';

export const JournalView: React.FC = () => {
  const { currentUser, journals, saveJournal, deleteJournal } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().substring(0, 10),
    keyLearning: '',
    improvementPlan: '',
    category: 'Hard Skill' as LearningJournalEntry['category'],
    tagsInput: 'Frontend, React',
    mood: 'Sangat Semangat' as LearningJournalEntry['mood'],
  });

  const relevantJournals = journals.filter((j) => {
    if (currentUser.role === 'peserta') {
      return j.userId === currentUser.id;
    }
    return true;
  });

  const filteredJournals = relevantJournals.filter((journal) => {
    const matchesSearch =
      journal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journal.keyLearning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journal.improvementPlan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journal.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'SEMUA' || journal.category.toUpperCase() === selectedCategory.toUpperCase();

    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      date: new Date().toISOString().substring(0, 10),
      keyLearning: '',
      improvementPlan: '',
      category: 'Hard Skill',
      tagsInput: 'Karier, Pengembangan Diri',
      mood: 'Sangat Semangat',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (journal: LearningJournalEntry) => {
    setEditingId(journal.id);
    setFormData({
      title: journal.title,
      date: journal.date,
      keyLearning: journal.keyLearning,
      improvementPlan: journal.improvementPlan,
      category: journal.category,
      tagsInput: journal.tags.join(', '),
      mood: journal.mood,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Judul jurnal refleksi wajib diisi!');
      return;
    }
    if (!formData.keyLearning.trim()) {
      alert('Tuliskan apa yang Anda pelajari hari ini.');
      return;
    }

    const tagsArray = formData.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    saveJournal({
      id: editingId || undefined,
      title: formData.title,
      date: formData.date,
      keyLearning: formData.keyLearning,
      improvementPlan: formData.improvementPlan,
      category: formData.category,
      tags: tagsArray,
      mood: formData.mood,
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Jurnal Refleksi Pembelajaran
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Wadah mencatat keterampilan baru, evaluasi diri, dan komitmen perbaikan esok hari.
          </p>
        </div>

        {currentUser.role === 'peserta' && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#173B65] hover:bg-[#1f4a7d] text-white font-bold text-xs rounded-xl shadow-md transition shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tulis Refleksi Baru</span>
          </button>
        )}
      </div>

      {/* Guided Reflection Prompts Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-sky-50 to-white border border-amber-200/70 rounded-2xl p-5">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#F59E0B]" />
          <span>Panduan Refleksi Harian (Reflective Thinking)</span>
        </h3>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-white/90 p-3 rounded-xl border border-amber-200/50 shadow-2xs">
            <span className="font-bold text-[#173B65] flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              1. &ldquo;Apa yang saya pelajari hari ini?&rdquo;
            </span>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Catat keterampilan teknis, formula baru, cara komunikasi dengan tim, atau solusi dari masalah rumit yang berhasil dipecahkan.
            </p>
          </div>
          <div className="bg-white/90 p-3 rounded-xl border border-sky-200/50 shadow-2xs">
            <span className="font-bold text-[#173B65] flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-sky-500" />
              2. &ldquo;Apa yang akan saya tingkatkan besok?&rdquo;
            </span>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Tentukan satu hal konkret: manajemen waktu, bertanya lebih awal, membaca dokumentasi, atau merapikan penamaan variabel kode.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari refleksi, tag, kata kunci..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#173B65] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
            Kategori:
          </span>
          {['SEMUA', 'HARD SKILL', 'SOFT SKILL', 'KOLABORASI', 'PROBLEM SOLVING'].map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-[#173B65] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat === 'SEMUA' ? 'Semua Kategori' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Journal Cards List */}
      {filteredJournals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Belum ada jurnal refleksi</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Gunakan tombol &quot;Tulis Refleksi Baru&quot; untuk mengawali kebiasaan mencatat pembelajaran bermakna.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJournals.map((journal) => (
            <div
              key={journal.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-[#173B65] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                    {journal.category}
                  </span>
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <span className="flex items-center gap-1 font-semibold text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-[#173B65]" />
                      {journal.date}
                    </span>
                    <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md text-[10px] font-bold">
                      {journal.mood}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#173B65] transition">
                  {journal.title}
                </h3>

                {/* Key Questions Content */}
                <div className="mt-3.5 space-y-3 text-xs">
                  <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                    <span className="font-extrabold text-emerald-900 block text-[11px] mb-1">
                      💡 Apa yang saya pelajari hari ini?
                    </span>
                    <p className="text-emerald-950 leading-relaxed font-normal">
                      {journal.keyLearning}
                    </p>
                  </div>

                  <div className="bg-sky-50/70 p-3 rounded-xl border border-sky-100">
                    <span className="font-extrabold text-sky-900 block text-[11px] mb-1">
                      🎯 Apa yang akan saya tingkatkan besok?
                    </span>
                    <p className="text-sky-950 leading-relaxed font-normal">
                      {journal.improvementPlan}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags and actions footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {journal.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {currentUser.role === 'peserta' && journal.userId === currentUser.id && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(journal)}
                      className="p-1.5 text-slate-400 hover:text-[#173B65] hover:bg-slate-100 rounded-lg transition"
                      title="Edit Jurnal"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Hapus jurnal refleksi ini?')) {
                          deleteJournal(journal.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Hapus Jurnal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 sm:p-7 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {editingId ? 'Edit Jurnal Pembelajaran' : 'Tulis Jurnal Refleksi Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dokumentasikan kemajuan dan insight pribadimu
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as LearningJournalEntry['category'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  >
                    <option value="Hard Skill">Hard Skill (Teknis & Alat)</option>
                    <option value="Soft Skill">Soft Skill (Komunikasi & Mindset)</option>
                    <option value="Kolaborasi">Kolaborasi & Kerjasama Tim</option>
                    <option value="Problem Solving">Problem Solving & Analisis</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Judul Refleksi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Misal: Belajar Menangani Asynchronous Data di React"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Apa yang saya pelajari hari ini? *</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan keterampilan atau wawasan penting yang berhasil Anda pahami..."
                  value={formData.keyLearning}
                  onChange={(e) => setFormData({ ...formData, keyLearning: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sky-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>Apa yang akan saya tingkatkan besok? *</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Tuliskan komitmen tindakan konkret untuk esok hari..."
                  value={formData.improvementPlan}
                  onChange={(e) => setFormData({ ...formData, improvementPlan: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Label Tag (pisahkan koma)
                  </label>
                  <input
                    type="text"
                    placeholder="React, CSS, ProblemSolving"
                    value={formData.tagsInput}
                    onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Suasana Belajar Hari Ini
                  </label>
                  <select
                    value={formData.mood}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mood: e.target.value as LearningJournalEntry['mood'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  >
                    <option value="Sangat Semangat">Sangat Semangat 🚀</option>
                    <option value="Produktif">Produktif & Fokus ✨</option>
                    <option value="Tantangan Berat">Tantangan Berat 💡</option>
                    <option value="Butuh Dukungan">Butuh Dukungan 🤝</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#173B65] hover:bg-[#1f4a7d] text-white font-bold text-xs shadow-md"
                >
                  Simpan Jurnal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

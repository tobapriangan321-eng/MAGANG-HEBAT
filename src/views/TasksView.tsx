import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskItem, TaskPriority, TaskStatus } from '../types';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  ExternalLink,
  Clock,
  CheckCircle2,
  Send,
  X,
  Kanban,
  List,
  Flame,
  Award,
  User,
  Star,
  FileCheck,
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const {
    currentUser,
    tasks,
    saveTask,
    deleteTask,
    submitTaskWork,
    reviewTaskSubmission,
    updateTaskStatusDirectly,
    allUsers,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('SEMUA');
  const [statusFilter, setStatusFilter] = useState<string>('SEMUA');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submissionModalTask, setSubmissionModalTask] = useState<TaskItem | null>(null);
  const [reviewModalTask, setReviewModalTask] = useState<TaskItem | null>(null);

  // Form New Task (Mentor / Admin)
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    assignedToUserId: currentUser.role === 'peserta' ? currentUser.id : 'user-intern-1',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    priority: 'Sedang' as TaskPriority,
  });

  // Submission Form
  const [submissionLink, setSubmissionLink] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');

  // Mentor Review Form
  const [reviewStatus, setReviewStatus] = useState<TaskStatus>('Selesai');
  const [reviewScore, setReviewScore] = useState<number>(90);
  const [reviewFeedback, setReviewFeedback] = useState('');

  // Filter tasks
  const relevantTasks = tasks.filter((t) => {
    if (currentUser.role === 'peserta') {
      return t.assignedToUserId === currentUser.id;
    }
    return true; // Mentor & Admin view all
  });

  const filteredTasks = relevantTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedToUserName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority =
      priorityFilter === 'SEMUA' || task.priority.toUpperCase() === priorityFilter.toUpperCase();

    const matchesStatus =
      statusFilter === 'SEMUA' || task.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Helper for near deadline indicator (within 2 days)
  const isNearDeadline = (dueDateStr: string, status: TaskStatus) => {
    if (status === 'Selesai') return false;
    const due = new Date(dueDateStr).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && diffDays >= 0;
  };

  const isOverdue = (dueDateStr: string, status: TaskStatus) => {
    if (status === 'Selesai') return false;
    const due = new Date(dueDateStr).getTime();
    const now = new Date().getTime();
    return due < now;
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskData.title.trim()) {
      alert('Judul tugas wajib diisi!');
      return;
    }
    saveTask({
      title: newTaskData.title,
      description: newTaskData.description,
      assignedToUserId: newTaskData.assignedToUserId,
      dueDate: newTaskData.dueDate,
      priority: newTaskData.priority,
      status: 'Belum Dikerjakan',
    });
    setIsCreateModalOpen(false);
  };

  const handleOpenSubmission = (task: TaskItem) => {
    setSubmissionModalTask(task);
    setSubmissionLink(task.submissionLink || '');
    setSubmissionNotes(task.submissionNotes || '');
  };

  const handleSubmitWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionModalTask) return;
    if (!submissionLink.trim() && !submissionNotes.trim()) {
      alert('Mohon cantumkan tautan hasil kerja atau ringkasan pengerjaan.');
      return;
    }
    submitTaskWork(submissionModalTask.id, submissionLink, submissionNotes);
    setSubmissionModalTask(null);
  };

  const handleOpenReview = (task: TaskItem) => {
    setReviewModalTask(task);
    setReviewStatus(task.status === 'Menunggu Review' ? 'Selesai' : task.status);
    setReviewScore(task.score || 90);
    setReviewFeedback(task.mentorFeedback || 'Pengerjaan baik dan sesuai kriteria.');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalTask) return;
    reviewTaskSubmission(reviewModalTask.id, reviewStatus, reviewScore, reviewFeedback);
    setReviewModalTask(null);
  };

  const KANBAN_COLUMNS: TaskStatus[] = [
    'Belum Dikerjakan',
    'Sedang Dikerjakan',
    'Menunggu Review',
    'Selesai',
  ];

  const getPriorityStyle = (priority: TaskPriority) => {
    switch (priority) {
      case 'Tinggi':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Sedang':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#173B65]/10 text-[#173B65] flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Manajemen Tugas & Proyek
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau misi dari mentor, laporkan hasil karya, dan evaluasi hasil akhir.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Switch View Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg flex items-center gap-1.5 transition ${
                viewMode === 'kanban'
                  ? 'bg-white text-[#173B65] shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Papan Kanban"
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">Papan Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg flex items-center gap-1.5 transition ${
                viewMode === 'list'
                  ? 'bg-white text-[#173B65] shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Daftar Tabel"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Daftar</span>
            </button>
          </div>

          {(currentUser.role === 'mentor' || currentUser.role === 'admin') && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#173B65] hover:bg-[#1f4a7d] text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Beri Tugas Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari tugas, deskripsi, atau peserta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#173B65] focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Priority filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Prioritas:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700"
            >
              <option value="SEMUA">Semua</option>
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
              <option value="Rendah">Rendah</option>
            </select>
          </div>

          {/* Status filter (mainly useful in list view) */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700"
            >
              <option value="SEMUA">Semua</option>
              <option value="Belum Dikerjakan">Belum Dikerjakan</option>
              <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
              <option value="Menunggu Review">Menunggu Review</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>
      </div>

      {/* RENDER VIEW: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {KANBAN_COLUMNS.map((columnStatus) => {
            const columnTasks = filteredTasks.filter((t) => t.status === columnStatus);

            return (
              <div
                key={columnStatus}
                className="bg-slate-100/80 rounded-2xl p-3.5 border border-slate-200 flex flex-col min-h-[420px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        columnStatus === 'Selesai'
                          ? 'bg-emerald-500'
                          : columnStatus === 'Menunggu Review'
                          ? 'bg-amber-500'
                          : columnStatus === 'Sedang Dikerjakan'
                          ? 'bg-sky-500'
                          : 'bg-slate-400'
                      }`}
                    />
                    <h3 className="text-xs font-bold text-slate-800">{columnStatus}</h3>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {columnTasks.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs italic border border-dashed border-slate-200 rounded-xl">
                      Kosong
                    </div>
                  ) : (
                    columnTasks.map((task) => {
                      const nearDeadline = isNearDeadline(task.dueDate, task.status);
                      const overdue = isOverdue(task.dueDate, task.status);

                      return (
                        <div
                          key={task.id}
                          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
                        >
                          <div>
                            {/* Badges */}
                            <div className="flex items-center justify-between gap-1 mb-2">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getPriorityStyle(
                                  task.priority
                                )}`}
                              >
                                {task.priority}
                              </span>

                              {nearDeadline && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md animate-pulse">
                                  <Flame className="w-3 h-3 text-amber-500" />
                                  <span>Mepet Tenggat!</span>
                                </span>
                              )}

                              {overdue && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-md">
                                  <AlertCircle className="w-3 h-3 text-rose-500" />
                                  <span>Terlewat</span>
                                </span>
                              )}
                            </div>

                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#173B65] transition leading-snug">
                              {task.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          </div>

                          {/* Footer details */}
                          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                            <div className="flex items-center justify-between text-[10px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                {task.dueDate}
                              </span>
                              <span className="font-semibold text-slate-700">
                                {task.assignedToUserName}
                              </span>
                            </div>

                            {/* Submission Score if Completed */}
                            {task.status === 'Selesai' && task.score && (
                              <div className="flex items-center justify-between bg-emerald-50 px-2 py-1 rounded-md text-[11px] font-bold text-emerald-800">
                                <span>Nilai Tugas:</span>
                                <span className="flex items-center gap-1 text-emerald-700">
                                  <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                                  {task.score}/100
                                </span>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-1 gap-1">
                              {currentUser.role === 'peserta' && (
                                <>
                                  {task.status === 'Belum Dikerjakan' && (
                                    <button
                                      onClick={() =>
                                        updateTaskStatusDirectly(task.id, 'Sedang Dikerjakan')
                                      }
                                      className="w-full py-1.5 text-center text-[11px] font-bold bg-[#173B65] text-white rounded-lg hover:bg-[#1f4a7d] transition"
                                    >
                                      Mulai Kerjakan
                                    </button>
                                  )}

                                  {task.status === 'Sedang Dikerjakan' && (
                                    <button
                                      onClick={() => handleOpenSubmission(task)}
                                      className="w-full py-1.5 text-center text-[11px] font-bold bg-[#F59E0B] text-slate-950 rounded-lg hover:bg-amber-500 transition shadow-xs flex items-center justify-center gap-1"
                                    >
                                      <Send className="w-3 h-3" />
                                      <span>Kirim Hasil Kerja</span>
                                    </button>
                                  )}

                                  {task.status === 'Menunggu Review' && (
                                    <span className="text-[11px] text-amber-700 font-semibold italic text-center w-full">
                                      Menunggu penilaian mentor
                                    </span>
                                  )}
                                </>
                              )}

                              {currentUser.role === 'mentor' && (
                                <button
                                  onClick={() => handleOpenReview(task)}
                                  className="w-full py-1.5 text-center text-[11px] font-bold bg-slate-100 hover:bg-[#173B65] hover:text-white text-slate-800 rounded-lg transition"
                                >
                                  Tinjau / Beri Nilai
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RENDER VIEW: LIST / TABLE VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Tugas</th>
                  <th className="px-4 py-3.5">Peserta</th>
                  <th className="px-4 py-3.5">Prioritas</th>
                  <th className="px-4 py-3.5">Tenggat Waktu</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400 italic">
                      Tidak ada tugas yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-5 py-3.5 max-w-sm">
                        <p className="font-bold text-slate-900 line-clamp-1">{task.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{task.description}</p>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-800">
                        {task.assignedToUserName}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getPriorityStyle(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 font-semibold">
                        {task.dueDate}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                            task.status === 'Selesai'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : task.status === 'Menunggu Review'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : task.status === 'Sedang Dikerjakan'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        {currentUser.role === 'peserta' && task.status === 'Sedang Dikerjakan' && (
                          <button
                            onClick={() => handleOpenSubmission(task)}
                            className="px-3 py-1.5 bg-[#F59E0B] text-slate-950 font-bold rounded-lg hover:bg-amber-500 transition text-[11px]"
                          >
                            Kirim Hasil
                          </button>
                        )}
                        {currentUser.role === 'mentor' && (
                          <button
                            onClick={() => handleOpenReview(task)}
                            className="px-3 py-1.5 bg-[#173B65] text-white font-bold rounded-lg hover:bg-[#1f4a7d] transition text-[11px]"
                          >
                            Review
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: SUBMISSION TUGAS OLEH PESERTA */}
      {submissionModalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Kirim Hasil Pengerjaan Tugas</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium line-clamp-1">
                  {submissionModalTask.title}
                </p>
              </div>
              <button
                onClick={() => setSubmissionModalTask(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitWork} className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tautan Hasil Karya (Link GitHub / Figma / Google Drive / PR)
                </label>
                <div className="relative">
                  <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={submissionLink}
                    onChange={(e) => setSubmissionLink(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Catatan untuk Mentor
                </label>
                <textarea
                  rows={4}
                  placeholder="Ceritakan fitur apa saja yang selesai, bagian mana yang perlu diperhatikan, atau kendala pengerjaan..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSubmissionModalTask(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#173B65] hover:bg-[#1f4a7d] text-white font-bold text-xs shadow-md"
                >
                  Kirim ke Mentor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REVIEW TUGAS OLEH MENTOR */}
      {reviewModalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Evaluasi & Nilai Tugas</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium line-clamp-1">
                  Peserta: {reviewModalTask.assignedToUserName}
                </p>
              </div>
              <button
                onClick={() => setReviewModalTask(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 py-4">
              {reviewModalTask.submissionLink && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-600 block text-[10px] uppercase">
                    Tautan Karya Peserta:
                  </span>
                  <a
                    href={reviewModalTask.submissionLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#173B65] font-bold hover:underline break-all flex items-center gap-1 mt-1"
                  >
                    <span>{reviewModalTask.submissionLink}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                  {reviewModalTask.submissionNotes && (
                    <p className="text-slate-600 mt-2 text-[11px] italic bg-white p-2 rounded-lg border border-slate-100">
                      &ldquo;{reviewModalTask.submissionNotes}&rdquo;
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status Akhir
                  </label>
                  <select
                    value={reviewStatus}
                    onChange={(e) => setReviewStatus(e.target.value as TaskStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  >
                    <option value="Selesai">Selesai (Lulus)</option>
                    <option value="Sedang Dikerjakan">Perlu Revisi (Kembalikan)</option>
                    <option value="Menunggu Review">Menunggu Review</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nilai (0 - 100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={reviewScore}
                    onChange={(e) => setReviewScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Umpan Balik / Catatan Mentor
                </label>
                <textarea
                  rows={3}
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  placeholder="Kelebihan hasil kerja, hal yang perlu ditingkatkan, atau apresiasi..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewModalTask(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  Simpan Penilaian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BUAT TUGAS BARU (MENTOR / ADMIN) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Beri Tugas Baru ke Peserta</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tugaskan proyek atau latihan kompetensi terarah
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pilih Peserta Magang
                </label>
                <select
                  value={newTaskData.assignedToUserId}
                  onChange={(e) =>
                    setNewTaskData({ ...newTaskData, assignedToUserId: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                >
                  {allUsers
                    .filter((u) => u.role === 'peserta')
                    .map((intern) => (
                      <option key={intern.id} value={intern.id}>
                        {intern.name} — {intern.institution} ({intern.divisionName})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Judul Tugas <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Misal: Optimasi Responsive Layout Halaman Profil"
                  value={newTaskData.title}
                  onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Deskripsi & Kriteria Selesai
                </label>
                <textarea
                  rows={3}
                  placeholder="Spesifikasi pengerjaan, format berkas, panduan pengerjaan..."
                  value={newTaskData.description}
                  onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tenggat Waktu
                  </label>
                  <input
                    type="date"
                    value={newTaskData.dueDate}
                    onChange={(e) => setNewTaskData({ ...newTaskData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Prioritas
                  </label>
                  <select
                    value={newTaskData.priority}
                    onChange={(e) =>
                      setNewTaskData({
                        ...newTaskData,
                        priority: e.target.value as TaskPriority,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  >
                    <option value="Tinggi">Tinggi</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Rendah">Rendah</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#173B65] hover:bg-[#1f4a7d] text-white font-bold text-xs shadow-md"
                >
                  Bagikan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

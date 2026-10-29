import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile, UserRole, InternStatus } from '../types';
import {
  Layers,
  Users,
  Building,
  FileSpreadsheet,
  Download,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit2,
  X,
  Database,
  RefreshCw,
  BarChart3,
  Calendar,
  Clock,
  Printer,
} from 'lucide-react';

export const AdminManagementView: React.FC = () => {
  const {
    allUsers,
    divisions,
    attendanceRecords,
    logbooks,
    tasks,
    updateUserStatus,
    addUser,
    deleteUser,
    addDivision,
    resetToDefaultData,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'divisions' | 'reports'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('SEMUA');

  // New User Modal
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'peserta' as UserRole,
    institution: '',
    major: '',
    nimOrNis: '',
    divisionId: 'div-1',
    startDate: '2026-09-01',
    endDate: '2026-11-30',
    phone: '+62 8',
    status: 'Aktif' as InternStatus,
  });

  // New Division Modal
  const [isAddDivModalOpen, setIsAddDivModalOpen] = useState(false);
  const [newDivData, setNewDivData] = useState({
    name: '',
    headName: '',
    description: '',
  });

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.divisionName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === 'SEMUA' || user.role.toUpperCase() === roleFilter.toUpperCase();

    return matchesSearch && matchesRole;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.name.trim() || !newUserData.email.trim()) {
      alert('Nama dan Email wajib diisi!');
      return;
    }

    const divisionObj = divisions.find((d) => d.id === newUserData.divisionId) || divisions[0];

    addUser({
      name: newUserData.name,
      email: newUserData.email,
      role: newUserData.role,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=200&auto=format&fit=crop&q=80`,
      institution: newUserData.institution || 'Politeknik Negeri',
      major: newUserData.major || 'Teknik Informatika',
      nimOrNis: newUserData.nimOrNis || `NIM-${Date.now().toString().slice(-4)}`,
      divisionId: divisionObj.id,
      divisionName: divisionObj.name,
      mentorId: 'user-mentor-1',
      mentorName: 'Budi Wicaksono, S.Kom',
      startDate: newUserData.startDate,
      endDate: newUserData.endDate,
      status: newUserData.status,
      phone: newUserData.phone,
      address: 'Bandung / Jakarta',
      bio: 'Peserta magang siap berkarya.',
      skills: ['Office', 'Kolaborasi', 'Problem Solving'],
    });

    setIsAddUserModalOpen(false);
    setNewUserData({
      name: '',
      email: '',
      role: 'peserta',
      institution: '',
      major: '',
      nimOrNis: '',
      divisionId: 'div-1',
      startDate: '2026-09-01',
      endDate: '2026-11-30',
      phone: '+62 8',
      status: 'Aktif',
    });
  };

  const handleCreateDivision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDivData.name.trim()) {
      alert('Nama divisi wajib diisi!');
      return;
    }
    addDivision({
      name: newDivData.name,
      headName: newDivData.headName || 'Koordinator Tim',
      description: newDivData.description || 'Fungsi operasional.',
    });
    setIsAddDivModalOpen(false);
    setNewDivData({ name: '', headName: '', description: '' });
  };

  // CSV Export
  const exportParticipantsCSV = () => {
    const headers = ['Nama', 'Email', 'Peran', 'Institusi', 'Divisi', 'NIM/NIS', 'Status', 'Mulai', 'Selesai'];
    const rows = allUsers.map((u) => [
      `"${u.name}"`,
      `"${u.email}"`,
      `"${u.role}"`,
      `"${u.institution}"`,
      `"${u.divisionName}"`,
      `"${u.nimOrNis}"`,
      `"${u.status}"`,
      `"${u.startDate}"`,
      `"${u.endDate}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap-peserta-magang-${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Ekspor Berhasil', 'Berkas CSV rekap data peserta berhasil diunduh.', 'success');
  };

  const exportAttendanceCSV = () => {
    const headers = ['Tanggal', 'Peserta', 'Status', 'Mode', 'Jam Masuk', 'Jam Pulang', 'Lokasi', 'Catatan'];
    const rows = attendanceRecords.map((a) => [
      `"${a.date}"`,
      `"${a.userName}"`,
      `"${a.status}"`,
      `"${a.workMode}"`,
      `"${a.checkInTime || '-'}"`,
      `"${a.checkOutTime || '-'}"`,
      `"${a.location}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap-presensi-magang-${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Ekspor Berhasil', 'Berkas CSV rekap presensi berhasil diunduh.', 'success');
  };

  // High-level summary metrics
  const totalPeserta = allUsers.filter((u) => u.role === 'peserta').length;
  const totalMentor = allUsers.filter((u) => u.role === 'mentor').length;
  const totalLogs = logbooks.length;
  const approvedLogs = logbooks.filter((l) => l.status === 'Disetujui').length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Master Pengelola Program (Admin)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola data peserta, divisi, akun akses, serta pantau dan unduh rekapitulasi data program.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportParticipantsCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV Peserta</span>
          </button>
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#173B65] hover:bg-[#1f4a7d] text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah Pengguna</span>
          </button>
        </div>
      </div>

      {/* Admin Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Peserta</p>
          <p className="text-2xl lg:text-3xl font-extrabold text-[#173B65] mt-1">{totalPeserta}</p>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">100% Aktif Terdaftar</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Mentor</p>
          <p className="text-2xl lg:text-3xl font-extrabold text-[#173B65] mt-1">{totalMentor}</p>
          <p className="text-[11px] text-slate-500 mt-1">Pembimbing Industri</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Divisi Aktif</p>
          <p className="text-2xl lg:text-3xl font-extrabold text-[#173B65] mt-1">{divisions.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Departemen Operasional</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Logbook Disetujui</p>
          <p className="text-2xl lg:text-3xl font-extrabold text-emerald-600 mt-1">{approvedLogs} / {totalLogs}</p>
          <p className="text-[11px] text-slate-500 mt-1">Terverifikasi Mentor</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-3 text-xs font-bold transition relative ${
            activeTab === 'users'
              ? 'text-[#173B65] border-b-2 border-[#173B65]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Daftar Pengguna ({allUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('divisions')}
          className={`pb-3 px-3 text-xs font-bold transition relative ${
            activeTab === 'divisions'
              ? 'text-[#173B65] border-b-2 border-[#173B65]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Kelola Divisi ({divisions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 px-3 text-xs font-bold transition relative ${
            activeTab === 'reports'
              ? 'text-[#173B65] border-b-2 border-[#173B65]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Rekap Laporan & Ekspor Berkas</span>
        </button>
      </div>

      {/* TAB 1: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama, email, kampus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#173B65]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Peran:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700"
              >
                <option value="SEMUA">Semua Peran</option>
                <option value="PESERTA">Peserta Magang</option>
                <option value="MENTOR">Mentor</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Nama & Kontak</th>
                    <th className="px-4 py-3.5">Peran</th>
                    <th className="px-4 py-3.5">Institusi & Jurusan</th>
                    <th className="px-4 py-3.5">Divisi</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{u.name}</p>
                            <p className="text-[10px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : u.role === 'mentor'
                              ? 'bg-blue-100 text-[#173B65]'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-slate-800">{u.institution}</p>
                        <p className="text-[10px] text-slate-400">{u.major}</p>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-700">{u.divisionName}</td>
                      <td className="px-4 py-3.5">
                        <select
                          value={u.status}
                          onChange={(e) =>
                            updateUserStatus(u.id, e.target.value as InternStatus)
                          }
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-bold"
                        >
                          <option value="Aktif">Aktif</option>
                          <option value="Selesai">Selesai</option>
                          <option value="Cuti">Cuti</option>
                        </select>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            if (confirm(`Hapus akun ${u.name}?`)) {
                              deleteUser(u.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus Akun"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIVISIONS */}
      {activeTab === 'divisions' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsAddDivModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#173B65] text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tambah Divisi Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {divisions.map((div) => {
              const internInDiv = allUsers.filter(
                (u) => u.divisionId === div.id && u.role === 'peserta'
              );

              return (
                <div
                  key={div.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900">{div.name}</h3>
                      <span className="text-xs font-bold text-[#173B65] bg-blue-50 px-2.5 py-0.5 rounded-full">
                        {internInDiv.length} Peserta
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {div.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">
                        Koordinator / Lead:
                      </span>
                      <p className="font-bold text-slate-800 mt-0.5">{div.headName}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>ID: {div.id}</span>
                    <span className="text-emerald-600 font-semibold">Aktif Beroperasi</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: REKAP & EXPORT */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Rekap Data Peserta Magang</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Ekspor daftar lengkap seluruh peserta, divisi, institusi kampus/SMK, periode magang, dan nomor kontak aktif ke format berkas CSV.
                </p>
              </div>

              <button
                onClick={exportParticipantsCSV}
                className="mt-6 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Berkas CSV Peserta</span>
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#173B65] flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Rekap Kehadiran (Presensi)</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Ekspor log presensi harian, jam masuk/pulang, status WFO/WFH, geotag lokasi kantor, dan catatan izin/sakit peserta magang.
                </p>
              </div>

              <button
                onClick={exportAttendanceCSV}
                className="mt-6 w-full py-2.5 bg-[#173B65] hover:bg-[#1f4a7d] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Berkas CSV Presensi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH USER */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Tambah Akun Pengguna</h3>
                <p className="text-xs text-slate-500 mt-0.5">Daftarkan peserta atau mentor ke program</p>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 py-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserData.name}
                    onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Peran (Role)
                  </label>
                  <select
                    value={newUserData.role}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, role: e.target.value as UserRole })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  >
                    <option value="peserta">Peserta Magang</option>
                    <option value="mentor">Mentor Pembimbing</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Divisi Penempatan
                  </label>
                  <select
                    value={newUserData.divisionId}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, divisionId: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  >
                    {divisions.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Asal Kampus / Sekolah
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Universitas Indonesia"
                    value={newUserData.institution}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, institution: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Jurusan / Program Studi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Ilmu Komputer"
                    value={newUserData.major}
                    onChange={(e) => setNewUserData({ ...newUserData, major: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#173B65] hover:bg-[#1f4a7d] text-white font-bold text-xs shadow-md"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH DIVISI */}
      {isAddDivModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Tambah Divisi Baru</h3>
              <button
                onClick={() => setIsAddDivModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDivision} className="space-y-4 py-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Divisi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: AI & Machine Learning"
                  value={newDivData.name}
                  onChange={(e) => setNewDivData({ ...newDivData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Koordinator / Head
                </label>
                <input
                  type="text"
                  placeholder="Misal: Dr. Rahmat Hidayat"
                  value={newDivData.headName}
                  onChange={(e) => setNewDivData({ ...newDivData, headName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Deskripsi Divisi
                </label>
                <textarea
                  rows={2}
                  placeholder="Fokus tugas dan lingkup kerja divisi..."
                  value={newDivData.description}
                  onChange={(e) => setNewDivData({ ...newDivData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDivModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#173B65] text-white font-bold text-xs shadow-md"
                >
                  Simpan Divisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

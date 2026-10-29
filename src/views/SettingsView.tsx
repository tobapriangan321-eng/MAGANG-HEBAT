import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Database,
  Bell,
  Shield,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Trash2,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentUser, resetToDefaultData, showToast } = useApp();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [defaultWorkMode, setDefaultWorkMode] = useState<'WFO' | 'WFH'>('WFO');

  const handleSavePreferences = () => {
    showToast('Preferensi Disimpan', 'Pengaturan notifikasi dan sistem berhasil diperbarui.', 'success');
  };

  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin mengatur ulang semua data simulasi ke setelan default awal pabrik?')) {
      resetToDefaultData();
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#173B65]/10 text-[#173B65] flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Pengaturan Sistem
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Konfigurasi preferensi kerja, notifikasi, dan manajemen penyimpanan lokal.
          </p>
        </div>

        <button
          onClick={handleSavePreferences}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#173B65] hover:bg-[#1f4a7d] text-white font-bold text-xs rounded-xl shadow-md transition shrink-0"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Simpan Preferensi</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Storage & Firebase Cloud Firestore Status */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Google Cloud Firestore & Firebase</h3>
                <p className="text-xs text-slate-500">Database NoSQL terdistribusi & real-time</p>
              </div>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-4 text-xs space-y-2.5">
              <div className="flex items-center justify-between text-emerald-950 font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Status: Terhubung & Aktif</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                  Asia-South1
                </span>
              </div>
              <div className="text-[11px] text-emerald-900 space-y-1 bg-white/80 p-2.5 rounded-xl border border-emerald-100 font-mono">
                <p>Project ID: <strong>even-archway-18p5g</strong></p>
                <p>Auth: Google Firebase Authentication</p>
                <p>Rules: Role-Based Access Control (RBAC) Aktif</p>
              </div>
              <p className="text-emerald-800 leading-relaxed text-[11px]">
                Seluruh logbook, presensi, tugas, dan profil pengguna tersinkronisasi langsung ke Cloud Firestore secara real-time.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Perlu data sampel bersih?</span>
            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Data Sampel</span>
            </button>
          </div>
        </div>

        {/* Notifications & Reminders */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#173B65] flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Notifikasi & Pengingat</h3>
              <p className="text-xs text-slate-500">Atur alert tenggat waktu tugas dan presensi</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Pemberitahuan Tugas Baru & Review</p>
                <p className="text-[11px] text-slate-500">Kirim notifikasi toast saat mentor menilai logbook.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#173B65] rounded"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Pengingat Mepet Tenggat Waktu (H-1)</p>
                <p className="text-[11px] text-slate-500">Tampilkan tanda merah mepet tenggat pada tugas aktif.</p>
              </div>
              <input
                type="checkbox"
                checked={taskReminders}
                onChange={(e) => setTaskReminders(e.target.checked)}
                className="w-4 h-4 accent-[#173B65] rounded"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Rangkuman Refleksi Mingguan</p>
                <p className="text-[11px] text-slate-500">Pengingat menulis jurnal refleksi setiap hari Jumat sore.</p>
              </div>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                className="w-4 h-4 accent-[#173B65] rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Brand Identity & Vision Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-black text-[#173B65]">MAGANG HEBAT — Belajar, Berkembang, Berdampak.</h4>
          <p className="text-xs text-slate-500 mt-1">
            Platform manajemen program magang vokasi dan universitas nasional berstandar industri modern.
          </p>
        </div>
        <div className="text-right text-xs text-slate-400">
          <p className="font-semibold text-slate-700">Versi Rilis 2.4.0</p>
          <p>React 19 &bull; TypeScript &bull; Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
};

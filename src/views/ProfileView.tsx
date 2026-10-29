import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserCircle2,
  Building,
  GraduationCap,
  Calendar,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Edit2,
  Save,
  X,
  Sparkles,
  Shield,
  Briefcase,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, saveUserProfile } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    institution: currentUser.institution,
    major: currentUser.major,
    nimOrNis: currentUser.nimOrNis,
    phone: currentUser.phone,
    address: currentUser.address,
    bio: currentUser.bio,
    skillsInput: currentUser.skills.join(', '),
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = formData.skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    saveUserProfile({
      id: currentUser.id,
      name: formData.name,
      email: formData.email,
      institution: formData.institution,
      major: formData.major,
      nimOrNis: formData.nimOrNis,
      phone: formData.phone,
      address: formData.address,
      bio: formData.bio,
      skills: skillsArray,
    });

    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#173B65]/10 text-[#173B65] flex items-center justify-center">
              <UserCircle2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Profil Saya
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Informasi identitas resmi peserta, institusi asal, divisi magang, dan mentor pembimbing.
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#173B65] hover:bg-[#1f4a7d] text-white font-bold text-xs rounded-xl shadow-md transition shrink-0"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Data Diri</span>
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition shrink-0"
          >
            <X className="w-4 h-4" />
            <span>Batal</span>
          </button>
        )}
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Summary Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col items-center text-center">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-28 h-28 rounded-full object-cover ring-4 ring-[#173B65]/20 shadow-lg"
            />
            <span
              className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white ${
                currentUser.status === 'Aktif'
                  ? 'bg-emerald-500'
                  : currentUser.status === 'Selesai'
                  ? 'bg-blue-500'
                  : 'bg-amber-500'
              }`}
              title={`Status: ${currentUser.status}`}
            />
          </div>

          <h2 className="text-lg font-black text-slate-900 mt-4">{currentUser.name}</h2>
          <p className="text-xs text-slate-500">{currentUser.email}</p>

          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-[#173B65] border border-blue-200">
              {currentUser.divisionName}
            </span>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Status: {currentUser.status}
            </span>
          </div>

          <div className="w-full mt-6 pt-6 border-t border-slate-100 text-left space-y-3 text-xs">
            <div className="flex items-center gap-2.5 text-slate-600">
              <GraduationCap className="w-4 h-4 text-[#173B65] shrink-0" />
              <div>
                <p className="font-semibold text-slate-800">{currentUser.institution}</p>
                <p className="text-slate-400 text-[11px]">{currentUser.major} &bull; {currentUser.nimOrNis}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-slate-600">
              <Briefcase className="w-4 h-4 text-[#173B65] shrink-0" />
              <div>
                <p className="font-semibold text-slate-800">Mentor Pembimbing</p>
                <p className="text-slate-500 text-[11px]">{currentUser.mentorName || 'Belum Ditentukan'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-slate-600">
              <Calendar className="w-4 h-4 text-[#173B65] shrink-0" />
              <div>
                <p className="font-semibold text-slate-800">Periode Magang</p>
                <p className="text-slate-500 text-[11px]">{currentUser.startDate} s/d {currentUser.endDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Information Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          {!isEditing ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Tentang & Bio
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {currentUser.bio}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Keahlian & Kompetensi
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentUser.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-bold bg-[#173B65]/10 text-[#173B65] px-3 py-1 rounded-xl"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Kontak & Domisili
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Email Resmi</p>
                      <p className="font-bold text-slate-800">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">No. WhatsApp</p>
                      <p className="font-bold text-slate-800">{currentUser.phone}</p>
                    </div>
                  </div>
                  <div className="sm:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Alamat Domisili</p>
                      <p className="font-bold text-slate-800">{currentUser.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                Formulir Pembaruan Data Profil
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Institusi / Kampus / SMK
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Jurusan / Program Studi
                  </label>
                  <input
                    type="text"
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    NIM / NIS
                  </label>
                  <input
                    type="text"
                    value={formData.nimOrNis}
                    onChange={(e) => setFormData({ ...formData, nimOrNis: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Bio Singkat
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Keahlian (pisahkan koma)
                </label>
                <input
                  type="text"
                  value={formData.skillsInput}
                  onChange={(e) => setFormData({ ...formData, skillsInput: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    No. Telepon / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Alamat Domisili
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173B65]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#173B65] hover:bg-[#1f4a7d] text-white font-bold text-xs shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

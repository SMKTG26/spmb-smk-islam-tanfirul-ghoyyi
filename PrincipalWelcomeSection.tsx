import React, { useState, useRef } from 'react';
import { SCHOOL_INFO } from '../data/mockData';
import { TanfirulGhoyyiLogo } from './TanfirulGhoyyiLogo';
import { 
  Award, 
  BookOpen, 
  Quote, 
  Sparkles, 
  Maximize2, 
  Camera, 
  Upload, 
  Edit3, 
  RotateCcw, 
  Save, 
  X, 
  UserCheck, 
  Check, 
  GraduationCap,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export interface PrincipalProfileData {
  name: string;
  title: string;
  institution: string;
  photoUrl: string;
  welcomeHeading: string;
  welcomeQuote: string;
  speechParagraphs: string[];
  signatureNote: string;
}

const STORAGE_KEY = 'tanfirul_ghoyyi_principal_profile_v1';

const DEFAULT_PROFILE: PrincipalProfileData = {
  name: 'Sahal Mahfud, S.Pd., M.Pd.',
  title: 'Kepala SMK Islam Tanfirul Ghoyyi',
  institution: 'Yayasan Pondok Pesantren Tanfirul Ghoyyi Lamongan',
  photoUrl: '/foto_kepala_sekolah.jpg',
  welcomeHeading: 'Sambutan & Arahan Kepala Sekolah SPMB 2027-2028',
  welcomeQuote: 'Mencetak Generasi Qur’ani yang Berakhlakul Karimah, Unggul dalam Penguasaan Kitab Kuning, dan Terdepan dalam Keahlian Digital Komunikasi Visual.',
  speechParagraphs: [
    'Assalamu’alaikum Warahmatullahi Wabarakatuh. Puji syukur kita panjatkan ke hadirat Allah SWT atas segala rahmat dan hidayah-Nya. Selamat datang di Portal Resmi Penerimaan Santri & Peserta Didik Baru (SPMB) SMK Islam Tanfirul Ghoyyi Tahun Pelajaran 2027-2028.',
    'SMK Islam Tanfirul Ghoyyi hadir dengan model pendidikan terpadu yang memadukan kedalaman spiritual kepesantrenan (Tahfidz Al-Qur’an & Lalaran Alfiyah Ibnu Malik) dengan keunggulan teknologi terapan jurusan Desain Komunikasi Visual (DKV). Kami mendidik santri agar tidak hanya hafal Al-Qur’an dan fasih berbahasa, namun juga tangguh berdakwah melalui karya digital, sinematografi, desain grafis, dan animasi.',
    'Kami mengajak para orang tua dan calon santri untuk bergabung bersama keluarga besar Tanfirul Ghoyyi. Mari bersama-sama membimbing putra-putri kita menjadi insan mulia yang siap berkontribusi bagi umat, bangsa, dan peradaban dunia. Jazakumullah Khairan Katsiran.'
  ],
  signatureNote: 'Kepala SMK Islam Tanfirul Ghoyyi'
};

interface PrincipalWelcomeSectionProps {
  onRegisterClick?: () => void;
}

export const PrincipalWelcomeSection: React.FC<PrincipalWelcomeSectionProps> = ({ onRegisterClick }) => {
  const [profile, setProfile] = useState<PrincipalProfileData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading principal profile:', e);
    }
    return DEFAULT_PROFILE;
  });

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<PrincipalProfileData>(profile);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3500);
  };

  const saveProfile = (newProfile: PrincipalProfileData) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    } catch (e) {
      console.error('Failed to save principal profile to localStorage:', e);
    }
  };

  // Handle direct file upload for Principal Photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Mohon pilih berkas gambar (JPG, PNG, WebP).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          const updated = { ...profile, photoUrl: result };
          saveProfile(updated);
          setEditFormData(updated);
          showToast('Foto Kepala Sekolah berhasil diunggah & disimpan!');
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleResetToDefault = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan profil dan foto Kepala Sekolah ke setelan bawaan?')) {
      saveProfile(DEFAULT_PROFILE);
      setEditFormData(DEFAULT_PROFILE);
      showToast('Profil dan foto berhasil dikembalikan ke bawaan!');
    }
  };

  const handleSaveEditForm = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(editFormData);
    setIsEditModalOpen(false);
    showToast('Profil & Sambutan Kepala Sekolah berhasil disimpan!');
  };

  return (
    <section id="sambutan-kepsek" className="py-16 sm:py-24 bg-linear-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/40 animate-bounce">
          <Check className="w-5 h-5 text-amber-300" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
      />
      <input
        type="file"
        ref={modalFileInputRef}
        onChange={handlePhotoUpload}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
      />

      {/* Background Subtle Accent Gradients */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Quick Edit Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>PIMPINAN SEKOLAH</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-serif tracking-tight">
              {profile.welcomeHeading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl font-light">
              Menghubungkan nilai-nilai luhur kepesantrenan dengan keunggulan teknologi kreatif abad ke-21.
            </p>
          </div>

          {/* Action Buttons: Upload Photo & Edit Speech */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-emerald-900/50"
              title="Unggah Foto Kepala Sekolah dari Komputer/HP"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah / Ganti Foto</span>
            </button>

            <button
              onClick={() => {
                setEditFormData(profile);
                setIsEditModalOpen(true);
              }}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              title="Edit Teks Sambutan & Nama Kepala Sekolah"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profil & Teks</span>
            </button>

            <button
              onClick={handleResetToDefault}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors border border-slate-700 cursor-pointer"
              title="Kembalikan ke Foto & Teks Semula"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Grid: Large Photo on Left, Speech on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: Large Dignified Principal Photo Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            <div className="w-full max-w-md relative group">
              
              {/* Outer Golden/Emerald Border Frame */}
              <div className="absolute -inset-1.5 bg-linear-to-tr from-amber-500/40 via-emerald-500/40 to-amber-400/40 rounded-3xl blur-sm group-hover:blur-md transition-all duration-500" />

              <div className="relative bg-slate-950 rounded-2xl overflow-hidden border-2 border-emerald-600/50 shadow-2xl">
                
                {/* Large Portrait Image Container (3:4 aspect ratio) */}
                <div className="relative aspect-3/4 sm:h-[480px] w-full bg-slate-900 overflow-hidden">
                  <img
                    src={profile.photoUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-103"
                  />

                  {/* Gradient Shade on Bottom */}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Badges on Image */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-900/90 border border-emerald-500/60 text-emerald-200 text-xs font-bold shadow-lg backdrop-blur-xs flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                      <span>Kepala Sekolah</span>
                    </span>
                  </div>

                  {/* Top Right: Fullscreen Inspect & Upload Trigger */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button
                      onClick={() => setIsPhotoModalOpen(true)}
                      title="Lihat Foto Penuh"
                      className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700 shadow-md backdrop-blur-xs cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Maximize2 className="w-4 h-4 text-emerald-300" />
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      title="Ganti Foto Ini"
                      className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white shadow-md cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bottom Image Overlay Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/90 border border-emerald-600/40 text-amber-300 text-xs font-mono mb-1.5 backdrop-blur-xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{profile.title}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white font-serif tracking-tight drop-shadow-md">
                      {profile.name}
                    </h3>
                  </div>
                </div>

                {/* Card Footer with Quick Upload Bar */}
                <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400 leading-tight">
                    <span className="text-emerald-400 font-semibold block">{SCHOOL_INFO.shortName} Lamongan</span>
                    <span>Tersimpan di sistem browser</span>
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Ganti Foto</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Quick Caption */}
            <div className="mt-3 text-center">
              <span className="text-xs text-slate-400 font-medium">
                {profile.institution}
              </span>
            </div>

          </div>

          {/* RIGHT: Speech & Vision */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Quote Card */}
            <div className="relative p-6 sm:p-7 rounded-3xl bg-linear-to-r from-emerald-950/70 to-slate-900 border border-emerald-800/60 shadow-xl">
              <Quote className="w-10 h-10 text-emerald-500/20 absolute top-4 right-4 rotate-180" />
              
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pesan Utama</span>
              </div>
              
              <blockquote className="text-base sm:text-lg text-slate-100 font-serif italic leading-relaxed">
                "{profile.welcomeQuote}"
              </blockquote>
            </div>

            {/* Speech Body */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-light bg-slate-900/50 p-6 sm:p-7 rounded-3xl border border-slate-800 backdrop-blur-xs">
              {profile.speechParagraphs.map((para, idx) => (
                <p key={idx} className="text-justify">
                  {para}
                </p>
              ))}
            </div>

            {/* Strategic Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mb-2">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">Tahfidz & Lalaran</h4>
                <p className="text-[11px] text-slate-400 leading-snug">Tartil Al-Qur'an dan hafal nadhom Alfiyah Ibnu Malik berijazah.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold mb-2">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">Keahlian DKV</h4>
                <p className="text-[11px] text-slate-400 leading-snug">Desain grafis, animasi, sinematografi, dan editing multimedia standar industri.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mb-2">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">Kemudahan Berkas</h4>
                <p className="text-[11px] text-slate-400 leading-snug">Pendaftaran mudah, cukup 3 berkas: FC KK, NISN & Akta Kelahiran.</p>
              </div>
            </div>

            {/* Signature Block & Call to Action */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="font-serif font-bold text-base text-white">
                  {profile.name}
                </div>
                <div className="text-xs text-amber-400">
                  {profile.signatureNote}
                </div>
              </div>

              {onRegisterClick && (
                <button
                  onClick={onRegisterClick}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 group cursor-pointer"
                >
                  <span>Daftar Sekarang Melalui Jalur Ini</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* FULLSCREEN PHOTO INSPECT & UPLOAD MODAL */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-xl w-full flex flex-col items-center">
            
            {/* Close Button */}
            <button
              onClick={() => setIsPhotoModalOpen(false)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Large Photo */}
            <div className="bg-slate-950 p-2 rounded-2xl border border-emerald-500/50 shadow-2xl overflow-hidden max-h-[80vh]">
              <img
                src={profile.photoUrl}
                alt={profile.name}
                className="max-h-[70vh] w-auto object-contain rounded-xl mx-auto"
              />
            </div>

            {/* Modal Actions */}
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => modalFileInputRef.current?.click()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Ganti Foto Ini</span>
              </button>

              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup Tampilan
              </button>
            </div>

          </div>
        </div>
      )}

      {/* EDIT PROFILE & SPEECH MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Edit Profil & Sambutan Kepala Sekolah</h3>
                  <p className="text-xs text-slate-400">Perubahan akan disimpan otomatis di perangkat Anda.</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEditForm} className="space-y-4">
              
              {/* Photo Input Preview & Direct Upload */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                <img
                  src={editFormData.photoUrl}
                  alt="Preview"
                  className="w-16 h-20 rounded-xl object-cover border border-emerald-500/40 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Ganti Foto Kepala Sekolah
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Pilih Foto dari Komputer/HP</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Mendukung JPG, PNG, WebP
                  </p>
                </div>
              </div>

              {/* Name & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Jabatan / Gelar
                  </label>
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Heading */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Judul Sambutan
                </label>
                <input
                  type="text"
                  value={editFormData.welcomeHeading}
                  onChange={(e) => setEditFormData({ ...editFormData, welcomeHeading: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  required
                />
              </div>

              {/* Main Quote */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Kutipan Pesan Utama (Quote)
                </label>
                <textarea
                  rows={2}
                  value={editFormData.welcomeQuote}
                  onChange={(e) => setEditFormData({ ...editFormData, welcomeQuote: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  required
                />
              </div>

              {/* Paragraphs */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Isi Sambutan: Paragraf 1 (Salam & Pembuka)
                </label>
                <textarea
                  rows={2}
                  value={editFormData.speechParagraphs[0] || ''}
                  onChange={(e) => {
                    const copy = [...editFormData.speechParagraphs];
                    copy[0] = e.target.value;
                    setEditFormData({ ...editFormData, speechParagraphs: copy });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Isi Sambutan: Paragraf 2 (Visi DKV & Pesantren)
                </label>
                <textarea
                  rows={2}
                  value={editFormData.speechParagraphs[1] || ''}
                  onChange={(e) => {
                    const copy = [...editFormData.speechParagraphs];
                    copy[1] = e.target.value;
                    setEditFormData({ ...editFormData, speechParagraphs: copy });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Isi Sambutan: Paragraf 3 (Ajakan & Penutup)
                </label>
                <textarea
                  rows={2}
                  value={editFormData.speechParagraphs[2] || ''}
                  onChange={(e) => {
                    const copy = [...editFormData.speechParagraphs];
                    copy[2] = e.target.value;
                    setEditFormData({ ...editFormData, speechParagraphs: copy });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setEditFormData(DEFAULT_PROFILE);
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 cursor-pointer"
                >
                  Muat Naskah Bawaan
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

    </section>
  );
};

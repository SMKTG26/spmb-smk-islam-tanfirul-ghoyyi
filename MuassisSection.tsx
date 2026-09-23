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
  Check, 
  Heart,
  Landmark,
  ScrollText,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export interface MuassisProfileData {
  name: string;
  arabicName: string;
  role: string;
  institution: string;
  period: string;
  photoUrl: string;
  kalamHikmah: string;
  biographyParagraphs: string[];
  principles: { title: string; desc: string }[];
}

const STORAGE_KEY = 'tanfirul_ghoyyi_muassis_profile_v1';

const DEFAULT_MUASSIS: MuassisProfileData = {
  name: 'K.H. Ahmad Pendiri / Muassis Pesantren',
  arabicName: 'المؤسس فضيلة الشيخ رحمه الله تعالى',
  role: 'Muassis & Pengasuh Perintis Pondok Pesantren Tanfirul Ghoyyi',
  institution: 'Yayasan Pondok Pesantren Tanfirul Ghoyyi, Sukorejo Lamongan',
  period: 'Perintis & Peletak Pondasi Pendidikan Salaf Modern',
  photoUrl: '/foto_muassis_tanfirul_ghoyyi.jpg',
  kalamHikmah: 'Ikhlas dalam menuntut ilmu, teguhkan adab di atas kepintaran, serta sebarkan syiar Al-Qur’an dan kebaikan melalui segala wasilah keahlian yang bermanfaat bagi umat.',
  biographyParagraphs: [
    'Pondok Pesantren Tanfirul Ghoyyi didirikan dengan niat suci lillahi ta’ala untuk menjadi benteng akidah ahlussunnah wal jama’ah an-nahdliyyah, membina akhlakul karimah, serta mencetak kader santri yang berjiwa pejuang dan mandiri.',
    'Seiring perjalanan masa, ikhtiar mulia ini terus berkembang melahirkan lembaga pendidikan formal SMK Islam Tanfirul Ghoyyi dengan kompetensi unggulan Desain Komunikasi Visual (DKV), agar para santri mampu berdakwah dan berkarya menjawab tantangan zaman tanpa meninggalkan tradisi luhur kitab kuning dan tahfidz Al-Qur’an.',
    'Doa dan barokah Muassis senantiasa mengalir menyertai setiap langkah santri baru dalam menempuh pendidikan di bumi Tanfirul Ghoyyi. Ziarah maqbaroh dan tawasul senantiasa menjadi tradisi rutin santri dalam memohon keberkahan ilmu yang nafi’ dan barokah dunia-akhirat.'
  ],
  principles: [
    {
      title: 'Adab Di Atas Ilmu',
      desc: 'Mendahulukan tata krama, tawadhu kepada guru dan orang tua sebagai kunci terbukanya futuh dan keberkahan ilmu.'
    },
    {
      title: 'Al-Qur’an & Turats Salaf',
      desc: 'Menjaga kelestarian tartil Al-Qur’an, hafalan, serta penguasaan kaidah kitab kuning (Nahwu-Shorof & Lalaran Alfiyah).'
    },
    {
      title: 'Dakwah Digital Kreatif',
      desc: 'Mewarnai peradaban modern melalui karya visual, video, dan teknologi informasi yang bernilai kebajikan dan santun.'
    }
  ]
};

interface MuassisSectionProps {
  onRegisterClick?: () => void;
}

export const MuassisSection: React.FC<MuassisSectionProps> = ({ onRegisterClick }) => {
  const [profile, setProfile] = useState<MuassisProfileData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading muassis profile:', e);
    }
    return DEFAULT_MUASSIS;
  });

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<MuassisProfileData>(profile);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3500);
  };

  const saveProfile = (newProfile: MuassisProfileData) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    } catch (e) {
      console.error('Error saving muassis profile to localStorage:', e);
    }
  };

  // Upload handler with base64 conversion & size validation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (JPG, PNG, atau WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file terlalu besar. Maksimal ukuran gambar adalah 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        const updated = { ...profile, photoUrl: base64 };
        saveProfile(updated);
        setEditFormData((prev) => ({ ...prev, photoUrl: base64 }));
        showToast('✓ Foto Muassis / Pendiri berhasil diperbarui dan disimpan!');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleResetToDefault = () => {
    if (window.confirm('Kembalikan foto dan naskah profil Muassis / Pendiri ke setelan bawaan?')) {
      saveProfile(DEFAULT_MUASSIS);
      setEditFormData(DEFAULT_MUASSIS);
      showToast('✓ Profil Muassis telah dikembalikan ke bawaan.');
    }
  };

  const handleSaveEditForm = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(editFormData);
    setIsEditModalOpen(false);
    showToast('✓ Profil dan naskah Muassis berhasil diperbarui!');
  };

  return (
    <section id="muassis" className="py-16 sm:py-24 bg-linear-to-b from-slate-900 via-emerald-950/80 to-slate-900 text-white relative overflow-hidden">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-emerald-400/50 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-300" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-emerald-800/60 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
              <Landmark className="w-3.5 h-3.5" />
              <span>MUASSIS & PERINTIS PESANTREN</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-serif tracking-tight">
              Biografi & Nasihat Pendiri Lembaga
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl font-light">
              Mengenang jasa dan meneladani spirit perjuangan Muassis Pondok Pesantren Tanfirul Ghoyyi dalam mendidik generasi Qur'ani dan berakhlakul karimah.
            </p>
          </div>

          {/* Action Buttons for Customization */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all border border-emerald-600/60 flex items-center gap-2 cursor-pointer shadow-sm"
              title="Unggah foto Muassis / Kiai pendiri dari HP atau komputer"
            >
              <Upload className="w-3.5 h-3.5 text-amber-300" />
              <span>Unggah / Ganti Foto</span>
            </button>

            <button
              onClick={() => {
                setEditFormData(profile);
                setIsEditModalOpen(true);
              }}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
              title="Edit teks nama kiai, kalam hikmah, dan biografi"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Naskah & Profil</span>
            </button>

            <button
              onClick={handleResetToDefault}
              className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors border border-slate-700 cursor-pointer"
              title="Kembalikan ke foto dan teks bawaan"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Portrait Muassis Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-md bg-linear-to-b from-slate-800 to-slate-950 p-4 sm:p-5 rounded-3xl border-2 border-amber-400/40 shadow-2xl relative group">
              
              {/* Golden Islamic Border Accent */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-linear-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-bold text-[11px] uppercase tracking-wider shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Muassis & Pendiri</span>
              </div>

              {/* Photo Container */}
              <div className="relative aspect-3/4 rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-900 shadow-inner mt-2">
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-102"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/foto_kepala_sekolah.jpg';
                  }}
                />

                {/* Gradient Shadow Overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none" />

                {/* Quick Action Overlay Buttons */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setIsPhotoModalOpen(true)}
                    className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md text-white hover:bg-emerald-700 transition-colors border border-white/20 shadow-md cursor-pointer"
                    title="Perbesar Foto"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-xl bg-emerald-800/90 backdrop-blur-md text-amber-300 hover:bg-emerald-700 transition-colors border border-emerald-400/40 shadow-md cursor-pointer"
                    title="Ganti Foto Muassis"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Arabic Calligraphy / Subtitle Overlaid */}
                <div className="absolute bottom-3 left-4 right-4 text-center">
                  <div className="text-amber-300 font-serif text-sm tracking-wide">
                    {profile.arabicName}
                  </div>
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="mt-4 pt-3 border-t border-slate-800 text-center">
                <h3 className="text-lg sm:text-xl font-bold text-white font-serif tracking-tight">
                  {profile.name}
                </h3>
                <p className="text-xs text-amber-400 font-medium mt-0.5">
                  {profile.role}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {profile.institution}
                </p>

                {/* Upload Trigger Button Below Photo */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-emerald-800/90 hover:bg-emerald-700 text-amber-300 border border-emerald-500/50 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload Foto Muassis</span>
                  </button>
                  <button
                    onClick={() => setIsPhotoModalOpen(true)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Perbesar</span>
                  </button>
                </div>

                {/* Decorative Badge */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-emerald-400 font-mono">
                  <Landmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sukorejo, Lamongan · Sanad Ilmu & Barokah Pesantren</span>
                </div>
              </div>

            </div>

            {/* Upload Guidance Note */}
            <div className="mt-3 text-center max-w-sm text-[11px] text-slate-400">
              <span>Foto di atas dapat Anda ganti kapan saja dengan mengklik tombol </span>
              <strong className="text-amber-400 font-medium">Upload Foto</strong>
              <span>. Tersimpan otomatis di perangkat Anda.</span>
            </div>
          </div>

          {/* RIGHT: Kalam Hikmah, Biografi, & Amanah Perjuangan (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Golden Kalam Hikmah Quote Box */}
            <div className="p-6 sm:p-7 rounded-3xl bg-linear-to-r from-amber-500/10 via-emerald-950/40 to-slate-900 border border-amber-400/30 relative shadow-xl">
              <Quote className="w-10 h-10 text-amber-400/30 absolute top-4 right-4 rotate-180" />
              
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                <ScrollText className="w-4 h-4" />
                <span>Kalam Hikmah & Pesan Muassis</span>
              </div>

              <blockquote className="text-sm sm:text-base text-slate-100 font-serif italic leading-relaxed">
                "{profile.kalamHikmah}"
              </blockquote>

              <div className="mt-4 pt-3 border-t border-amber-400/20 flex items-center justify-between text-xs text-slate-400">
                <span className="font-serif text-amber-300 font-semibold">— Pesan Luhur untuk Santri & Asatidz</span>
                <button
                  onClick={() => {
                    setEditFormData(profile);
                    setIsEditModalOpen(true);
                  }}
                  className="text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1 cursor-pointer text-[11px]"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Kalam Hikmah</span>
                </button>
              </div>
            </div>

            {/* Biography Paragraphs */}
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-950/60 border border-emerald-800/40 backdrop-blur-sm space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Sejarah & Semangat Perintisan Lembaga</span>
                </div>
                <button
                  onClick={() => {
                    setEditFormData(profile);
                    setIsEditModalOpen(true);
                  }}
                  className="text-slate-400 hover:text-amber-300 text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Ubah Biografi</span>
                </button>
              </div>

              {profile.biographyParagraphs.map((par, idx) => (
                <p key={idx} className="text-justify">
                  {par}
                </p>
              ))}
            </div>

            {/* 3 Core Principles left by Muassis */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {profile.principles.map((pr, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/40 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mb-2">
                    {idx + 1}
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">
                    {pr.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {pr.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Call to Action for registration or ziarah info */}
            <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-emerald-900/60 to-slate-900 border border-emerald-600/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    Tradisi Rutin Santri: Ziarah Muassis
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Mendoakan dan menyambung sanad keberkahan pesantren setiap malam Jum'at.
                  </div>
                </div>
              </div>

              {onRegisterClick && (
                <button
                  onClick={onRegisterClick}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap cursor-pointer hover:scale-102"
                >
                  <span>Daftar Santri Baru</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* MODAL 1: VIEW FULL PHOTO & QUICK UPLOAD */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full flex flex-col items-center">
            
            {/* Close Button */}
            <button
              onClick={() => setIsPhotoModalOpen(false)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-amber-400 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Photo frame */}
            <div className="bg-slate-950 p-3 rounded-2xl border-2 border-amber-400/60 shadow-2xl overflow-hidden max-h-[80vh]">
              <img
                src={profile.photoUrl}
                alt={profile.name}
                className="max-h-[70vh] w-auto object-contain rounded-xl mx-auto"
              />
            </div>

            {/* Quick Actions in Modal */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => modalFileInputRef.current?.click()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Camera className="w-4 h-4 text-amber-300" />
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

      {/* MODAL 2: EDIT FULL PROFILE & TEXTS */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-slate-900 border border-amber-400/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">
                    Edit Profil & Biografi Muassis
                  </h3>
                  <p className="text-xs text-slate-400">
                    Perubahan akan disimpan otomatis di penyimpanan browser Anda.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveEditForm} className="space-y-4">
              
              {/* Photo Input Preview & Direct Upload */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                <img
                  src={editFormData.photoUrl}
                  alt="Preview"
                  className="w-16 h-20 rounded-xl object-cover border border-amber-400/40 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Ganti Foto Muassis
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-300" />
                      <span>Pilih Foto dari Galeri/HP</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Mendukung file JPG, PNG, atau WebP (Maks. 5 MB)
                  </p>
                </div>
              </div>

              {/* Name & Arabic title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Lengkap Muassis
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Teks Arab / Kehormatan
                  </label>
                  <input
                    type="text"
                    value={editFormData.arabicName}
                    onChange={(e) => setEditFormData({ ...editFormData, arabicName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none font-serif text-right"
                  />
                </div>
              </div>

              {/* Role & Institution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Gelar / Peran
                  </label>
                  <input
                    type="text"
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Yayasan / Lembaga
                  </label>
                  <input
                    type="text"
                    value={editFormData.institution}
                    onChange={(e) => setEditFormData({ ...editFormData, institution: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Kalam Hikmah */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Kutipan Kalam Hikmah & Nasihat Utama
                </label>
                <textarea
                  rows={3}
                  value={editFormData.kalamHikmah}
                  onChange={(e) => setEditFormData({ ...editFormData, kalamHikmah: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none leading-relaxed"
                  required
                />
              </div>

              {/* Biography Paragraph 1 */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Biografi: Paragraf 1 (Sejarah Awal)
                </label>
                <textarea
                  rows={2}
                  value={editFormData.biographyParagraphs[0] || ''}
                  onChange={(e) => {
                    const copy = [...editFormData.biographyParagraphs];
                    copy[0] = e.target.value;
                    setEditFormData({ ...editFormData, biographyParagraphs: copy });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none leading-relaxed"
                />
              </div>

              {/* Biography Paragraph 2 */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Biografi: Paragraf 2 (Pengembangan SMK DKV & Salaf)
                </label>
                <textarea
                  rows={2}
                  value={editFormData.biographyParagraphs[1] || ''}
                  onChange={(e) => {
                    const copy = [...editFormData.biographyParagraphs];
                    copy[1] = e.target.value;
                    setEditFormData({ ...editFormData, biographyParagraphs: copy });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none leading-relaxed"
                />
              </div>

              {/* Biography Paragraph 3 */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Biografi: Paragraf 3 (Sanad Keberkahan & Ziarah)
                </label>
                <textarea
                  rows={2}
                  value={editFormData.biographyParagraphs[2] || ''}
                  onChange={(e) => {
                    const copy = [...editFormData.biographyParagraphs];
                    copy[2] = e.target.value;
                    setEditFormData({ ...editFormData, biographyParagraphs: copy });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none leading-relaxed"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setEditFormData(DEFAULT_MUASSIS);
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 cursor-pointer"
                >
                  Muat Teks Bawaan
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
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
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

import React, { useState, useEffect, useRef } from 'react';
import { STUDENT_ACHIEVEMENTS, StudentAchievement } from '../data/mockData';
import { 
  Trophy, 
  Award, 
  Medal, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  ExternalLink, 
  BookOpen, 
  GraduationCap,
  Calendar,
  Layers,
  ChevronRight,
  Edit3,
  Camera,
  Plus,
  Trash2,
  RotateCcw,
  Upload,
  Check,
  X,
  Image as ImageIcon
} from 'lucide-react';

const STORAGE_KEY = 'tg_student_achievements_v2';

interface StudentAchievementsSectionProps {
  onRegisterClick?: () => void;
}

export const StudentAchievementsSection: React.FC<StudentAchievementsSectionProps> = ({
  onRegisterClick,
}) => {
  const [achievements, setAchievements] = useState<StudentAchievement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return STUDENT_ACHIEVEMENTS;
  });

  const [selectedFilter, setSelectedFilter] = useState<'Semua' | 'Nasional' | 'Provinsi' | 'Kabupaten'>('Semua');
  const [activeModalItem, setActiveModalItem] = useState<StudentAchievement | null>(null);
  
  // Edit / Add Modal State
  const [editingItem, setEditingItem] = useState<StudentAchievement | null>(null);
  const [isNewItem, setIsNewItem] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<StudentAchievement | null>(null);
  
  // Hidden file inputs for direct photo replacement
  const directFileInputRef = useRef<HTMLInputElement>(null);
  const [directUploadTargetId, setDirectUploadTargetId] = useState<string | null>(null);

  // Modal file input
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const saveAchievementsToStorage = (items: StudentAchievement[]) => {
    setAchievements(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Storage quota exceeded or error saving:', e);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Kembalikan galeri prestasi ke data bawaan awal SMK Islam Tanfirul Ghoyyi?')) {
      localStorage.removeItem(STORAGE_KEY);
      setAchievements(STUDENT_ACHIEVEMENTS);
    }
  };

  // Direct fast photo change on card
  const triggerDirectPhotoChange = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDirectUploadTargetId(id);
    directFileInputRef.current?.click();
  };

  const handleDirectFileChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && directUploadTargetId) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          const updated = achievements.map((item) =>
            item.id === directUploadTargetId ? { ...item, image: result } : item
          );
          saveAchievementsToStorage(updated);
        }
      };
      reader.readAsDataURL(file);
    }
    // reset input
    e.target.value = '';
    setDirectUploadTargetId(null);
  };

  // Open Edit Modal
  const openEditModal = (item: StudentAchievement, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsNewItem(false);
    setEditingItem(item);
    setEditFormData({ ...item });
  };

  // Open Create New Modal
  const openAddNewModal = () => {
    setIsNewItem(true);
    const newItem: StudentAchievement = {
      id: `ach-custom-${Date.now()}`,
      studentName: '',
      grade: 'Siswi / Siswa SMK Islam Tanfirul Ghoyyi',
      major: 'Desain Komunikasi Visual (DKV)',
      title: 'Juara 1 Tingkat Nasional',
      event: 'Nama Kejuaraan / Lomba / Olimpiade',
      level: 'Nasional',
      medal: 'Emas (Juara 1)',
      year: new Date().getFullYear().toString(),
      category: 'Kejuruan DKV',
      description: 'Deskripsi prestasi membanggakan yang diraih santri/siswa SMK Islam Tanfirul Ghoyyi.',
      image: '/prestasi_lks_nasional.jpg',
      organizer: 'Nama Lembaga Penyelenggara',
    };
    setEditingItem(newItem);
    setEditFormData(newItem);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Yakin ingin menghapus dokumentasi prestasi ini?')) {
      const updated = achievements.filter((it) => it.id !== id);
      saveAchievementsToStorage(updated);
      if (activeModalItem?.id === id) {
        setActiveModalItem(null);
      }
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData) return;

    if (isNewItem) {
      const updated = [editFormData, ...achievements];
      saveAchievementsToStorage(updated);
    } else {
      const updated = achievements.map((it) =>
        it.id === editFormData.id ? editFormData : it
      );
      saveAchievementsToStorage(updated);
    }

    setEditingItem(null);
    setEditFormData(null);
  };

  const handleModalPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editFormData) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setEditFormData({ ...editFormData, image: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredAchievements = selectedFilter === 'Semua'
    ? achievements
    : achievements.filter((item) => item.level === selectedFilter);

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Nasional':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      case 'Provinsi':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
      case 'Kabupaten':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <section id="prestasi" className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200">
      
      {/* Hidden file input for fast card photo replacement */}
      <input
        ref={directFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleDirectFileChosen}
        className="hidden"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold tracking-wide">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>GALERI PRESTASI SANTRI & SISWA</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-serif">
            Jejak Juara Olimpiade & Kejuruan Santri
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
            Dokumentasi resmi siswi/santri SMK Islam Tanfirul Ghoyyi meraih juara lomba melukis, olimpiade PAI, short movie DKV, dan kejuaraan kejuruan di tingkat Nasional, Jawa Timur, dan Lamongan.
          </p>
        </div>

        {/* Action Bar: Filter Tabs & Edit/Add Controls */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
          
          {/* Level Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {(['Semua', 'Nasional', 'Provinsi', 'Kabupaten'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedFilter === filter
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {filter === 'Semua' && 'Semua Tingkat'}
                {filter === 'Nasional' && '🇮🇩 Tingkat Nasional'}
                {filter === 'Provinsi' && '🌟 Tingkat Provinsi'}
                {filter === 'Kabupaten' && '🏛️ Tingkat Kabupaten'}
              </button>
            ))}
          </div>

          {/* Admin / Editor Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={openAddNewModal}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Prestasi Siswa</span>
            </button>

            <button
              onClick={handleResetToDefault}
              title="Reset foto & data prestasi ke awal"
              className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Default</span>
            </button>
          </div>

        </div>

        {/* Achievement Grid Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group relative"
            >
              {/* Photo Area */}
              <div 
                className="relative h-72 sm:h-80 overflow-hidden bg-slate-100 cursor-pointer"
                onClick={() => setActiveModalItem(item)}
              >
                <img
                  src={item.image}
                  alt={`${item.studentName} - ${item.title}`}
                  className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-300"
                />
                
                {/* Level Ribbon Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] border shadow-xs ${getLevelBadgeColor(item.level)}`}>
                    Tingkat {item.level}
                  </span>
                </div>

                {/* Medal Year Badge */}
                <div className="absolute top-3 right-3 z-10 bg-slate-900/85 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[11px] font-mono flex items-center gap-1 shadow-xs">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{item.year}</span>
                </div>

                {/* Card Action Overlay Buttons: Ganti Foto & Edit Detail */}
                <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
                  <button
                    onClick={(e) => triggerDirectPhotoChange(item.id, e)}
                    title="Ganti Foto langsung dari Galeri HP/Laptop"
                    className="p-2 bg-emerald-800/90 hover:bg-emerald-900 text-white rounded-lg shadow-md transition-transform hover:scale-105 backdrop-blur-xs flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Ganti Foto</span>
                  </button>

                  <button
                    onClick={(e) => openEditModal(item, e)}
                    title="Edit Nama, Juara, dan Keterangan Prestasi"
                    className="p-2 bg-slate-900/90 hover:bg-slate-950 text-white rounded-lg shadow-md transition-transform hover:scale-105 backdrop-blur-xs flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Edit</span>
                  </button>
                </div>

                {/* Click to enlarge hint */}
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-3 py-1.5 rounded-lg bg-white/95 text-slate-900 text-xs font-bold shadow-md">
                    Lihat Foto Penuh
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Category & Medal Pill */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider font-mono flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>{item.category}</span>
                    </span>
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {item.medal}
                    </span>
                  </div>

                  {/* Title & Event */}
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                    {item.title}
                  </h3>

                  <div className="text-xs font-semibold text-slate-600 mt-1">
                    {item.event}
                  </div>

                  {/* Student details */}
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span className="truncate">{item.studentName || 'Nama Siswa'}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium pl-5">
                      {item.grade} · {item.major}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-2.5 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Organizer & Delete control */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="truncate mr-2">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Penyelenggara:</span>
                    <span className="text-[11px] font-medium text-slate-700 truncate">{item.organizer}</span>
                  </div>

                  <button
                    onClick={(e) => handleDeleteItem(item.id, e)}
                    title="Hapus dokumentasi prestasi ini"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Motivational Callout Banner */}
        <div className="mt-12 bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Beasiswa Santri Berprestasi</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif">
              Punya Prestasi Juara di SMP/MTs? Dapatkan Beasiswa Khusus!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Calon siswa baru yang memiliki piagam/sertifikat kejuaraan olimpiade, lomba melukis, MTQ, film pendek, atau olahraga berhak mendapatkan <strong>prioritas bebas biaya pendaftaran dan seragam gratis</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {onRegisterClick && (
              <button
                onClick={onRegisterClick}
                className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Daftar Jalur Prestasi</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Modal 1: Enlarged Full Photo Preview */}
      {activeModalItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          onClick={() => setActiveModalItem(null)}
        >
          <div 
            className="max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm sm:text-base">
                  Dokumentasi Foto Prestasi ({activeModalItem.level})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    const it = activeModalItem;
                    setActiveModalItem(null);
                    openEditModal(it, e);
                  }}
                  className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Data</span>
                </button>
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 text-xs cursor-pointer"
                >
                  Tutup (✕)
                </button>
              </div>
            </div>

            <div className="max-h-[65vh] overflow-hidden bg-slate-950 flex items-center justify-center p-2">
              <img
                src={activeModalItem.image}
                alt={activeModalItem.title}
                className="w-full h-full object-contain max-h-[60vh] rounded-lg"
              />
            </div>

            <div className="p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2.5 py-1 rounded-md text-xs border ${getLevelBadgeColor(activeModalItem.level)}`}>
                  Tingkat {activeModalItem.level}
                </span>
                <span className="text-xs font-mono text-slate-500 font-bold">
                  Tahun {activeModalItem.year}
                </span>
              </div>

              <h4 className="text-lg font-black text-slate-900">
                {activeModalItem.title}
              </h4>

              <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                Siswa Berprestasi: <strong>{activeModalItem.studentName}</strong> ({activeModalItem.grade}, Jurusan {activeModalItem.major})
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeModalItem.description}
              </p>

              <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 flex items-center justify-between">
                <span>Penyelenggara: <strong>{activeModalItem.organizer}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Edit & Change Photo Modal */}
      {editingItem && editFormData && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setEditingItem(null)}
        >
          <div 
            className="max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm sm:text-base">
                  {isNewItem ? 'Tambah Dokumentasi Prestasi Baru' : 'Edit Foto & Data Prestasi Siswa'}
                </h3>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 text-xs cursor-pointer"
              >
                ✕ Batal
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 sm:p-6 space-y-4">
              
              {/* Photo Upload & Preview section */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shrink-0 relative group">
                  <img
                    src={editFormData.image}
                    alt="Preview foto prestasi"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="text-xs font-bold text-slate-800">
                    Foto Prestasi / Sertifikat / Piala
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Unggah berkas foto asli (misal: RISMA.jpeg, ATIN PAI.jpeg, INDIRA.jpeg) dari HP atau komputer Anda.
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => modalFileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Pilih Foto dari Perangkat</span>
                    </button>

                    <input
                      ref={modalFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleModalPhotoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Siswa / Santri *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.studentName}
                    onChange={(e) => setEditFormData({ ...editFormData, studentName: e.target.value })}
                    placeholder="Contoh: Dwi Rizma Atika Putri"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kelas / Status Siswa
                  </label>
                  <input
                    type="text"
                    value={editFormData.grade}
                    onChange={(e) => setEditFormData({ ...editFormData, grade: e.target.value })}
                    placeholder="Contoh: Siswi SMK Islam Tanfirul Ghoyyi"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Judul Prestasi / Piala Yang Diraih *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    placeholder="Contoh: Juara 1 Lomba Melukis & Mewarnai Tingkat Nasional"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Event / Kejuaraan / Olimpiade
                  </label>
                  <input
                    type="text"
                    value={editFormData.event}
                    onChange={(e) => setEditFormData({ ...editFormData, event: e.target.value })}
                    placeholder="Contoh: Olimpiade PAI Tingkat Nasional / Lomba Mewarnai"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tingkat Kejuaraan
                  </label>
                  <select
                    value={editFormData.level}
                    onChange={(e) => setEditFormData({ ...editFormData, level: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600 font-medium bg-white"
                  >
                    <option value="Nasional">Tingkat Nasional 🇮🇩</option>
                    <option value="Provinsi">Tingkat Provinsi 🌟</option>
                    <option value="Kabupaten">Tingkat Kabupaten 🏛️</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kategori Lomba
                  </label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600 font-medium bg-white"
                  >
                    <option value="Kejuruan DKV">Kejuruan DKV / Multimedia</option>
                    <option value="Tahfidz & Keagamaan">Tahfidz & Keagamaan / PAI</option>
                    <option value="Kreatif & Seni">Kreatif & Seni / Melukis</option>
                    <option value="Olimpiade Sains & IT">Olimpiade Sains & IT</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Peringkat / Medali
                  </label>
                  <input
                    type="text"
                    value={editFormData.medal}
                    onChange={(e) => setEditFormData({ ...editFormData, medal: e.target.value as any })}
                    placeholder="Contoh: Emas (Juara 1) / Juara 2"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tahun
                  </label>
                  <input
                    type="text"
                    value={editFormData.year}
                    onChange={(e) => setEditFormData({ ...editFormData, year: e.target.value })}
                    placeholder="2026"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Penyelenggara
                  </label>
                  <input
                    type="text"
                    value={editFormData.organizer}
                    onChange={(e) => setEditFormData({ ...editFormData, organizer: e.target.value })}
                    placeholder="Contoh: Goldenbrain Indonesia / Kemenag"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Deskripsi / Ucapan Prestasi
                  </label>
                  <textarea
                    rows={3}
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    placeholder="Tuliskan apresiasi, kutipan motivasi, atau rincian pencapaian..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </section>
  );
};

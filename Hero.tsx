import React, { useState, useEffect, useRef } from 'react';
import { SCHOOL_INFO, ADMISSION_WAVES } from '../data/mockData';
import { TanfirulGhoyyiLogo } from './TanfirulGhoyyiLogo';
import { OfficialBarcodeCard } from './OfficialBarcodeCard';
import { 
  ArrowRight, 
  Search, 
  MapPin, 
  Phone, 
  Gift, 
  Palette, 
  Sparkles,
  ExternalLink,
  BookOpen,
  Camera,
  CheckCircle2,
  Building2,
  Upload,
  RotateCcw,
  Film
} from 'lucide-react';

interface HeroProps {
  onRegisterClick: () => void;
  onCheckStatusClick: () => void;
  onExploreMajorsClick: () => void;
  onExploreActivitiesClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onRegisterClick,
  onCheckStatusClick,
  onExploreMajorsClick,
  onExploreActivitiesClick,
}) => {
  const currentWave = ADMISSION_WAVES[0]; // Jalur Indent
  const [buildingImage, setBuildingImage] = useState<string>('/gedung_smk_tg.jpg');
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('tg_building_bg_image');
    if (stored) {
      setBuildingImage(stored);
    }

    const handler = () => {
      const updated = localStorage.getItem('tg_building_bg_image');
      if (updated) setBuildingImage(updated);
      else setBuildingImage('/gedung_smk_tg.jpg');
    };

    window.addEventListener('tg_building_updated', handler);
    return () => window.removeEventListener('tg_building_updated', handler);
  }, []);

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          localStorage.setItem('tg_building_bg_image', result);
          setBuildingImage(result);
          window.dispatchEvent(new Event('tg_building_updated'));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetImage = () => {
    localStorage.removeItem('tg_building_bg_image');
    setBuildingImage('/gedung_smk_tg.jpg');
    window.dispatchEvent(new Event('tg_building_updated'));
  };

  return (
    <div className="relative text-white overflow-hidden">
      
      {/* 1. REAL SCHOOL BUILDING BACKGROUND (GEDUNG LEMBAGA SMK) */}
      <div className="absolute inset-0 z-0">
        <img
          src={buildingImage}
          alt="Gedung Lembaga SMK Islam Tanfirul Ghoyyi Lamongan"
          className="w-full h-full object-cover object-center transform scale-100"
        />
        {/* Dark Gradient Overlay for Maximum Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/85" />
        <div className="absolute inset-0 bg-emerald-950/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-slate-950/30" />
      </div>

      {/* Decorative ambient lights */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-3xl pointer-events-none z-1" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-1" />

      {/* Top Notice Bar: Address & Hotline */}
      <div className="relative z-10 bg-emerald-900/85 border-b border-emerald-700/60 backdrop-blur-xs py-2 px-4 text-xs font-medium text-emerald-100">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Alamat: <strong className="text-white">{SCHOOL_INFO.address}</strong></span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Telp: {SCHOOL_INFO.phone}</span>
            <span>·</span>
            <a 
              href={`https://wa.me/${SCHOOL_INFO.whatsappFormatted}?text=Halo%20Panitia%20SPMB%20SMK%20Islam%20Tanfirul%20Ghoyyi,%20saya%20ingin%20tanya%20informasi%20pendaftaran%20SPMB%202027-2028.`}
              target="_blank"
              rel="noreferrer"
              className="text-amber-300 hover:text-amber-200 font-bold underline flex items-center gap-1"
            >
              <span>WhatsApp: {SCHOOL_INFO.whatsapp}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Headlines & Program Focus */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Institution Badge with Official Emblem & Campus Building Badge */}
            <div className="flex flex-wrap items-center gap-3.5">
              <div className="shrink-0 p-1 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/20">
                <TanfirulGhoyyiLogo size={52} />
              </div>
              <div>
                <div className="text-xs font-bold tracking-wider uppercase text-emerald-400 font-mono flex items-center gap-2">
                  <span>{SCHOOL_INFO.foundation}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-800/80 text-[10px] text-emerald-200 font-sans normal-case border border-emerald-600/40">
                    <Building2 className="w-3 h-3 text-amber-300" />
                    <span>Gedung Kampus Sukorejo</span>
                  </span>
                </div>
                <div className="text-xs text-amber-300 font-serif italic">
                  "{SCHOOL_INFO.motto1}"
                </div>
              </div>
            </div>

            {/* Academic Year Headline */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-800/80 border border-emerald-500/40 text-emerald-200 text-xs font-bold tracking-wide uppercase mb-3 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>SPMB TAHUN PELAJARAN 2027-2028</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight [text-wrap:balance]">
                SMK ISLAM TANFIRUL GHOYYI
              </h1>

              <div className="mt-2 text-lg sm:text-xl font-bold text-emerald-300 font-serif">
                {SCHOOL_INFO.subBrand}
              </div>

              {/* Single Major Pill Highlight */}
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-200 shadow-xs">
                <Palette className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="font-bold text-sm sm:text-base">
                  Jurusan: Desain Komunikasi Visual (DKV)
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Lembaga pendidikan kejuruan yang mengintegrasikan keahlian industri kreatif <strong>Desain Komunikasi Visual (DKV)</strong> dengan tradisi keilmuan pesantren: <strong>Lalaran Alfiyah, Tartil Al-Qur'an, Setoran Hafalan, dan English Class</strong> di lingkungan gedung representatif Sukorejo Lamongan.
            </p>

            {/* Official Bitly Link Callout */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div>
                <div className="text-[11px] text-slate-300 uppercase font-mono">Link Pendaftaran Online Resmi:</div>
                <a
                  href={SCHOOL_INFO.registrationBitly}
                  target="_blank"
                  rel="noreferrer"
                  className="text-base sm:text-lg font-bold font-mono text-emerald-300 hover:text-emerald-200 underline underline-offset-4 flex items-center gap-1.5"
                >
                  <span>{SCHOOL_INFO.registrationBitlyDisplay}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <a
                href={SCHOOL_INFO.registrationBitly}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer"
              >
                <span>Buka Formulir bit.ly</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Current Active Promo Banner (Indent: Gratis Seragam) */}
            <div className="p-4 rounded-xl bg-emerald-900/75 border border-emerald-600/60 backdrop-blur-xs text-xs flex items-center gap-3.5 shadow-md">
              <div className="w-10 h-10 rounded-lg bg-emerald-600/40 text-emerald-300 flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5 text-amber-300" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span>WAKTU PENDAFTARAN JALUR INDENT: 1 Sept - 31 Des 2026</span>
                </div>
                <div className="text-slate-200 mt-0.5">
                  ★ <strong>GRATIS 100% PAKET SERAGAM LENGKAP</strong> (4 Stel Seragam + Jas Almamater).
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onRegisterClick}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Daftar SPMB Online Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onCheckStatusClick}
                className="px-5 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 text-slate-100 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer backdrop-blur-xs"
              >
                <Search className="w-4 h-4 text-emerald-400" />
                <span>Cek Status & Kartu Ujian</span>
              </button>

              <button
                onClick={onExploreActivitiesClick}
                className="px-4 py-3.5 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Kegiatan Santri</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('video-kegiatan');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-3.5 text-emerald-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-emerald-950/40 hover:bg-emerald-900/60 rounded-xl border border-emerald-700/40 transition-colors"
              >
                <Film className="w-4 h-4 text-emerald-400" />
                <span>Video Kegiatan</span>
              </button>
            </div>

            {/* Muassis & Principal Quote & 3 Documents Requirement */}
            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('muassis');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer text-left group"
                  title="Klik untuk melihat foto dan kalam hikmah Muassis Pesantren"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-amber-400/90 shrink-0 shadow-md group-hover:border-emerald-400 transition-colors">
                    <img
                      src="/foto_muassis_tanfirul_ghoyyi.jpg"
                      alt="Muassis Pesantren"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <span className="text-amber-400 font-medium">Muassis: </span>
                    <strong className="text-slate-200 group-hover:text-amber-300 transition-colors underline decoration-amber-400/50 underline-offset-2">
                      PP. Tanfirul Ghoyyi
                    </strong>
                    <span className="text-[10px] text-amber-400 ml-1 font-medium">Nasihat →</span>
                  </div>
                </button>

                <span className="text-slate-700 hidden sm:inline">|</span>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('kepala-sekolah');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer text-left group"
                  title="Klik untuk melihat foto besar dan sambutan Kepala Sekolah"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-500/80 shrink-0 shadow-md group-hover:border-amber-400 transition-colors">
                    <img
                      src="/foto_kepala_sekolah.jpg"
                      alt={SCHOOL_INFO.principal}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400">Kepala Sekolah: </span>
                    <strong className="text-slate-200 group-hover:text-amber-300 transition-colors underline decoration-emerald-500/50 underline-offset-2">
                      {SCHOOL_INFO.principal}
                    </strong>
                    <span className="text-[10px] text-emerald-400 ml-1 font-medium">Sambutan →</span>
                  </div>
                </button>
              </div>

              <div className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Syarat Cukup 3 Berkas: FC KK, NISN & Akta Kelahiran</span>
              </div>
            </div>

          </div>

          {/* Right Column: Scannable Barcode & Real Building Card */}
          <div className="lg:col-span-5 flex flex-col items-center gap-4">
            
            {/* The Real Scannable Barcode matching KODE BARCODE.jpeg */}
            <div className="w-full max-w-sm">
              <OfficialBarcodeCard size={210} />
            </div>

            {/* School Building Photo Preview Card matching GEDUNG LEMBAGA SMK.jpeg */}
            <div className="w-full max-w-sm rounded-2xl bg-slate-900/90 border border-emerald-600/40 p-3.5 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>Gedung Kampus SMK Islam Tanfirul Ghoyyi</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowPhotoModal(true)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
                  >
                    Lihat Penuh
                  </button>
                </div>
              </div>

              {/* Thumbnail of Building */}
              <div 
                onClick={() => setShowPhotoModal(true)}
                className="relative h-32 rounded-xl overflow-hidden cursor-pointer group border border-slate-700"
              >
                <img
                  src={buildingImage}
                  alt="Gedung Lembaga SMK Islam Tanfirul Ghoyyi"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-[10px] text-white font-medium bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/40">
                    Jl. Sunan Giri Gg. Pondok No. 1, Sukorejo, Lamongan
                  </span>
                </div>
              </div>

              {/* Quick file chooser for original photo */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                <span className="italic">Gedung 2 Lantai & Lab Kejuruan</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Ganti foto background dengan berkas asli dari perangkat"
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Unggah Foto</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCustomUpload}
                    className="hidden"
                  />
                  {buildingImage !== '/gedung_smk_tg.jpg' && (
                    <button
                      onClick={handleResetImage}
                      title="Reset ke foto awal"
                      className="text-slate-400 hover:text-rose-400 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick 3 registration steps caption */}
            <div className="w-full max-w-sm p-4 rounded-xl bg-slate-900/85 border border-slate-800 text-xs text-slate-300 shadow-md">
              <div className="font-bold text-white mb-2 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Cara Pendaftaran Praktis:</span>
              </div>
              <ol className="space-y-1.5 text-[11px] text-slate-400 list-decimal list-inside">
                <li>Scan barcode di atas atau ketik <strong className="text-emerald-300 font-mono">bit.ly/SPMB-SMKTG-2027-2028</strong></li>
                <li>Isi formulir online calon siswa Jurusan DKV</li>
                <li>Sertakan 3 berkas: <strong>FC KK, NISN, dan Akta Kelahiran</strong></li>
              </ol>
            </div>

          </div>

        </div>
      </div>

      {/* Modal View Full Photo */}
      {showPhotoModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          onClick={() => setShowPhotoModal(false)}
        >
          <div 
            className="max-w-4xl w-full bg-slate-900 border border-emerald-600/50 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-800 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Gedung Kampus SMK Islam Tanfirul Ghoyyi Lamongan
                </h3>
              </div>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded-md bg-slate-700 cursor-pointer"
              >
                Tutup (✕)
              </button>
            </div>
            <div className="p-2 sm:p-4 bg-slate-950 flex flex-col items-center">
              <img
                src={buildingImage}
                alt="Gedung Lembaga SMK Islam Tanfirul Ghoyyi"
                className="w-full max-h-[70vh] object-contain rounded-xl"
              />
              <div className="mt-3 text-xs text-slate-300 text-center max-w-xl">
                Gedung 2 lantai SMK Islam Tanfirul Ghoyyi di lingkungan Yayasan Pondok Pesantren Tanfirul Ghoyyi, Sukorejo Lamongan. Dilengkapi ruang kelas teori ber-AC, laboratorium Desain Komunikasi Visual (DKV), masjid pesantren, dan asrama santri.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

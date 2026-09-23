import React, { useState } from 'react';
import { SCHOOL_INFO } from '../data/mockData';
import { TanfirulGhoyyiLogo } from './TanfirulGhoyyiLogo';
import { Menu, X, ArrowRight, ExternalLink, QrCode, Trophy, Film, GraduationCap, Lock, Landmark } from 'lucide-react';

interface NavbarProps {
  activeTab: 'beranda' | 'muassis' | 'kepala-sekolah' | 'jurusan' | 'prestasi' | 'kegiatan' | 'video' | 'alur' | 'daftar' | 'status' | 'admin';
  setActiveTab: (tab: 'beranda' | 'muassis' | 'kepala-sekolah' | 'jurusan' | 'prestasi' | 'kegiatan' | 'video' | 'alur' | 'daftar' | 'status' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'beranda' | 'muassis' | 'kepala-sekolah' | 'jurusan' | 'prestasi' | 'kegiatan' | 'video' | 'alur' | 'daftar' | 'status' | 'admin') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 backdrop-blur-md bg-white/95 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          
          {/* Brand with Official Sun Emblem Logo */}
          <button
            onClick={() => handleNavClick('beranda')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="shrink-0 transition-transform group-hover:scale-105">
              <TanfirulGhoyyiLogo size={42} />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm sm:text-base leading-tight font-serif">
                {SCHOOL_INFO.name}
              </div>
              <div className="text-[11px] text-emerald-800 font-semibold tracking-tight">
                Sekolah Berbasis Al-Qur'an & Bahasa · Jurusan DKV
              </div>
            </div>
          </button>

          {/* Primary Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-medium text-slate-600">
            <button
              onClick={() => handleNavClick('beranda')}
              className={`px-2.5 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'beranda'
                  ? 'text-emerald-800 font-semibold bg-emerald-50'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Beranda
            </button>

            <button
              onClick={() => handleNavClick('muassis')}
              className={`px-2.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'muassis'
                  ? 'text-amber-900 font-bold bg-amber-50 border border-amber-200'
                  : 'text-amber-800 hover:text-amber-950 hover:bg-amber-50/70 font-semibold'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-amber-600" />
              <span>Muassis</span>
            </button>

            <button
              onClick={() => handleNavClick('kepala-sekolah')}
              className={`px-2.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'kepala-sekolah'
                  ? 'text-emerald-800 font-semibold bg-emerald-50'
                  : 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50/70 font-semibold'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kepala Sekolah</span>
            </button>

            <button
              onClick={() => handleNavClick('jurusan')}
              className={`px-2.5 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'jurusan'
                  ? 'text-emerald-800 font-semibold bg-emerald-50'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Jurusan DKV
            </button>

            <button
              onClick={() => handleNavClick('prestasi')}
              className={`px-2.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'prestasi'
                  ? 'text-emerald-800 font-semibold bg-emerald-50'
                  : 'text-amber-700 hover:text-amber-800 hover:bg-amber-50/70 font-semibold'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Prestasi Siswa</span>
            </button>

            <button
              onClick={() => handleNavClick('kegiatan')}
              className={`px-2.5 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'kegiatan'
                  ? 'text-emerald-800 font-semibold bg-emerald-50'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Kegiatan
            </button>

            <button
              onClick={() => handleNavClick('video')}
              className={`px-2.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'video'
                  ? 'text-emerald-800 font-semibold bg-emerald-50'
                  : 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50/70 font-semibold'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-emerald-600" />
              <span>Video</span>
            </button>

            <button
              onClick={() => handleNavClick('alur')}
              className={`px-2.5 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'alur'
                  ? 'text-emerald-800 font-semibold bg-emerald-50'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Waktu & Barcode
            </button>

            <button
              onClick={() => handleNavClick('status')}
              className={`px-2.5 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'status'
                  ? 'text-emerald-800 font-semibold bg-emerald-50'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Cek Status & Kartu
            </button>

            <button
              onClick={() => handleNavClick('admin')}
              className={`px-2.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'text-emerald-800 font-bold bg-emerald-50 border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
              }`}
              title="Portal Login Administrator SPMB"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Login Admin</span>
            </button>
          </nav>

          {/* Quick Action: Direct Bitly Link & Register */}
          <div className="hidden sm:flex items-center gap-2">
            <a
              href={SCHOOL_INFO.registrationBitly}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-mono font-semibold rounded-lg border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Link pendaftaran resmi bit.ly/SPMB-SMKTG-2027-2028"
            >
              <span>{SCHOOL_INFO.registrationBitlyDisplay}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => handleNavClick('daftar')}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Daftar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={() => handleNavClick('daftar')}
              className="px-3 py-1.5 bg-emerald-800 text-white text-xs font-bold rounded-lg"
            >
              Daftar
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 text-sm shadow-xl">
          <button
            onClick={() => handleNavClick('beranda')}
            className={`w-full text-left px-3 py-2.5 rounded-lg ${
              activeTab === 'beranda' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'
            }`}
          >
            Beranda
          </button>

          <button
            onClick={() => handleNavClick('muassis')}
            className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between ${
              activeTab === 'muassis' ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-amber-600" />
              <span>Muassis & Pendiri Pesantren</span>
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">Biografi</span>
          </button>

          <button
            onClick={() => handleNavClick('kepala-sekolah')}
            className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between ${
              activeTab === 'kepala-sekolah' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Foto & Sambutan Kepala Sekolah</span>
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Upload Foto</span>
          </button>

          <button
            onClick={() => handleNavClick('jurusan')}
            className={`w-full text-left px-3 py-2.5 rounded-lg ${
              activeTab === 'jurusan' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'
            }`}
          >
            Jurusan: Desain Komunikasi Visual (DKV)
          </button>

          <button
            onClick={() => handleNavClick('prestasi')}
            className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between ${
              activeTab === 'prestasi' ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Prestasi Siswa Unggulan</span>
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">Juara</span>
          </button>

          <button
            onClick={() => handleNavClick('kegiatan')}
            className={`w-full text-left px-3 py-2.5 rounded-lg ${
              activeTab === 'kegiatan' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'
            }`}
          >
            Kegiatan Santri (Lalaran, Tahfidz, English)
          </button>

          <button
            onClick={() => handleNavClick('video')}
            className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between ${
              activeTab === 'video' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Film className="w-4 h-4 text-emerald-600" />
              <span>Video Profil & Kegiatan Santri</span>
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Video</span>
          </button>

          <button
            onClick={() => handleNavClick('alur')}
            className={`w-full text-left px-3 py-2.5 rounded-lg ${
              activeTab === 'alur' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'
            }`}
          >
            Waktu Pendaftaran & Barcode Scan
          </button>

          <button
            onClick={() => handleNavClick('status')}
            className={`w-full text-left px-3 py-2.5 rounded-lg ${
              activeTab === 'status' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'
            }`}
          >
            Cek Status Pendaftaran & Kartu Peserta
          </button>

          <button
            onClick={() => handleNavClick('admin')}
            className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between ${
              activeTab === 'admin' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Login Admin / Panitia SPMB</span>
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">Akses Admin</span>
          </button>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href={SCHOOL_INFO.registrationBitly}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-3 bg-emerald-50 text-emerald-800 font-mono text-center text-xs font-bold rounded-lg border border-emerald-200 flex items-center justify-center gap-2"
            >
              <span>{SCHOOL_INFO.registrationBitlyDisplay}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

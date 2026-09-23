import React from 'react';
import { SCHOOL_INFO } from '../data/mockData';
import { TanfirulGhoyyiLogo } from './TanfirulGhoyyiLogo';
import { ShieldCheck, ExternalLink, MapPin, Phone, MessageSquare, QrCode } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'beranda' | 'muassis' | 'kepala-sekolah' | 'jurusan' | 'kegiatan' | 'alur' | 'daftar' | 'status' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand & Foundation */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3 text-white font-bold text-base">
              <div className="shrink-0">
                <TanfirulGhoyyiLogo size={38} />
              </div>
              <div>
                <div className="font-serif text-lg leading-tight">{SCHOOL_INFO.name}</div>
                <div className="text-[11px] font-sans text-emerald-400 font-semibold">
                  {SCHOOL_INFO.subBrand} · Jurusan DKV
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              {SCHOOL_INFO.foundation}. Menyelenggarakan pendidikan kejuruan unggulan <strong>Desain Komunikasi Visual (DKV)</strong> dengan pembiasaan tahfidz Al-Qur'an, tartil, lalaran Alfiyah Ibnu Malik, serta English Class.
            </p>

            <div className="text-[11px] text-amber-300 font-serif italic">
              "{SCHOOL_INFO.motto1}"
            </div>

            <div className="flex items-center gap-2 text-slate-300 font-medium font-mono text-[11px] pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{SCHOOL_INFO.accreditation} · NPSN: {SCHOOL_INFO.npsn}</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <div className="text-white font-semibold uppercase tracking-wider mb-3">
              Navigasi SPMB
            </div>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigate('beranda')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Beranda SPMB 2027/2028
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('muassis')} 
                  className="hover:text-amber-400 text-amber-300/90 transition-colors cursor-pointer text-left font-medium"
                >
                  Muassis & Pendiri Pesantren
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('kepala-sekolah')} 
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Kepala Sekolah & Sambutan
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('jurusan')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Jurusan Desain Komunikasi Visual (DKV)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('kegiatan')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Kegiatan Santri (Harian, Bulanan, Tahunan)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('alur')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Waktu Pendaftaran & Barcode
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('status')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Cek Status & Cetak Kartu Ujian
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('admin')} 
                  className="hover:text-emerald-400 text-slate-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Login Admin & Panitia SPMB</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Address & Official Hotline */}
          <div className="space-y-2.5">
            <div className="text-white font-semibold uppercase tracking-wider mb-3">
              Sekretariat SPMB
            </div>
            
            <div className="flex items-start gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{SCHOOL_INFO.address}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Telp: {SCHOOL_INFO.phone}</span>
            </div>

            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              <a
                href={`https://wa.me/${SCHOOL_INFO.whatsappFormatted}?text=Halo%20Panitia%20SPMB%20SMK%20Islam%20Tanfirul%20Ghoyyi,%20saya%20ingin%20konsultasi%20pendaftaran%20SPMB%202027-2028.`}
                target="_blank"
                rel="noreferrer"
                className="text-amber-300 font-bold hover:underline"
              >
                WhatsApp: {SCHOOL_INFO.whatsapp}
              </a>
            </div>

            <div className="pt-2">
              <div className="text-[11px] text-slate-400 mb-1">Link Pendaftaran Cepat:</div>
              <a
                href={SCHOOL_INFO.registrationBitly}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 font-mono text-[11px] hover:text-white transition-colors"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{SCHOOL_INFO.registrationBitlyDisplay}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div>
            © 2027-2028 {SCHOOL_INFO.name}. Kepala Sekolah: {SCHOOL_INFO.principal}.
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span>Sekolah Berbasis Al-Qur'an & Bahasa · Jurusan DKV</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

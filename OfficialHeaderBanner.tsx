import React, { useRef } from 'react';
import { TanfirulGhoyyiLogo } from './TanfirulGhoyyiLogo';
import { SCHOOL_INFO } from '../data/mockData';
import { MapPin, Upload, RefreshCw } from 'lucide-react';

export const OfficialHeaderBanner: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          localStorage.setItem('tg_official_logo_image', result);
          window.dispatchEvent(new Event('tg_logo_updated'));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('tg_official_logo_image');
    window.dispatchEvent(new Event('tg_logo_updated'));
  };

  return (
    <div className="bg-white border-b-2 border-emerald-700/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Official Emblem & Typography matching KOP LEMBAGA.jpeg */}
          <div className="flex items-center gap-4 sm:gap-6 text-center md:text-left">
            <div className="relative group shrink-0 drop-shadow-md">
              <TanfirulGhoyyiLogo size={68} />
              
              {/* Optional Quick File Selector for LOGO SMK TG.jpeg */}
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Pilih langsung berkas LOGO SMK TG.jpeg asli dari perangkat Anda"
                className="absolute -bottom-2 -right-2 p-1 bg-emerald-800 text-white rounded-full hover:bg-emerald-900 shadow-md transition-all opacity-80 hover:opacity-100 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight uppercase font-serif">
                  SMK ISLAM TANFIRUL GHOYYI
                </h2>
              </div>

              <div className="mt-1 flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-0.5 rounded-full bg-emerald-800 text-white text-xs font-bold tracking-wide">
                  Sekolah Berbasis Al-Qur'an & Bahasa
                </span>
                <span className="text-xs sm:text-sm font-semibold text-amber-600 italic font-serif">
                  "Sekolah Tahfidz dan Dakwah Lewat Digital"
                </span>
              </div>

              <div className="text-[11px] sm:text-xs text-slate-600 mt-1 font-medium">
                Unggul dalam Prestasi, Berkarakter Qur'ani, Siap Bersinergi di Era Digital
              </div>
            </div>
          </div>

          {/* Right: Quick Official Address & WhatsApp info */}
          <div className="text-xs text-slate-600 flex flex-col items-center md:items-end gap-1 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
            <div className="flex items-center gap-1.5 font-medium text-slate-800 text-center md:text-right">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>{SCHOOL_INFO.address}</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-emerald-800 font-bold">WA: {SCHOOL_INFO.whatsapp}</span>
              <span>·</span>
              <span>Telp: {SCHOOL_INFO.phone}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

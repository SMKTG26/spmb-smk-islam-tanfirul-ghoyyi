import React, { useState } from 'react';
import { ADMISSION_WAVES, REQUIRED_DOCUMENTS, SCHOOL_INFO } from '../data/mockData';
import { OfficialBarcodeCard } from './OfficialBarcodeCard';
import { 
  ArrowRight, 
  Check, 
  Gift, 
  Calendar, 
  FileText, 
  CreditCard, 
  Calculator, 
  HelpCircle,
  ExternalLink,
  QrCode,
  MapPin,
  Phone
} from 'lucide-react';

interface RegistrationFlowAndFeesProps {
  onStartRegistration: () => void;
}

export const RegistrationFlowAndFees: React.FC<RegistrationFlowAndFeesProps> = ({
  onStartRegistration,
}) => {
  const [selectedWave, setSelectedWave] = useState<'indent' | 'gelombang1' | 'gelombang2'>('indent');
  const [isPesantren, setIsPesantren] = useState(true);

  // Fee calculation breakdown for DKV
  const baseFormFee = 0; // Free online registration
  const normalUniformFee = 1600000; // 4 stel + jas almamater
  const uniformFee = selectedWave === 'indent' ? 0 : selectedWave === 'gelombang1' ? normalUniformFee * 0.5 : normalUniformFee;
  const dkvPracticumFee = 750000; // Studio DKV equipment & lab
  const sppMonthly = 250000;
  const boardingFee = isPesantren ? 550000 : 0; // Makan 3x + asrama

  const totalInitial = baseFormFee + uniformFee + dkvPracticumFee + sppMonthly + boardingFee;

  return (
    <section id="alur" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">
            Waktu & Persyaratan SPMB T.P 2027-2028
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight [text-wrap:balance]">
            Waktu Pendaftaran, Cara Daftar & Estimasi Biaya
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Daftarkan putra-putri Anda lebih awal pada Jalur Indent untuk mendapatkan fasilitas <strong>100% GRATIS PAKET SERAGAM</strong> di SMK Islam Tanfirul Ghoyyi.
          </p>
        </div>

        {/* 1. WAKTU PENDAFTARAN (3 Waves) */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">1</span>
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
              Waktu Pendaftaran SPMB 2027-2028
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ADMISSION_WAVES.map((wave) => {
              const isSelected = selectedWave === wave.key;
              return (
                <div
                  key={wave.id}
                  onClick={() => setSelectedWave(wave.key)}
                  className={`rounded-2xl p-6 border-2 transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-700 shadow-md ring-2 ring-emerald-600/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {wave.key === 'indent' && (
                    <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow">
                      ★ Rekomendasi Utama
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-500 uppercase">
                      {wave.name}
                    </span>
                    {isSelected && (
                      <span className="text-xs font-bold text-emerald-800">
                        Dipilih
                      </span>
                    )}
                  </div>

                  <div className="text-xl font-extrabold text-slate-900 mb-1">
                    {wave.promo}
                  </div>

                  <div className="text-xs text-slate-600 font-mono mb-4 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{wave.period}</span>
                  </div>

                  <p className="text-xs text-slate-600 mb-4 pb-4 border-b border-slate-200/80">
                    {wave.discountNote}
                  </p>

                  <ul className="space-y-2 text-xs text-slate-700">
                    {wave.benefits.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. CARA PENDAFTARAN & 3 BERKAS + OFFICIAL BARCODE */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">2</span>
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
              Cara Pendaftaran & 3 Berkas Persyaratan
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: 2 Methods (Scan Barcode & Online Link) and 3 documents */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-base text-slate-900 mb-2">
                  Metode Pendaftaran:
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Calon peserta didik baru dapat mendaftar dengan salah satu dari dua cara berikut:
                </p>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900">
                        Opsi 1: Scan Barcode Resmi
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        Arahkan kamera smartphone ke barcode di samping untuk langsung membuka formulir pendaftaran SPMB.
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900">
                        Opsi 2: Ketik Link Pendaftaran di Browser
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        Ketik alamat tautan:
                      </div>
                      <a
                        href={SCHOOL_INFO.registrationBitly}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-1 font-mono font-bold text-xs sm:text-sm text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 hover:underline"
                      >
                        {SCHOOL_INFO.registrationBitlyDisplay}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Required Documents */}
              <div className="p-6 rounded-2xl bg-white border-2 border-emerald-700/30">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                  Ketentuan Berkas Pendaftaran
                </div>
                <h4 className="font-bold text-base text-slate-900 mb-2">
                  Menyertakan 3 Berkas Persyaratan:
                </h4>
                <p className="text-xs text-slate-600 mb-4">
                  Dokumen ini wajib disiapkan saat pendaftaran online maupun verifikasi berkas fisik di sekolah:
                </p>

                <div className="space-y-3">
                  {REQUIRED_DOCUMENTS.map((doc, idx) => (
                    <div key={doc.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900">
                          {doc.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {doc.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right: The Scannable Barcode */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <OfficialBarcodeCard size={230} />
              
              {/* Address card */}
              <div className="mt-4 w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>Lokasi Kampus & Pendaftaran Langsung:</span>
                </div>
                <p className="text-slate-600 pl-5">
                  {SCHOOL_INFO.address}
                </p>
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono pl-5">
                  <span>WhatsApp: {SCHOOL_INFO.whatsapp}</span>
                  <span>Telp: {SCHOOL_INFO.phone}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. SIMULASI BIAYA MASUK JURUSAN DKV */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">3</span>
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
              Kalkulator & Simulasi Biaya Masuk Jurusan DKV
            </h3>
          </div>
          <p className="text-xs text-slate-600 mb-6">
            Pilih gelombang pendaftaran dan model pendidikan untuk melihat rincian pembiayaan secara transparan:
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Interactive controls */}
            <div className="lg:col-span-6 space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Gelombang Pendaftaran Anda:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedWave('indent')}
                    className={`p-2.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                      selectedWave === 'indent' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white border-slate-300 text-slate-700'
                    }`}
                  >
                    Indent (Gratis Seragam)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedWave('gelombang1')}
                    className={`p-2.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                      selectedWave === 'gelombang1' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white border-slate-300 text-slate-700'
                    }`}
                  >
                    Gelombang 1 (Diskon 50%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedWave('gelombang2')}
                    className={`p-2.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                      selectedWave === 'gelombang2' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white border-slate-300 text-slate-700'
                    }`}
                  >
                    Gelombang 2 (Reguler)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Model Pendidikan Siswa:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPesantren(true)}
                    className={`p-3 rounded-lg text-xs font-semibold border text-left cursor-pointer ${
                      isPesantren ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white border-slate-300 text-slate-700'
                    }`}
                  >
                    <div>Program Asrama Pesantren</div>
                    <div className="text-[10px] opacity-80 font-normal">Tinggal di pondok + Makan 3x + Tahfidz & Alfiyah</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPesantren(false)}
                    className={`p-3 rounded-lg text-xs font-semibold border text-left cursor-pointer ${
                      !isPesantren ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white border-slate-300 text-slate-700'
                    }`}
                  >
                    <div>Program Reguler (Non-Asrama)</div>
                    <div className="text-[10px] opacity-80 font-normal">Pulang pergi harian + Vokasi DKV penuh</div>
                  </button>
                </div>
              </div>

            </div>

            {/* Fee summary card */}
            <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>Rincian Biaya Awal Masuk DKV</span>
                <span className="font-mono text-emerald-800">T.P 2027-2028</span>
              </h4>

              <div className="divide-y divide-slate-100 text-xs py-2">
                <div className="py-2 flex items-center justify-between">
                  <span className="text-slate-600">Biaya Pendaftaran Formulir Online</span>
                  <span className="font-mono font-bold text-emerald-700">GRATIS (Rp 0)</span>
                </div>

                <div className="py-2 flex items-center justify-between">
                  <div>
                    <span className="text-slate-900 font-medium">Paket Seragam Lengkap (4 Stel + Jas)</span>
                    {selectedWave === 'indent' && (
                      <span className="block text-[10px] text-emerald-700 font-bold">Promo Indent: Diskon 100% (Hemat Rp 1.600.000)</span>
                    )}
                    {selectedWave === 'gelombang1' && (
                      <span className="block text-[10px] text-blue-700 font-bold">Promo Gelombang 1: Diskon 50% (Hemat Rp 800.000)</span>
                    )}
                  </div>
                  <span className={`font-mono font-bold ${selectedWave === 'indent' ? 'text-emerald-700' : 'text-slate-900'}`}>
                    {selectedWave === 'indent' ? 'GRATIS (Rp 0)' : `Rp ${uniformFee.toLocaleString('id-ID')}`}
                  </span>
                </div>

                <div className="py-2 flex items-center justify-between">
                  <span className="text-slate-600">Praktikum Laboratorium Komputer & Studio DKV</span>
                  <span className="font-mono text-slate-900">Rp {dkvPracticumFee.toLocaleString('id-ID')}</span>
                </div>

                <div className="py-2 flex items-center justify-between">
                  <span className="text-slate-600">SPP Bulan Pertama (Juli 2027)</span>
                  <span className="font-mono text-slate-900">Rp {sppMonthly.toLocaleString('id-ID')}</span>
                </div>

                {isPesantren && (
                  <div className="py-2 flex items-center justify-between">
                    <div>
                      <span className="text-slate-900 font-medium">Biaya Asrama Pesantren + Konsumsi 3x Sehari</span>
                      <span className="block text-[10px] text-slate-500">Bulan Pertama Asrama Santri</span>
                    </div>
                    <span className="font-mono text-slate-900">Rp {boardingFee.toLocaleString('id-ID')}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="pt-3 border-t-2 border-slate-200 flex items-center justify-between font-bold">
                <span className="text-slate-900 text-sm">Total Estimasi Awal:</span>
                <span className="text-base sm:text-lg text-emerald-800 font-mono">
                  Rp {totalInitial.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={onStartRegistration}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors text-center cursor-pointer"
                >
                  Isi Formulir Pendaftaran Sekarang
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

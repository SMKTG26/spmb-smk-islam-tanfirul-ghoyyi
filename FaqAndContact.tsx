import React, { useState } from 'react';
import { SCHOOL_INFO } from '../data/mockData';
import { ChevronDown, MessageSquare, Mail, MapPin, Clock, ExternalLink, QrCode, Phone } from 'lucide-react';

export const FaqAndContact: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apa saja jurusan di SMK Islam Tanfirul Ghoyyi?',
      a: 'SMK Islam Tanfirul Ghoyyi memfokuskan pendidikannya pada 1 (satu) program keahlian tunggal yang unggul: Desain Komunikasi Visual (DKV). Seluruh fasilitas studio fotografi, laboratorium komputer desain, kamera sinematografi, dan praktisi industri dipusatkan untuk mencetak lulusan DKV yang profesional dan berkarakter Qur\'ani.',
    },
    {
      q: 'Bagaimana cara mendaftar dan berapa link resminya?',
      a: 'Pendaftaran dapat dilakukan dengan scan barcode resmi atau mengakses link pendaftaran: bit.ly/SPMB-SMKTG-2027-2028. Pendaftar cukup menyertakan 3 berkas persyaratan: (1) Fotokopi Kartu Keluarga (FC KK), (2) NISN aktif dari SMP/MTs, dan (3) Fotokopi Akta Kelahiran.',
    },
    {
      q: 'Kapan periode pendaftaran dan apa saja promonya?',
      a: 'Pendaftaran dibuka dalam 3 periode: (1) Jalur Indent: 1 September s/d 31 Desember 2026 (GRATIS 100% PAKET SERAGAM lengkap 4 stel + jas almamater); (2) Gelombang 1: 1 Januari s/d 31 Maret 2027 (POTONGAN 50% PAKET SERAGAM); dan (3) Gelombang 2: 1 April s/d 30 Juni 2027 (Reguler sesuai sisa kuota).',
    },
    {
      q: 'Apa keunggulan konsep Sekolah Berbasis Al-Qur\'an & Bahasa?',
      a: 'Santri Jurusan DKV mengikuti kegiatan harian: Lalaran Alfiyah Ibnu Malik (tata bahasa Arab), Tartil Qur\'an (makharijul huruf & tajwid bersanad), Setoran Hafalan Al-Qur\'an (ziyadah & muroja\'ah), serta English Class intensif untuk mengasah kemampuan komunikasi global.',
    },
    {
      q: 'Apa saja agenda kegiatan bulanan dan tahunan santri?',
      a: 'Kegiatan bulanan meliputi: Munaqosah (evaluasi hafalan), Khitobah (pidato 3 bahasa: Arab, Inggris, Indonesia), Istighosah, Ziarah Muassis, Seminar & Workshop industri kreatif, serta Manaqib. Sedangkan kegiatan tahunan meliputi Kunjungan Industri ke media nasional dan Praktek Kerja Lapangan (PKL) selama 3-6 bulan.',
    },
    {
      q: 'Di mana alamat sekolah dan ke mana harus menghubungi panitia?',
      a: `Kampus SMK Islam Tanfirul Ghoyyi beralamat di: ${SCHOOL_INFO.address}. Layanan konsultasi dan pendaftaran dapat menghubungi WhatsApp Panitia: ${SCHOOL_INFO.whatsapp} atau telepon kantor ${SCHOOL_INFO.phone}.`,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* FAQ Accordion */}
          <div className="lg:col-span-7">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">
              Tanya Jawab (FAQ) SPMB 2027-2028
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
              Pertanyaan yang Sering Diajukan
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-emerald-700' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact & Helpdesk Box */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
                Layanan Informasi & Pendaftaran
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Sekretariat Panitia SPMB 2027-2028
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                Silakan datang langsung ke kampus atau berkonsultasi via WhatsApp dengan panitia penerimaan santri baru Jurusan DKV:
              </p>

              {/* Contact list */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 mb-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Alamat Sekolah:</div>
                    <div className="text-slate-600 mt-0.5 font-medium">{SCHOOL_INFO.address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Telepon & WhatsApp Resmi:</div>
                    <div className="text-slate-600 font-mono mt-0.5">
                      Telp: {SCHOOL_INFO.phone}<br />
                      WhatsApp: <strong className="text-emerald-800">{SCHOOL_INFO.whatsapp}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Link Pendaftaran:</div>
                    <a 
                      href={SCHOOL_INFO.registrationBitly}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 font-mono font-bold hover:underline"
                    >
                      {SCHOOL_INFO.registrationBitlyDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Jam Layanan Kantor:</div>
                    <div className="text-slate-600 mt-0.5">Senin - Sabtu: 07.30 - 14.00 WIB</div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <a
                href={`https://wa.me/${SCHOOL_INFO.whatsappFormatted}?text=Halo%20Panitia%20SPMB%20SMK%20Islam%20Tanfirul%20Ghoyyi,%20saya%20ingin%20konsultasi%20pendaftaran%20Jurusan%20DKV%20SPMB%202027-2028.`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Hubungi WhatsApp Panitia ({SCHOOL_INFO.whatsapp})</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

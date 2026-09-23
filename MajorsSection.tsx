import React from 'react';
import { MAJORS_DATA, SCHOOL_INFO } from '../data/mockData';
import { MajorCode } from '../types/spmb';
import { 
  ArrowRight, 
  Check, 
  Sparkles, 
  Palette, 
  Camera, 
  Video, 
  Layers, 
  Tv, 
  MonitorPlay,
  Briefcase,
  Award,
  Globe,
  CheckCircle2
} from 'lucide-react';

interface MajorsSectionProps {
  onSelectMajor: (major: MajorCode) => void;
}

export const MajorsSection: React.FC<MajorsSectionProps> = ({ onSelectMajor }) => {
  const dkvMajor = MAJORS_DATA[0];

  const concentrations = [
    {
      title: 'Desain Grafis & Brand Identity',
      icon: <Palette className="w-5 h-5 text-emerald-600" />,
      desc: 'Penguasaan Adobe Illustrator & Photoshop, pembuatan logo komersial, kemasan produk (packaging), tipografi, dan periklanan visual.',
    },
    {
      title: 'Videografi & Editing Film/Konten',
      icon: <Video className="w-5 h-5 text-emerald-600" />,
      desc: 'Sinematografi kamera profesional, tata cahaya, editing Adobe Premiere & DaVinci Resolve, serta produksi film pendek & konten viral.',
    },
    {
      title: 'Fotografi Studio & Lighting',
      icon: <Camera className="w-5 h-5 text-emerald-600" />,
      desc: 'Teknik fotografi komersial, foto produk UMKM, portraiture model di studio foto, dan digital retouching berstandar industri.',
    },
    {
      title: 'Motion Graphics & 2D Animation',
      icon: <MonitorPlay className="w-5 h-5 text-emerald-600" />,
      desc: 'Animasi digital After Effects, bumper iklan, infografis bergerak, dan efek visual untuk media sosial dan pertelevisian.',
    },
    {
      title: 'Dakwah Lewat Digital & Media Kreatif',
      icon: <Globe className="w-5 h-5 text-emerald-600" />,
      desc: 'Sesuai moto pesantren "Dakwah Lewat Digital": poster dakwah, microblog edukasi Islami, video reels kajian, dan podcast santri.',
    },
    {
      title: 'Kaligrafi Digital & Tipografi Arab-Inggris',
      icon: <Layers className="w-5 h-5 text-emerald-600" />,
      desc: 'Integrasi seni khat Arab dengan vector modern, kaligrafi digital, dan lettering bahasa Inggris untuk industri penerbitan.',
    },
  ];

  return (
    <section id="jurusan" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-md mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Satu-Satunya Program Keahlian SMK Islam Tanfirul Ghoyyi</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight [text-wrap:balance]">
            Jurusan Desain Komunikasi Visual (DKV)
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            SMK Islam Tanfirul Ghoyyi memusatkan seluruh sumber daya, laboratorium komputer multimedia berkecepatan tinggi, dan studio kamera profesional pada <strong>satu program keahlian tunggal yang prospektif: DKV</strong>.
          </p>
        </div>

        {/* Featured Big Spotlight Box */}
        <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-10 mb-12 shadow-xl border border-emerald-800/80 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-800/90 border border-emerald-500/50 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Palette className="w-3.5 h-3.5" />
                <span>Program Keahlian Industri Kreatif 4.0</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Mencetak Profesional Kreatif Berkarakter Santri
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Di SMK Islam Tanfirul Ghoyyi, santri tidak hanya diajarkan mengoperasikan software desain dan kamera berkelas sinema, tetapi juga dibekali integritas moral Al-Qur'an, kedalaman tata bahasa Arab (Alfiyah), serta kemahiran komunikasi bahasa Inggris (English Class).
              </p>

              {/* Core Strengths */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-900/60 border border-emerald-700/50">
                  <div className="font-bold text-amber-300 mb-1.5 flex items-center gap-1.5">
                    <Tv className="w-4 h-4 text-emerald-400" />
                    <span>Fasilitas Studio & Lab:</span>
                  </div>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    <li>• Studio Fotografi & Lighting Profesional</li>
                    <li>• Lab Komputer Desain Grafis High-Spec</li>
                    <li>• Kamera Mirrorless & Audio Recording Set</li>
                    <li>• Drawing Pen Tablet untuk Ilustrasi Digital</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-900/60 border border-emerald-700/50">
                  <div className="font-bold text-amber-300 mb-1.5 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Sertifikasi & Nilai Plus:</span>
                  </div>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    <li>• Sertifikasi Kompetensi BNSP Level II DKV</li>
                    <li>• Binaan Praktisi Industri & Rumah Produksi</li>
                    <li>• Kemampuan Bahasa Inggris (English Class)</li>
                    <li>• Portofolio Digital Siap Kerja / Kuliah</li>
                  </ul>
                </div>
              </div>

              {/* CTA Action */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => onSelectMajor('DKV')}
                  className="px-6 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Daftar Jurusan DKV Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-xs text-emerald-300 flex items-center justify-center gap-1.5 font-mono">
                  <span>T.P 2027-2028 · Kuota Terbatas (72 Siswa)</span>
                </div>
              </div>

            </div>

            {/* Right: Studio Photo */}
            <div className="lg:col-span-5 rounded-2xl overflow-hidden border-2 border-emerald-700/60 shadow-2xl">
              <img
                src={dkvMajor.image}
                alt="Studio DKV SMK Islam Tanfirul Ghoyyi"
                className="w-full aspect-4/3 object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="bg-emerald-900/90 p-3 text-center text-xs text-emerald-200 font-mono">
                Studio Desain & Multimedia SMK Islam Tanfirul Ghoyyi
              </div>
            </div>

          </div>
        </div>

        {/* 6 Concentrations / Bidang Keahlian DKV */}
        <div className="mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
            Spesialisasi Kompetensi
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
            Bidang Keahlian yang Dipelajari di Jurusan DKV
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {concentrations.map((item, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-600 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1.5">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Career Outlooks & Key Subjects Specification */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-700" />
                <span>Peluang Karir & Masa Depan Lulusan DKV:</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {dkvMajor.careerOutlooks.map((career, cIdx) => (
                  <li key={cIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{career}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4 text-emerald-700" />
                <span>Mata Pelajaran Kejuruan DKV:</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {dkvMajor.keySubjects.map((sub, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{sub}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

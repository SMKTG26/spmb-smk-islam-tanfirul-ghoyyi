import React, { useState } from 'react';
import { SCHOOL_ACTIVITIES, SCHOOL_INFO } from '../data/mockData';
import { SchoolActivityItem } from '../types/spmb';
import { 
  BookOpen, 
  BookMarked,
  Mic, 
  HeartHandshake, 
  Languages, 
  Award, 
  Sparkles, 
  Compass, 
  Presentation, 
  Building2, 
  Briefcase,
  CheckCircle2,
  Calendar,
  Clock
} from 'lucide-react';

export const SchoolActivities: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'harian' | 'bulanan' | 'tahunan'>('all');

  const filteredActivities = SCHOOL_ACTIVITIES.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.timeframe === activeFilter;
  });

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookMarked':
        return <BookMarked className="w-5 h-5 text-emerald-700" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-emerald-700" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5 text-emerald-700" />;
      case 'Languages':
        return <Languages className="w-5 h-5 text-blue-600" />;
      case 'Award':
        return <Award className="w-5 h-5 text-amber-600" />;
      case 'Mic':
        return <Mic className="w-5 h-5 text-purple-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-rose-600" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-emerald-700" />;
      case 'Presentation':
        return <Presentation className="w-5 h-5 text-cyan-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-indigo-600" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-emerald-700" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-700" />;
    }
  };

  const getTimeframeLabel = (timeframe: SchoolActivityItem['timeframe']) => {
    switch (timeframe) {
      case 'harian':
        return 'Kegiatan Harian Santri';
      case 'bulanan':
        return 'Kegiatan Bulanan Pesantren';
      case 'tahunan':
        return 'Kegiatan Tahunan Vokasi DKV';
    }
  };

  return (
    <section id="kegiatan" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">
            Pendidikan Karakter Qur'ani & Bahasa
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight [text-wrap:balance]">
            Program Kegiatan Santri: Harian, Bulanan, & Tahunan
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Menyelaraskan keahlian multimedia <strong>Desain Komunikasi Visual (DKV)</strong> dengan pembiasaan adab Islami, 
            penguatan hafalan Al-Qur'an, tata bahasa kitab <em>Alfiyah Ibnu Malik</em>, dan kecakapan <em>English Class</em>.
          </p>
        </div>

        {/* Interactive Timeframe Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-xl mb-10 max-w-fit">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Kegiatan ({SCHOOL_ACTIVITIES.length})
          </button>
          <button
            onClick={() => setActiveFilter('harian')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'harian'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Kegiatan Harian (4)</span>
          </button>
          <button
            onClick={() => setActiveFilter('bulanan')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'bulanan'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>Kegiatan Bulanan (6)</span>
          </button>
          <button
            onClick={() => setActiveFilter('tahunan')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'tahunan'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-700" />
            <span>Kegiatan Tahunan (2)</span>
          </button>
        </div>

        {/* Activities Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between hover:border-emerald-600/60 hover:shadow-md transition-all group"
            >
              <div>
                
                {/* Meta line */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="font-semibold text-emerald-800">
                    {getTimeframeLabel(item.timeframe)}
                  </span>
                  {item.arabicTitle && (
                    <span className="font-serif text-slate-600 font-medium" dir="rtl">
                      {item.arabicTitle}
                    </span>
                  )}
                </div>

                {/* Title and Icon */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    {getActivityIcon(item.iconName)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {item.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {item.shortDesc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 leading-normal">
                {item.details}
              </div>
            </div>
          ))}
        </div>

        {/* Integration Callout */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-emerald-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-emerald-800">
          <div>
            <h4 className="text-lg font-bold text-white mb-1">
              "Sekolah Berbasis Al-Qur'an & Bahasa · Jurusan DKV"
            </h4>
            <p className="text-xs text-emerald-200 leading-relaxed max-w-2xl">
              SMK Islam Tanfirul Ghoyyi membina santri agar mahir mendesain grafis, memproduksi video, dan berkarya kreatif dengan tetap istiqomah melantunkan bait-bait Alfiyah dan ayat suci Al-Qur'an setiap harinya.
            </p>
          </div>
          <div className="text-center sm:text-right shrink-0">
            <div className="text-xs text-emerald-300 font-mono">T.P 2027-2028</div>
            <div className="text-sm font-extrabold text-white">SMK Islam Tanfirul Ghoyyi</div>
          </div>
        </div>

      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { MajorCode, ProgramType, AdmissionTrack, AdmissionWaveType, StudentRegistration } from '../types/spmb';
import { MAJORS_DATA, ADMISSION_WAVES, REQUIRED_DOCUMENTS, SCHOOL_INFO } from '../data/mockData';
import { addStudentRegistration } from '../utils/storage';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Gift, 
  FileText, 
  AlertCircle,
  Palette,
  ExternalLink,
  QrCode
} from 'lucide-react';

interface RegistrationWizardProps {
  initialMajor?: MajorCode;
  onRegistrationSuccess: (student: StudentRegistration) => void;
  onCancel: () => void;
}

export const RegistrationWizard: React.FC<RegistrationWizardProps> = ({
  initialMajor = 'DKV',
  onRegistrationSuccess,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State - Major is ONLY DKV
  const [formData, setFormData] = useState({
    // Step 1: Data Diri
    fullName: '',
    nisn: '',
    nik: '',
    gender: 'L' as 'L' | 'P',
    birthPlace: '',
    birthDate: '',
    studentPhone: '',
    studentEmail: '',
    previousSchool: '',
    address: '',
    district: 'Lamongan',
    regency: 'Lamongan',

    // Step 2: Jurusan & Gelombang (Major is solely DKV)
    majorFirst: 'DKV' as MajorCode,
    programType: 'pesantren' as ProgramType,
    track: 'indent' as AdmissionTrack,
    wave: 'indent' as AdmissionWaveType,

    // Step 3: Orang Tua & Akademik
    fatherName: '',
    motherName: '',
    parentPhone: '',
    parentJob: 'Wiraswasta / Pedagang',
    parentIncome: 'Rp 3.000.000 - Rp 5.000.000',
    averageScore: 85,
    achievements: '',

    // Step 4: 3 Berkas (FC KK, NISN, Akta Kelahiran)
    fcKKName: '',
    nisnDocName: '',
    aktaKelahiranName: '',
    agreementAccepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Quick Autofill for fast demonstration
  const handleQuickAutofill = () => {
    setFormData({
      fullName: 'Ahmad Danial Mahendra',
      nisn: '0098451299',
      nik: '3524021405090008',
      gender: 'L',
      birthPlace: 'Lamongan',
      birthDate: '2009-05-14',
      studentPhone: '085230693727',
      studentEmail: 'danial.mahendra@gmail.com',
      previousSchool: 'MTs Negeri 1 Lamongan',
      address: 'Jalan Sunan Giri, Groyok Sukorejo Lamongan',
      district: 'Lamongan',
      regency: 'Lamongan',

      majorFirst: 'DKV',
      programType: 'pesantren',
      track: 'indent',
      wave: 'indent',

      fatherName: 'H. Sudarsono',
      motherName: 'Hj. Masruroh',
      parentPhone: '085230693727',
      parentJob: 'Wiraswasta / Percetakan',
      parentIncome: 'Rp 3.000.000 - Rp 5.000.000',
      averageScore: 88.5,
      achievements: 'Hafal 2 Juz Al-Qur\'an & Gemar Desain Poster Grafis',

      fcKKName: 'fc_kk_danial.pdf',
      nisnDocName: 'dokumen_nisn_0098451299.pdf',
      aktaKelahiranName: 'akta_danial.pdf',
      agreementAccepted: true,
    });
    setErrors({});
  };

  const validateStep = (step: number): boolean => {
    const err: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) err.fullName = 'Nama lengkap wajib diisi.';
      if (!formData.nisn.trim()) {
        err.nisn = 'NISN wajib diisi.';
      } else if (!/^\d{10}$/.test(formData.nisn.trim())) {
        err.nisn = 'NISN harus tepat 10 digit angka.';
      }
      if (!formData.nik.trim()) {
        err.nik = 'NIK wajib diisi.';
      } else if (!/^\d{16}$/.test(formData.nik.trim())) {
        err.nik = 'NIK harus tepat 16 digit angka.';
      }
      if (!formData.birthPlace.trim()) err.birthPlace = 'Tempat lahir wajib diisi.';
      if (!formData.birthDate) err.birthDate = 'Tanggal lahir wajib diisi.';
      if (!formData.studentPhone.trim()) err.studentPhone = 'No WhatsApp wajib diisi.';
      if (!formData.previousSchool.trim()) err.previousSchool = 'Asal SMP/MTs wajib diisi.';
      if (!formData.address.trim()) err.address = 'Alamat rumah wajib diisi.';
    }

    if (step === 3) {
      if (!formData.fatherName.trim() && !formData.motherName.trim()) {
        err.parentName = 'Nama ayah atau ibu wajib diisi.';
      }
      if (!formData.parentPhone.trim()) {
        err.parentPhone = 'No WhatsApp orang tua/wali wajib diisi.';
      }
    }

    if (step === 4) {
      if (!formData.agreementAccepted) {
        err.agreement = 'Anda wajib mencentang persetujuan keabsahan data.';
      }
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => (prev + 1) as any);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => (prev - 1) as any);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    const newStudent = addStudentRegistration({
      nisn: formData.nisn.trim(),
      nik: formData.nik.trim(),
      fullName: formData.fullName.trim(),
      gender: formData.gender,
      birthPlace: formData.birthPlace.trim(),
      birthDate: formData.birthDate,
      religion: 'Islam',
      studentPhone: formData.studentPhone.trim(),
      studentEmail: formData.studentEmail.trim(),
      address: formData.address.trim(),
      district: formData.district.trim(),
      regency: formData.regency.trim(),
      previousSchool: formData.previousSchool.trim(),

      majorFirst: 'DKV',
      programType: formData.programType,
      track: formData.track,
      wave: formData.wave,

      fatherName: formData.fatherName.trim(),
      motherName: formData.motherName.trim(),
      parentPhone: formData.parentPhone.trim(),
      parentJob: formData.parentJob,
      parentIncome: formData.parentIncome,

      averageScore: Number(formData.averageScore) || 80,
      achievements: formData.achievements.trim(),

      documents: {
        fcKKName: formData.fcKKName || 'fc_kartu_keluarga.pdf',
        nisnDocName: formData.nisnDocName || 'dokumen_nisn.pdf',
        aktaKelahiranName: formData.aktaKelahiranName || 'akta_kelahiran.pdf',
      },
    });

    onRegistrationSuccess(newStudent);
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Formulir Pendaftaran SPMB Online T.P 2027-2028</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Pendaftaran Calon Santri / Siswa Baru
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {SCHOOL_INFO.name} · Jurusan: <strong>Desain Komunikasi Visual (DKV)</strong>
          </p>

          <div className="mt-2 text-xs text-slate-500 flex items-center justify-center gap-2">
            <span>Link Formulir:</span>
            <a 
              href={SCHOOL_INFO.registrationBitly}
              target="_blank"
              rel="noreferrer"
              className="font-mono font-bold text-emerald-700 underline"
            >
              {SCHOOL_INFO.registrationBitlyDisplay}
            </a>
          </div>

          {/* Quick Demo Autofill Button */}
          <div className="mt-3">
            <button
              type="button"
              onClick={handleQuickAutofill}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold underline underline-offset-2 cursor-pointer"
            >
              ⚡ Isi Otomatis dengan Contoh Lengkap (Demo Cepat)
            </button>
          </div>
        </div>

        {/* Step Progress Indicators */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-8">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className={`p-2 rounded-lg font-semibold transition-colors ${
              currentStep === 1 ? 'bg-emerald-700 text-white' : currentStep > 1 ? 'bg-emerald-50 text-emerald-800' : 'text-slate-400'
            }`}>
              <div className="text-[10px] font-mono">LANGKAH 1</div>
              <div>Data Diri</div>
            </div>

            <div className={`p-2 rounded-lg font-semibold transition-colors ${
              currentStep === 2 ? 'bg-emerald-700 text-white' : currentStep > 2 ? 'bg-emerald-50 text-emerald-800' : 'text-slate-400'
            }`}>
              <div className="text-[10px] font-mono">LANGKAH 2</div>
              <div>Jurusan DKV & Waktu</div>
            </div>

            <div className={`p-2 rounded-lg font-semibold transition-colors ${
              currentStep === 3 ? 'bg-emerald-700 text-white' : currentStep > 3 ? 'bg-emerald-50 text-emerald-800' : 'text-slate-400'
            }`}>
              <div className="text-[10px] font-mono">LANGKAH 3</div>
              <div>Data Ortu</div>
            </div>

            <div className={`p-2 rounded-lg font-semibold transition-colors ${
              currentStep === 4 ? 'bg-emerald-700 text-white' : 'text-slate-400'
            }`}>
              <div className="text-[10px] font-mono">LANGKAH 4</div>
              <div>3 Berkas Wajib</div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit}>
            
            {/* STEP 1: DATA DIRI SISWA */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Identitas Calon Siswa</h2>
                  <p className="text-xs text-slate-500">Pastikan NISN dan NIK sesuai dengan Kartu Keluarga dan Rapor SMP/MTs.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Lengkap Siswa *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Sesuai Akta Kelahiran / Ijazah SMP"
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 ${
                      errors.fullName ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                    }`}
                  />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      NISN (10 Digit) *
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={formData.nisn}
                      onChange={(e) => setFormData({ ...formData, nisn: e.target.value.replace(/\D/g, '') })}
                      placeholder="Contoh: 0098123456"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600/20 ${
                        errors.nisn ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                      }`}
                    />
                    {errors.nisn && <p className="text-xs text-red-500 mt-1">{errors.nisn}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      NIK (Nomor KK / KTP) (16 Digit) *
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      value={formData.nik}
                      onChange={(e) => setFormData({ ...formData, nik: e.target.value.replace(/\D/g, '') })}
                      placeholder="Contoh: 3524011203090001"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600/20 ${
                        errors.nik ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                      }`}
                    />
                    {errors.nik && <p className="text-xs text-red-500 mt-1">{errors.nik}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Jenis Kelamin *
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'L' | 'P' })}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white"
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Tempat Lahir *
                    </label>
                    <input
                      type="text"
                      value={formData.birthPlace}
                      onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                      placeholder="Kota / Kab."
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm"
                    />
                    {errors.birthPlace && <p className="text-xs text-red-500 mt-1">{errors.birthPlace}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Tanggal Lahir *
                    </label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm"
                    />
                    {errors.birthDate && <p className="text-xs text-red-500 mt-1">{errors.birthDate}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Asal Sekolah (SMP / MTs) *
                    </label>
                    <input
                      type="text"
                      value={formData.previousSchool}
                      onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                      placeholder="Nama SMP / MTs asal"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm"
                    />
                    {errors.previousSchool && <p className="text-xs text-red-500 mt-1">{errors.previousSchool}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      No. WhatsApp Aktif Siswa *
                    </label>
                    <input
                      type="tel"
                      value={formData.studentPhone}
                      onChange={(e) => setFormData({ ...formData, studentPhone: e.target.value })}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-mono"
                    />
                    {errors.studentPhone && <p className="text-xs text-red-500 mt-1">{errors.studentPhone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Alamat Lengkap Tempat Tinggal *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Nama Jalan / RT RW / Dusun / Desa"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm"
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>
              </div>
            )}

            {/* STEP 2: JURUSAN DKV & WAKTU PENDAFTARAN */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-lg font-bold text-slate-900">Program Keahlian DKV & Gelombang Pendaftaran</h2>
                  <p className="text-xs text-slate-500">SMK Islam Tanfirul Ghoyyi menyelenggarakan program keahlian tunggal: DKV.</p>
                </div>

                {/* Locked Single Major: DKV */}
                <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-700 text-emerald-950 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-800 text-white shrink-0 mt-0.5">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm sm:text-base">Jurusan: Desain Komunikasi Visual (DKV)</span>
                      <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">Tunggal & Unggulan</span>
                    </div>
                    <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                      Satu-satunya jurusan resmi di SMK Islam Tanfirul Ghoyyi. Terintegrasi dengan kurikulum Al-Qur'an (Tahfidz/Tartil), Alfiyah Ibnu Malik, dan English Class.
                    </p>
                  </div>
                </div>

                {/* Gelombang / Waktu Pendaftaran */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Pilih Waktu Pendaftaran *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {ADMISSION_WAVES.map((w) => (
                      <div
                        key={w.id}
                        onClick={() => setFormData({ ...formData, wave: w.key, track: w.key as any })}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          formData.wave === w.key
                            ? 'bg-emerald-50 border-emerald-700 shadow-xs ring-2 ring-emerald-600/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-bold text-xs sm:text-sm text-slate-900">{w.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{w.period}</div>
                        <div className="text-xs font-semibold text-emerald-800 mt-2">
                          {w.promo}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Program Model */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Pilihan Model Pendidikan *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setFormData({ ...formData, programType: 'pesantren' })}
                      className={`p-4 rounded-xl border cursor-pointer ${
                        formData.programType === 'pesantren'
                          ? 'bg-emerald-50 border-emerald-700 ring-2 ring-emerald-600/20'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="font-bold text-sm text-slate-900">Program Asrama Santri (Pondok Pesantren)</div>
                      <div className="text-xs text-slate-600 mt-1">
                        Tinggal di pondok pesantren PP. Tanfirul Ghoyyi. Mengikuti Lalaran Alfiyah, Tartil, Setoran Hafalan, dan English Class.
                      </div>
                    </div>

                    <div
                      onClick={() => setFormData({ ...formData, programType: 'reguler' })}
                      className={`p-4 rounded-xl border cursor-pointer ${
                        formData.programType === 'reguler'
                          ? 'bg-emerald-50 border-emerald-700 ring-2 ring-emerald-600/20'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="font-bold text-sm text-slate-900">Program Reguler (Non-Asrama)</div>
                      <div className="text-xs text-slate-600 mt-1">
                        Siswa pulang pergi harian dengan kurikulum DKV penuh dan pembiasaan sholat berjamaah & English Class.
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* STEP 3: DATA ORANG TUA & PRESTASI */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Data Orang Tua / Wali</h2>
                  <p className="text-xs text-slate-500">Informasi kontak orang tua untuk koordinasi panitia SPMB.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Nama Ayah Kandung
                    </label>
                    <input
                      type="text"
                      value={formData.fatherName}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      placeholder="Nama ayah"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Nama Ibu Kandung
                    </label>
                    <input
                      type="text"
                      value={formData.motherName}
                      onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                      placeholder="Nama ibu"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm"
                    />
                  </div>
                </div>
                {errors.parentName && <p className="text-xs text-red-500">{errors.parentName}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      No. WhatsApp Orang Tua / Wali *
                    </label>
                    <input
                      type="tel"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-mono"
                    />
                    {errors.parentPhone && <p className="text-xs text-red-500 mt-1">{errors.parentPhone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Pekerjaan Orang Tua
                    </label>
                    <select
                      value={formData.parentJob}
                      onChange={(e) => setFormData({ ...formData, parentJob: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white"
                    >
                      <option value="Wiraswasta / Pedagang">Wiraswasta / Pedagang</option>
                      <option value="Petani / Peternak">Petani / Peternak</option>
                      <option value="PNS / TNI / Polri / Guru">PNS / TNI / Polri / Guru</option>
                      <option value="Karyawan Swasta">Karyawan Swasta</option>
                      <option value="Buruh Harian">Buruh Harian</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Rata-rata Nilai Rapor SMP/MTs (0 - 100)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.averageScore}
                      onChange={(e) => setFormData({ ...formData, averageScore: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Prestasi / Hafalan Al-Qur'an / Minat DKV
                    </label>
                    <input
                      type="text"
                      value={formData.achievements}
                      onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                      placeholder="Contoh: Hafal 2 Juz, Minat Foto/Video, dll."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: 3 BERKAS (FC KK, NISN, AKTA KELAHIRAN) */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-lg font-bold text-slate-900">Menyertakan 3 Berkas Persyaratan</h2>
                  <p className="text-xs text-slate-500">
                    Sesuai ketentuan SPMB SMK Islam Tanfirul Ghoyyi: FC KK, NISN, dan Akta Kelahiran.
                  </p>
                </div>

                <div className="space-y-3">
                  {REQUIRED_DOCUMENTS.map((doc, dIdx) => (
                    <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {dIdx + 1}
                        </div>
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-slate-900">{doc.name}</div>
                          <div className="text-xs text-slate-500">{doc.desc}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                          type="text"
                          placeholder="Nama berkas / status siap"
                          value={
                            doc.id === 'fcKK'
                              ? formData.fcKKName
                              : doc.id === 'nisn'
                              ? formData.nisnDocName
                              : formData.aktaKelahiranName
                          }
                          onChange={(e) => {
                            if (doc.id === 'fcKK') setFormData({ ...formData, fcKKName: e.target.value });
                            if (doc.id === 'nisn') setFormData({ ...formData, nisnDocName: e.target.value });
                            if (doc.id === 'aktaKelahiran') setFormData({ ...formData, aktaKelahiranName: e.target.value });
                          }}
                          className="w-full sm:w-48 px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                        />
                        <span className="text-[11px] font-semibold text-emerald-700 whitespace-nowrap">
                          ✓ Siap
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary of Wave & Benefits */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                    <Gift className="w-4 h-4 text-emerald-700" />
                    <span>Manfaat Pendaftaran Anda di Jurusan DKV:</span>
                  </div>
                  <p className="text-emerald-800">
                    {formData.wave === 'indent'
                      ? 'Anda mendaftar pada JALUR INDENT: Berhak atas 100% GRATIS PAKET SERAGAM lengkap (4 stel + jas almamater).'
                      : formData.wave === 'gelombang1'
                      ? 'Anda mendaftar pada GELOMBANG 1: Berhak atas POTONGAN 50% PAKET SERAGAM.'
                      : 'Anda mendaftar pada GELOMBANG 2: Pendaftaran reguler DKV berdasarkan sisa kuota.'}
                  </p>
                </div>

                {/* Agreement */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreementAccepted}
                      onChange={(e) => setFormData({ ...formData, agreementAccepted: e.target.checked })}
                      className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-600"
                    />
                    <span>
                      Saya menyatakan bahwa data yang saya masukkan adalah benar, dan saya bersedia melampirkan berkas fisik (FC KK, NISN, Akta Kelahiran) saat verifikasi tatap muka di {SCHOOL_INFO.name}, {SCHOOL_INFO.address}.
                    </span>
                  </label>
                  {errors.agreement && <p className="text-xs text-red-500 mt-1.5">{errors.agreement}</p>}
                </div>

              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Sebelumnya</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2.5 text-slate-500 font-medium text-xs hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <span>Selanjutnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-lg shadow-md transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <Check className="w-4 h-4" />
                  <span>Kirim Formulir & Terbitkan Kartu Ujian</span>
                </button>
              )}
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

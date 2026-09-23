import React, { useState, useEffect } from 'react';
import { StudentRegistration } from '../types/spmb';
import { SCHOOL_INFO, MAJORS_DATA, ADMISSION_WAVES } from '../data/mockData';
import { findStudentByQuery } from '../utils/storage';
import { TanfirulGhoyyiLogo } from './TanfirulGhoyyiLogo';
import { 
  Search, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  AlertCircle,
  Award,
  QrCode,
  Gift,
  ExternalLink
} from 'lucide-react';

interface StatusCheckAndCardProps {
  initialStudent?: StudentRegistration | null;
  onNavigateToRegister: () => void;
}

export const StatusCheckAndCard: React.FC<StatusCheckAndCardProps> = ({
  initialStudent = null,
  onNavigateToRegister,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentRegistration | null>(initialStudent);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (initialStudent) {
      setSelectedStudent(initialStudent);
      setSearchQuery(initialStudent.id);
    }
  }, [initialStudent]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchError(null);
    if (!searchQuery.trim()) {
      setSearchError('Silakan masukkan Nomor Registrasi atau NISN.');
      return;
    }

    const found = findStudentByQuery(searchQuery);
    if (found) {
      setSelectedStudent(found);
      setSearchError(null);
    } else {
      setSelectedStudent(null);
      setSearchError(`Data pendaftaran dengan kata kunci "${searchQuery}" tidak ditemukan. Pastikan nomor registrasi atau NISN sudah sesuai.`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusDisplay = (status: StudentRegistration['status']) => {
    switch (status) {
      case 'menunggu_verifikasi':
        return {
          label: 'Menunggu Verifikasi 3 Berkas (FC KK, NISN, Akta)',
          color: 'text-amber-800 bg-amber-50 border-amber-200',
        };
      case 'terverifikasi':
        return {
          label: 'Berkas Fisik Terverifikasi Lengkap',
          color: 'text-blue-800 bg-blue-50 border-blue-200',
        };
      case 'jadwal_tes':
        return {
          label: 'Jadwal Tes & Wawancara Diterbitkan',
          color: 'text-purple-800 bg-purple-50 border-purple-200',
        };
      case 'lulus':
        return {
          label: 'SELAMAT, DINYATAKAN LULUS / DITERIMA DKV',
          color: 'text-emerald-800 bg-emerald-50 border-emerald-300',
        };
      case 'daftar_ulang':
        return {
          label: 'Daftar Ulang Selesai',
          color: 'text-emerald-900 bg-emerald-100 border-emerald-300',
        };
      case 'tidak_lulus':
        return {
          label: 'Belum Lolos Seleksi',
          color: 'text-rose-800 bg-rose-50 border-rose-200',
        };
    }
  };

  const studentWave = selectedStudent ? ADMISSION_WAVES.find((w) => w.key === selectedStudent.wave) : null;

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Bar Block - no-print */}
        <div className="no-print bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="max-w-xl mx-auto text-center mb-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
              SPMB T.P 2027-2028 · Jurusan DKV
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Cek Status Pendaftaran & Cetak Kartu
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Masukkan Nomor Registrasi (Contoh: <span className="font-mono font-semibold text-slate-700">TG-2027-0001</span>) atau NISN 10 digit.
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nomor Registrasi atau NISN..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 font-medium"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer shrink-0 shadow-sm"
            >
              Cari Data
            </button>
          </form>

          {/* Quick preset tests */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span>Coba contoh data 2027/2028:</span>
            <button
              type="button"
              onClick={() => { setSearchQuery('TG-2027-0001'); setSelectedStudent(findStudentByQuery('TG-2027-0001') || null); }}
              className="text-emerald-700 hover:underline font-mono font-medium"
            >
              TG-2027-0001 (Lulus DKV - Indent)
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => { setSearchQuery('TG-2027-0003'); setSelectedStudent(findStudentByQuery('TG-2027-0003') || null); }}
              className="text-emerald-700 hover:underline font-mono font-medium"
            >
              TG-2027-0003 (Jadwal Tes DKV)
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => { setSearchQuery('TG-2027-0005'); setSelectedStudent(findStudentByQuery('TG-2027-0005') || null); }}
              className="text-emerald-700 hover:underline font-mono font-medium"
            >
              TG-2027-0005 (Menunggu Verifikasi)
            </button>
          </div>

          {searchError && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 max-w-xl mx-auto">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span>{searchError}</span>
                <div className="mt-2">
                  <button
                    onClick={onNavigateToRegister}
                    className="font-bold underline text-red-800 hover:text-red-900"
                  >
                    Belum mendaftar? Klik di sini untuk mengisi formulir pendaftaran DKV.
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results & Official Card */}
        {selectedStudent && (
          <div className="space-y-8">
            
            {/* Live Status Tracker - no-print */}
            <div className="no-print bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Status Pendaftaran Calon Siswa T.P 2027-2028</div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedStudent.fullName}</h2>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    NISN: {selectedStudent.nisn} · Registrasi: {selectedStudent.id} · Jurusan: <strong>DKV</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border ${getStatusDisplay(selectedStudent.status).color}`}>
                    {getStatusDisplay(selectedStudent.status).label}
                  </span>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Kartu Ujian</span>
                  </button>
                </div>
              </div>

              {/* Promo Seragam Notice */}
              {selectedStudent.wave === 'indent' && (
                <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    <strong>Pendaftar Jalur Indent:</strong> Selamat! Anda berhak mendapatkan <strong>GRATIS 100% PAKET SERAGAM</strong> lengkap.
                  </span>
                </div>
              )}
              {selectedStudent.wave === 'gelombang1' && (
                <div className="mb-6 p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>
                    <strong>Pendaftar Gelombang 1:</strong> Berhak mendapatkan <strong>POTONGAN 50% PAKET SERAGAM</strong>.
                  </span>
                </div>
              )}

              {/* Progress Steps */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-6">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>1. Registrasi DKV</span>
                  </div>
                  <div className="text-slate-600 mt-1">{selectedStudent.registeredAt}</div>
                </div>

                <div className={`p-3 rounded-lg border ${
                  selectedStudent.status !== 'menunggu_verifikasi' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {selectedStudent.status !== 'menunggu_verifikasi' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    <span>2. FC KK, NISN, Akta</span>
                  </div>
                  <div className="text-slate-600 mt-1">
                    {selectedStudent.status !== 'menunggu_verifikasi' ? 'Terverifikasi' : 'Dalam Proses'}
                  </div>
                </div>

                <div className={`p-3 rounded-lg border ${
                  ['jadwal_tes', 'lulus', 'daftar_ulang'].includes(selectedStudent.status)
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {['jadwal_tes', 'lulus', 'daftar_ulang'].includes(selectedStudent.status) ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <Calendar className="w-3.5 h-3.5" />
                    )}
                    <span>3. Tes Tartil & DKV</span>
                  </div>
                  <div className="text-slate-600 mt-1">
                    {selectedStudent.testSchedule?.date || 'Menunggu Jadwal'}
                  </div>
                </div>

                <div className={`p-3 rounded-lg border ${
                  ['lulus', 'daftar_ulang'].includes(selectedStudent.status)
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {['lulus', 'daftar_ulang'].includes(selectedStudent.status) ? (
                      <Award className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    <span>4. Kelulusan DKV</span>
                  </div>
                  <div className="text-slate-600 mt-1">
                    {['lulus', 'daftar_ulang'].includes(selectedStudent.status) ? 'LOLOS SELEKSI DKV' : 'Belum Terbit'}
                  </div>
                </div>
              </div>

              {/* Notes from Panitia */}
              {selectedStudent.verificationNotes && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <span className="font-bold text-slate-900 block mb-1">Catatan Panitia SPMB:</span>
                  <p>{selectedStudent.verificationNotes}</p>
                </div>
              )}
            </div>

            {/* OFFICIAL PRINTABLE CARD WITH REAL KOP & BARCODE */}
            <div 
              id="printable-card" 
              className="bg-white rounded-2xl border-2 border-slate-300 shadow-md p-6 sm:p-10 relative overflow-hidden"
            >
              {/* Card Official Letterhead (KOP SURAT) matching KOP LEMBAGA.jpeg */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900 mb-6">
                <div className="shrink-0">
                  <TanfirulGhoyyiLogo size={68} />
                </div>

                <div className="text-center flex-1 px-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                    {SCHOOL_INFO.foundation}
                  </div>
                  <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight uppercase font-serif">
                    {SCHOOL_INFO.name}
                  </h2>
                  <div className="text-xs text-emerald-800 font-bold tracking-wide">
                    SEKOLAH BERBASIS AL-QUR'AN & BAHASA · JURUSAN DESAIN KOMUNIKASI VISUAL (DKV)
                  </div>
                  <div className="text-[11px] text-amber-700 font-semibold italic">
                    "{SCHOOL_INFO.motto1}"
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {SCHOOL_INFO.address} · Telp: {SCHOOL_INFO.phone} · WA: {SCHOOL_INFO.whatsapp}
                  </div>
                </div>

                <div className="w-20 text-center shrink-0 border border-slate-300 rounded p-1">
                  <div className="text-[9px] font-mono font-bold text-slate-700 uppercase">SPMB BIT.LY</div>
                  <QrCode className="w-12 h-12 mx-auto text-slate-900 my-0.5" />
                  <div className="text-[8px] font-mono text-emerald-800">2027/2028</div>
                </div>
              </div>

              {/* Title of Card */}
              <div className="text-center mb-6">
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900 underline decoration-2 underline-offset-4">
                  KARTU TANDA PESERTA SELEKSI SPMB T.P 2027-2028
                </h3>
                <div className="text-xs text-slate-600 font-mono mt-1">
                  NO. REGISTRASI: <span className="font-bold text-slate-900">{selectedStudent.id}</span> · JALUR: <span className="font-bold text-emerald-800 uppercase">{selectedStudent.track}</span>
                </div>
              </div>

              {/* Student Identity and Photo */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start mb-6">
                
                {/* 3x4 Photo Box */}
                <div className="sm:col-span-3 flex flex-col items-center">
                  <div className="w-28 h-36 border-2 border-dashed border-slate-400 bg-slate-100 rounded-md flex flex-col items-center justify-center text-center p-2 text-slate-400">
                    <span className="text-xs font-semibold text-slate-500">PAS FOTO</span>
                    <span className="text-[10px] text-slate-400">3 x 4 cm</span>
                    <span className="text-[9px] text-slate-400 mt-2">Warna</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1.5 text-center font-mono">
                    {selectedStudent.nisn}
                  </div>
                </div>

                {/* Identity table */}
                <div className="sm:col-span-9">
                  <table className="w-full text-xs sm:text-sm text-left border-collapse">
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="py-1.5 font-semibold text-slate-600 w-36">Nama Lengkap</td>
                        <td className="py-1.5 text-slate-900 font-bold uppercase">{selectedStudent.fullName}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1.5 font-semibold text-slate-600">NISN / NIK</td>
                        <td className="py-1.5 font-mono text-slate-800">{selectedStudent.nisn} / {selectedStudent.nik}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1.5 font-semibold text-slate-600">Tempat, Tanggal Lahir</td>
                        <td className="py-1.5 text-slate-800">{selectedStudent.birthPlace}, {selectedStudent.birthDate} ({selectedStudent.gender === 'L' ? 'Laki-laki' : 'Perempuan'})</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1.5 font-semibold text-slate-600">Asal Sekolah</td>
                        <td className="py-1.5 text-slate-800 font-semibold">{selectedStudent.previousSchool}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1.5 font-semibold text-slate-600">Program Keahlian</td>
                        <td className="py-1.5 text-emerald-800 font-black">
                          Desain Komunikasi Visual (DKV) ★
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1.5 font-semibold text-slate-600">Model Pendidikan</td>
                        <td className="py-1.5 text-slate-800 capitalize font-medium">
                          Program {selectedStudent.programType === 'pesantren' ? 'Asrama Santri (Pondok Pesantren)' : 'Reguler (Non-Asrama)'}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1.5 font-semibold text-slate-600">Promo Seragam</td>
                        <td className="py-1.5 text-emerald-800 font-bold">
                          {studentWave?.promo || 'Sesuai Gelombang'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-semibold text-slate-600">No. WhatsApp Siswa</td>
                        <td className="py-1.5 font-mono text-slate-800">{selectedStudent.studentPhone}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Examination Schedule Box */}
              <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 mb-6">
                <div className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>Jadwal Ujian Masuk, Tartil Al-Qur'an & Minat Bakat DKV</span>
                </div>
                
                {selectedStudent.testSchedule ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">Waktu Pelaksanaan:</span>
                      <span className="font-bold text-slate-900">{selectedStudent.testSchedule.date}</span>
                      <span className="text-slate-700 block">{selectedStudent.testSchedule.time}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Ruangan / Tempat:</span>
                      <span className="font-bold text-slate-900">{selectedStudent.testSchedule.room}</span>
                      <span className="text-slate-700 block">{SCHOOL_INFO.address}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Materi Uji Seleksi:</span>
                      <span className="text-slate-800 font-medium">
                        {selectedStudent.testSchedule.subjects.join(', ')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-600">
                    Jadwal wawancara, tes tartil Al-Qur'an, dan minat bakat kejuruan DKV akan diinformasikan panitia melalui WhatsApp ({SCHOOL_INFO.whatsapp}).
                  </p>
                )}
              </div>

              {/* 3 Required Documents Notice */}
              <div className="text-[11px] text-slate-700 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  Wajib Menyertakan 3 Berkas Persyaratan saat Ujian / Verifikasi Fisik:
                </span>
                <p>1. Fotokopi Kartu Keluarga (FC KK)</p>
                <p>2. Bukti NISN (10 Digit aktif)</p>
                <p>3. Fotokopi Akta Kelahiran calon peserta didik baru</p>
              </div>

              {/* Signatures with Principal Sahal Mahfud, S.Pd., M.Pd. */}
              <div className="grid grid-cols-2 gap-4 text-xs text-center pt-2 border-t border-slate-200">
                <div>
                  <div className="text-slate-500">Calon Peserta Didik Baru,</div>
                  <div className="h-16" />
                  <div className="font-bold text-slate-900 underline uppercase">
                    {selectedStudent.fullName}
                  </div>
                  <div className="text-slate-500 text-[10px]">Tanda Tangan & Nama Terang</div>
                </div>

                <div>
                  <div className="text-slate-500">Lamongan, Panitia SPMB 2027/2028,</div>
                  <div className="h-16 flex items-center justify-center">
                    <span className="text-[10px] text-emerald-800 font-bold border border-emerald-700/40 rounded px-2 py-0.5 bg-emerald-50">
                      [ STEMPEL RESMI SPMB ]
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 underline uppercase">
                    {SCHOOL_INFO.principal}
                  </div>
                  <div className="text-slate-500 text-[10px]">Kepala SMK Islam Tanfirul Ghoyyi</div>
                </div>
              </div>

            </div>

            {/* Print Action Bar - no-print */}
            <div className="no-print flex items-center justify-center gap-4">
              <button
                onClick={handlePrint}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-lg shadow transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Unduh Kartu PDF</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

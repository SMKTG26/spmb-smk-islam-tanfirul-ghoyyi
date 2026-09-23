import React, { useState, useEffect } from 'react';
import { StudentRegistration, RegistrationStatus } from '../types/spmb';
import { 
  getStoredStudents, 
  updateStudentStatus, 
  resetStudentsToDefault 
} from '../utils/storage';
import { 
  AdminSession, 
  getStoredAdminSession, 
  setStoredAdminSession, 
  authenticateAdmin, 
  changeAdminPassword, 
  resetCredentialsToDefault 
} from '../utils/adminAuth';
import { SCHOOL_INFO } from '../data/mockData';
import { TanfirulGhoyyiLogo } from './TanfirulGhoyyiLogo';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  RefreshCw,
  Eye,
  EyeOff,
  X,
  Lock,
  User,
  KeyRound,
  LogOut,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronRight,
  School,
  FileCheck
} from 'lucide-react';

interface AdminPanelProps {
  onViewStudentCard: (student: StudentRegistration) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onViewStudentCard }) => {
  // Authentication & Session State
  const [session, setSession] = useState<AdminSession | null>(() => getStoredAdminSession());
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Change Password Modal State
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);

  // SPMB Data & Filtering States
  const [students, setStudents] = useState<StudentRegistration[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterWave, setFilterWave] = useState<string>('all');

  const [activeModalStudent, setActiveModalStudent] = useState<StudentRegistration | null>(null);
  const [modalTab, setModalTab] = useState<'detail' | 'verify' | 'schedule'>('detail');

  // Verification & Scheduling states
  const [verificationNotes, setVerificationNotes] = useState('');
  const [testDate, setTestDate] = useState('2026-11-20');
  const [testTime, setTestTime] = useState('08.00 - 11.30 WIB');
  const [testRoom, setTestRoom] = useState('Studio DKV & Lab Qur\'an SMK Tango');
  const [testExaminer, setTestExaminer] = useState('Sahal Mahfud, S.Pd., M.Pd. & Ustadz Penguji');

  const reloadData = () => {
    const list = getStoredStudents();
    setStudents(list);
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const res = authenticateAdmin(usernameInput, passwordInput);
    if (res.success && res.session) {
      setSession(res.session);
      setAuthError(null);
    } else {
      setAuthError(res.error || 'Autentikasi gagal. Silakan coba kembali.');
    }
  };

  // Quick Preset Account Click
  const handleQuickLogin = (user: string, pass: string) => {
    setUsernameInput(user);
    setPasswordInput(pass);
    setAuthError(null);
    const res = authenticateAdmin(user, pass);
    if (res.success && res.session) {
      setSession(res.session);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    if (window.confirm('Keluar dari sesi administrator SPMB?')) {
      setStoredAdminSession(null);
      setSession(null);
      setUsernameInput('');
      setPasswordInput('');
      setAuthError(null);
    }
  };

  // Handle Change Password Submit
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);
    setPwdSuccess(null);

    if (newPasswordInput !== confirmPasswordInput) {
      setPwdError('Konfirmasi kata sandi baru tidak sama.');
      return;
    }

    if (!session) return;

    const res = changeAdminPassword(session.username, oldPasswordInput, newPasswordInput);
    if (res.success) {
      setPwdSuccess('Kata sandi berhasil diperbarui! Silakan ingat kata sandi baru Anda.');
      setOldPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      setTimeout(() => {
        setIsChangePasswordOpen(false);
        setPwdSuccess(null);
      }, 2000);
    } else {
      setPwdError(res.error || 'Gagal mengubah kata sandi.');
    }
  };

  const handleStatusChange = (id: string, newStatus: RegistrationStatus, notes?: string) => {
    const updated = updateStudentStatus(id, newStatus, notes);
    setStudents(updated);
    if (activeModalStudent && activeModalStudent.id === id) {
      setActiveModalStudent(updated.find((s) => s.id === id) || null);
    }
  };

  const handleSaveSchedule = (id: string) => {
    const schedule = {
      date: testDate,
      time: testTime,
      room: testRoom,
      examiner: testExaminer,
      subjects: ['Tartil Al-Qur\'an', 'English Speaking Basics', 'Wawancara & Minat Bakat DKV'],
    };
    const notes = `Jadwal tes telah ditetapkan pada ${testDate} pukul ${testTime} di ${testRoom}.`;
    const updated = updateStudentStatus(id, 'jadwal_tes', notes, schedule);
    setStudents(updated);
    if (activeModalStudent && activeModalStudent.id === id) {
      setActiveModalStudent(updated.find((s) => s.id === id) || null);
    }
    alert('Jadwal tes DKV berhasil disimpan dan diperbarui pada kartu peserta.');
  };

  const handleResetData = () => {
    if (window.confirm('Kembalikan data ke contoh pendaftar bawaan T.P 2027-2028?')) {
      const reset = resetStudentsToDefault();
      setStudents(reset);
    }
  };

  // CSV Export for Excel reporting
  const handleExportCSV = () => {
    const headers = [
      'No Registrasi',
      'NISN',
      'NIK',
      'Nama Siswa',
      'Jenis Kelamin',
      'Tempat Lahir',
      'Tanggal Lahir',
      'Asal Sekolah',
      'Pilihan Jurusan',
      'Model Pendidikan',
      'Gelombang',
      'Fasilitas Promo',
      'Rata-rata Rapor',
      'WA Siswa',
      'Nama Orang Tua',
      'WA Orang Tua',
      'FC Kartu Keluarga',
      'Dokumen NISN',
      'Akta Kelahiran',
      'Status Pendaftaran',
      'Tanggal Daftar',
    ];

    const rows = students.map((s) => [
      `"${s.id}"`,
      `"${s.nisn}"`,
      `"${s.nik}"`,
      `"${s.fullName}"`,
      `"${s.gender}"`,
      `"${s.birthPlace}"`,
      `"${s.birthDate}"`,
      `"${s.previousSchool}"`,
      `"${s.majorFirst}"`,
      `"${s.programType}"`,
      `"${s.wave}"`,
      `"${s.wave === 'indent' ? 'Gratis Paket Seragam' : s.wave === 'gelombang1' ? 'Diskon 50% Seragam' : 'Reguler'}"`,
      `"${s.averageScore}"`,
      `"${s.studentPhone}"`,
      `"${s.fatherName} / ${s.motherName}"`,
      `"${s.parentPhone}"`,
      `"${s.documents.fcKKName ? 'Ada' : 'Belum'}"`,
      `"${s.documents.nisnDocName ? 'Ada' : 'Belum'}"`,
      `"${s.documents.aktaKelahiranName ? 'Ada' : 'Belum'}"`,
      `"${s.status}"`,
      `"${s.registeredAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_spmb_dkv_2027_2028_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchesSearch = 
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.previousSchool.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchesWave = filterWave === 'all' || s.wave === filterWave;

    return matchesSearch && matchesStatus && matchesWave;
  });

  // Metrics
  const totalCount = students.length;
  const indentCount = students.filter((s) => s.wave === 'indent').length;
  const acceptedCount = students.filter((s) => s.status === 'lulus' || s.status === 'daftar_ulang').length;
  const pendingCount = students.filter((s) => s.status === 'menunggu_verifikasi').length;

  // ==========================================
  // VIEW 1: DEDICATED LOGIN SCREEN
  // ==========================================
  if (!session) {
    return (
      <div className="py-12 sm:py-20 bg-linear-to-b from-slate-900 via-slate-850 to-slate-900 min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full relative z-10">
          
          {/* Main Card */}
          <div className="bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
            
            {/* Header Brand */}
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-slate-950 border border-emerald-600/40 shadow-inner mb-3">
                <TanfirulGhoyyiLogo size={56} />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold mb-2">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>PORTAL RESMI PANITIA SPMB</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-tight">
                Login Administrator & Panitia
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {SCHOOL_INFO.name} · T.P 2027-2028
              </p>
            </div>

            {/* Error Alert */}
            {authError && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{authError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Nama Pengguna (Username / Email / NIP)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Contoh: admin atau kepsek"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Kata Sandi (Password)
                  </label>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                    title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 hover:scale-[1.01]"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>Masuk ke Panel Administrator</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Credentials Box */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-center flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Akun Bawaan Panitia (Klik Cepat)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin', 'admin123')}
                  className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-emerald-500/30 text-left transition-colors cursor-pointer group"
                >
                  <div className="font-bold text-emerald-400 group-hover:text-emerald-300">
                    Akun 1: Admin SPMB
                  </div>
                  <div className="text-slate-400 font-mono text-[10px]">
                    User: <strong>admin</strong> | Sandi: <strong>admin123</strong>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('kepsek', 'kepsek2027')}
                  className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-amber-500/30 text-left transition-colors cursor-pointer group"
                >
                  <div className="font-bold text-amber-400 group-hover:text-amber-300">
                    Akun 2: Kepala Sekolah
                  </div>
                  <div className="text-slate-400 font-mono text-[10px]">
                    User: <strong>kepsek</strong> | Sandi: <strong>kepsek2027</strong>
                  </div>
                </button>
              </div>

              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => {
                    resetCredentialsToDefault();
                    alert('Kredensial kata sandi berhasil direset ke bawaan sistem.');
                  }}
                  className="text-[10px] text-slate-500 hover:text-slate-400 hover:underline cursor-pointer"
                >
                  Reset kata sandi ke bawaan awal
                </button>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
              <School className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sistem Manajemen Berkas SPMB · Dilindungi Sesi Terenkripsi</span>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="py-8 sm:py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Active Session Top Bar */}
        <div className="mb-6 p-4 rounded-2xl bg-linear-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-600/40 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-800/80 border border-emerald-500/60 flex items-center justify-center text-amber-300 font-bold shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-serif">{session.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-mono font-semibold">
                  {session.roleLabel}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Masuk sejak {session.loginTime}</span>
                <span>·</span>
                <span className="text-emerald-400 font-mono">@{session.username}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl border border-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Ganti Sandi</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Excel</span>
            </button>

            <button
              onClick={handleResetData}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
              title="Reset data ke contoh bawaan"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Data Demo</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800/60 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>

        </div>

        {/* Dashboard Title & Overview */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Sistem Seleksi Siswa DKV & Verifikasi 3 Berkas</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
              Data Pendaftar SPMB 2027-2028
            </h1>
            <div className="text-xs text-slate-500 mt-1">
              {SCHOOL_INFO.foundation} · {SCHOOL_INFO.address}
            </div>
          </div>
        </div>

        {/* Analytics Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pendaftar DKV</div>
            <div className="text-3xl font-extrabold font-mono text-slate-900 mt-1 tabular-nums">
              {totalCount}
            </div>
            <div className="text-xs text-slate-400 mt-1">Target Kuota: 72 Siswa (2 Rombel)</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Jalur Indent</div>
            <div className="text-3xl font-extrabold font-mono text-emerald-800 mt-1 tabular-nums">
              {indentCount}
            </div>
            <div className="text-xs text-slate-400 mt-1">Gratis 100% Paket Seragam</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Menunggu Berkas</div>
            <div className="text-3xl font-extrabold font-mono text-amber-800 mt-1 tabular-nums">
              {pendingCount}
            </div>
            <div className="text-xs text-slate-400 mt-1">FC KK, NISN, Akta Kelahiran</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider">Lolos Diterima</div>
            <div className="text-3xl font-extrabold font-mono text-teal-800 mt-1 tabular-nums">
              {acceptedCount}
            </div>
            <div className="text-xs text-slate-400 mt-1">Siap Daftar Ulang</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, NISN, atau asal sekolah..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={filterWave}
              onChange={(e) => setFilterWave(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            >
              <option value="all">Semua Waktu Daftar</option>
              <option value="indent">Jalur Indent (Gratis Seragam)</option>
              <option value="gelombang1">Gelombang 1 (Diskon 50%)</option>
              <option value="gelombang2">Gelombang 2</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            >
              <option value="all">Semua Status</option>
              <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
              <option value="terverifikasi">Terverifikasi</option>
              <option value="jadwal_tes">Terjadwal Tes</option>
              <option value="lulus">Lulus / Diterima</option>
              <option value="daftar_ulang">Daftar Ulang</option>
            </select>
          </div>
        </div>

        {/* Table of Applicants */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">No. Reg / NISN</th>
                  <th className="px-4 py-3.5">Nama Calon Siswa</th>
                  <th className="px-4 py-3.5">Asal Sekolah</th>
                  <th className="px-4 py-3.5">Waktu & Model</th>
                  <th className="px-4 py-3.5">3 Berkas (KK/NISN/Akta)</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-bold font-mono text-emerald-800 block">{st.id}</span>
                        <span className="text-[11px] font-mono text-slate-400">{st.nisn}</span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-900 block">{st.fullName}</span>
                        <span className="text-[11px] text-slate-500">
                          {st.gender === 'L' ? 'Laki-laki' : 'Perempuan'} · WA: {st.studentPhone}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-medium text-slate-800">{st.previousSchool}</span>
                        <span className="text-[11px] text-slate-400 block">{st.district}, {st.regency}</span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-bold text-emerald-800 uppercase font-mono">
                          {st.wave === 'indent' ? '★ Indent (Gratis Seragam)' : st.wave === 'gelombang1' ? 'Gelombang 1 (Diskon 50%)' : 'Gelombang 2'}
                        </div>
                        <div className="text-[11px] text-slate-500 capitalize">
                          Program {st.programType === 'pesantren' ? 'Asrama Santri' : 'Reguler'}
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-[11px] font-mono">
                        <span className="text-emerald-700 font-semibold">KK: ✓</span> · <span className="text-emerald-700 font-semibold">NISN: ✓</span> · <span className="text-emerald-700 font-semibold">Akta: ✓</span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {st.status === 'menunggu_verifikasi' && (
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            Menunggu Verifikasi
                          </span>
                        )}
                        {st.status === 'terverifikasi' && (
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                            Berkas Terverifikasi
                          </span>
                        )}
                        {st.status === 'jadwal_tes' && (
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                            Terjadwal Tes
                          </span>
                        )}
                        {st.status === 'lulus' && (
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Lolos Diterima DKV
                          </span>
                        )}
                        {st.status === 'daftar_ulang' && (
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-950 border border-emerald-300">
                            Daftar Ulang Selesai
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setActiveModalStudent(st);
                              setModalTab('detail');
                              setVerificationNotes(st.verificationNotes || '');
                            }}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                            title="Detail & Verifikasi"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onViewStudentCard(st)}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg transition-colors cursor-pointer text-[11px] font-semibold"
                            title="Buka Kartu Ujian"
                          >
                            Kartu Ujian
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                      Tidak ada data pendaftar yang sesuai dengan filter atau kata kunci.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL 1: Applicant Detail & Actions */}
        {activeModalStudent && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Detail Pendaftar SPMB 2027-2028 · {activeModalStudent.id}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-serif">
                    {activeModalStudent.fullName}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModalStudent(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Tabs */}
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                <button
                  onClick={() => setModalTab('detail')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                    modalTab === 'detail' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Data Lengkap & 3 Berkas
                </button>
                <button
                  onClick={() => setModalTab('verify')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                    modalTab === 'verify' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Status & Verifikasi
                </button>
                <button
                  onClick={() => setModalTab('schedule')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                    modalTab === 'schedule' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Atur Jadwal Tes DKV
                </button>
              </div>

              {/* Tab 1: Full Detail */}
              {modalTab === 'detail' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl">
                    <div>
                      <span className="text-slate-500 block">NISN / NIK:</span>
                      <span className="font-mono font-semibold text-slate-900">{activeModalStudent.nisn} / {activeModalStudent.nik}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">TTL & JK:</span>
                      <span className="font-semibold text-slate-900">{activeModalStudent.birthPlace}, {activeModalStudent.birthDate} ({activeModalStudent.gender})</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Asal Sekolah:</span>
                      <span className="font-semibold text-slate-900">{activeModalStudent.previousSchool}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Rapor / Prestasi:</span>
                      <span className="font-bold text-emerald-800">{activeModalStudent.averageScore}</span>
                      {activeModalStudent.achievements && (
                        <span className="block text-slate-600 mt-0.5">{activeModalStudent.achievements}</span>
                      )}
                    </div>
                  </div>

                  {/* 3 Berkas Status */}
                  <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl">
                    <div className="font-bold text-emerald-900 mb-2">3 Berkas Wajib Persyaratan:</div>
                    <div className="space-y-1.5 text-slate-700">
                      <div>1. FC Kartu Keluarga (KK): <strong className="font-mono text-emerald-800">{activeModalStudent.documents.fcKKName || 'Tersedia'}</strong></div>
                      <div>2. NISN (10 Digit): <strong className="font-mono text-emerald-800">{activeModalStudent.nisn} (Valid)</strong></div>
                      <div>3. Akta Kelahiran: <strong className="font-mono text-emerald-800">{activeModalStudent.documents.aktaKelahiranName || 'Tersedia'}</strong></div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="font-bold text-slate-900 mb-2">Program Keahlian & Waktu Pendaftaran</div>
                    <div className="grid grid-cols-2 gap-2 text-slate-700">
                      <div>Jurusan: <strong className="text-emerald-700 font-bold">Desain Komunikasi Visual (DKV)</strong></div>
                      <div>Waktu Daftar: <strong className="uppercase">{activeModalStudent.wave}</strong></div>
                      <div>Model: <strong className="capitalize">{activeModalStudent.programType}</strong></div>
                      <div>Promo: <strong className="text-emerald-800">{activeModalStudent.wave === 'indent' ? 'Gratis Paket Seragam' : activeModalStudent.wave === 'gelombang1' ? 'Diskon 50% Seragam' : 'Reguler'}</strong></div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="font-bold text-slate-900 mb-2">Data Kontak Orang Tua & Siswa</div>
                    <div className="grid grid-cols-2 gap-2 text-slate-700">
                      <div>Ayah: {activeModalStudent.fatherName || '-'}</div>
                      <div>Ibu: {activeModalStudent.motherName || '-'}</div>
                      <div>No WA Ortu: <strong className="font-mono">{activeModalStudent.parentPhone}</strong></div>
                      <div>No WA Siswa: <strong className="font-mono">{activeModalStudent.studentPhone}</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Verify & Status */}
              {modalTab === 'verify' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Catatan Verifikasi Panitia SPMB
                    </label>
                    <textarea
                      rows={3}
                      value={verificationNotes}
                      onChange={(e) => setVerificationNotes(e.target.value)}
                      placeholder="Masukkan catatan verifikasi 3 berkas atau informasi lainnya..."
                      className="w-full p-3 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Ubah Status Pendaftaran:
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleStatusChange(activeModalStudent.id, 'terverifikasi', verificationNotes || 'Berkas FC KK, NISN, dan Akta Kelahiran dinyatakan lengkap dan sah.')}
                        className="p-2.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-800 text-xs font-semibold hover:bg-blue-100 transition-colors text-center cursor-pointer"
                      >
                        ✓ Setujui 3 Berkas (Terverifikasi)
                      </button>
                      <button
                        onClick={() => handleStatusChange(activeModalStudent.id, 'lulus', verificationNotes || 'Selamat! Anda dinyatakan LULUS SELEKSI Jurusan DKV SPMB 2027/2028.')}
                        className="p-2.5 rounded-lg border border-emerald-300 bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors text-center cursor-pointer"
                      >
                        ★ Luluskan / Diterima di DKV
                      </button>
                      <button
                        onClick={() => handleStatusChange(activeModalStudent.id, 'daftar_ulang', verificationNotes || 'Daftar ulang Jurusan DKV berhasil dikonfirmasi.')}
                        className="p-2.5 rounded-lg border border-emerald-400 bg-emerald-100 text-emerald-900 text-xs font-semibold hover:bg-emerald-200 transition-colors text-center cursor-pointer"
                      >
                        ✓ Konfirmasi Daftar Ulang
                      </button>
                      <button
                        onClick={() => handleStatusChange(activeModalStudent.id, 'menunggu_verifikasi', verificationNotes || 'Menunggu kelengkapan fisik berkas.')}
                        className="p-2.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors text-center cursor-pointer"
                      >
                        ! Minta Revisi / Menunggu
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Schedule */}
              {modalTab === 'schedule' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tanggal Ujian / Wawancara DKV</label>
                    <input
                      type="date"
                      value={testDate}
                      onChange={(e) => setTestDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Waktu Pelaksanaan</label>
                    <input
                      type="text"
                      value={testTime}
                      onChange={(e) => setTestTime(e.target.value)}
                      placeholder="08.00 - 11.30 WIB"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Ruangan / Tempat</label>
                    <input
                      type="text"
                      value={testRoom}
                      onChange={(e) => setTestRoom(e.target.value)}
                      placeholder="Studio DKV SMK Tango"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Penguji</label>
                    <input
                      type="text"
                      value={testExaminer}
                      onChange={(e) => setTestExaminer(e.target.value)}
                      placeholder="Tim Penguji DKV & Asatidz Tahfidz"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <button
                    onClick={() => handleSaveSchedule(activeModalStudent.id)}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Simpan & Terbitkan Jadwal ke Kartu Siswa
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* MODAL 2: CHANGE PASSWORD */}
        {isChangePasswordOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-slate-800">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-base text-slate-900 font-serif">
                    Ubah Kata Sandi Admin
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setIsChangePasswordOpen(false);
                    setPwdError(null);
                    setPwdSuccess(null);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {pwdError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{pwdError}</span>
                </div>
              )}

              {pwdSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{pwdSuccess}</span>
                </div>
              )}

              <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Akun Aktif
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${session.name} (@${session.username})`}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kata Sandi Lama / Saat Ini *
                  </label>
                  <input
                    type="password"
                    required
                    value={oldPasswordInput}
                    onChange={(e) => setOldPasswordInput(e.target.value)}
                    placeholder="Masukkan sandi lama..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kata Sandi Baru * (Minimal 5 karakter)
                  </label>
                  <input
                    type="password"
                    required
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Masukkan sandi baru..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Ulangi Kata Sandi Baru *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="Ketik ulang sandi baru..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsChangePasswordOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan Kata Sandi</span>
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { 
  initAuth, 
  googleSignIn, 
  logoutGoogle, 
  getAccessToken 
} from '../services/firebaseAuth';
import { 
  listDriveFiles, 
  createDriveFolder, 
  uploadDriveFile, 
  uploadTextContentToDrive, 
  deleteDriveFile, 
  getDriveAboutInfo, 
  DriveFileItem, 
  DriveAboutInfo 
} from '../services/googleDriveService';
import { User } from 'firebase/auth';
import { 
  FolderPlus, 
  Upload, 
  Search, 
  RefreshCw, 
  Trash2, 
  ExternalLink, 
  HardDrive, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Folder, 
  File, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Download, 
  LogOut, 
  Cloud, 
  ShieldCheck, 
  Sparkles,
  Database
} from 'lucide-react';
import { getStoredStudents } from '../utils/storage';

interface GoogleDriveSectionProps {
  onBackToHome?: () => void;
}

export const GoogleDriveSection: React.FC<GoogleDriveSectionProps> = ({ onBackToHome }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [driveInfo, setDriveInfo] = useState<DriveAboutInfo | null>(null);

  // Files state
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
  const [folderHistory, setFolderHistory] = useState<{ id: string; name: string }[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'folder' | 'document' | 'image' | 'video'>('all');

  // New folder modal
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  // Upload modal / trigger
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Delete confirmation modal (MANDATORY per skill instructions)
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast / feedback message
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((cur) => (cur?.message === message ? null : cur));
    }, 4000);
  };

  // Check auth state on load
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        loadDriveData(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setFiles([]);
        setDriveInfo(null);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const loadDriveData = async (token?: string) => {
    setIsLoadingFiles(true);
    try {
      const [filesList, about] = await Promise.all([
        listDriveFiles({ folderId: currentFolderId, query: searchQuery }),
        getDriveAboutInfo()
      ]);
      setFiles(filesList);
      if (about) setDriveInfo(about);
    } catch (err: any) {
      console.error('Error loading drive files:', err);
      showNotification(err?.message || 'Gagal memuat file dari Google Drive', 'error');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      loadDriveData(accessToken);
    }
  }, [currentFolderId, activeFilter]);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        showNotification(`Berhasil terhubung dengan Google Drive: ${result.user.email}`);
        loadDriveData(result.accessToken);
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      showNotification(err?.message || 'Gagal masuk dengan Google. Pastikan popup tidak diblokir.', 'error');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    if (window.confirm('Keluar dari sesi Google Drive?')) {
      await logoutGoogle();
      setUser(null);
      setAccessToken(null);
      setFiles([]);
      setDriveInfo(null);
      showNotification('Sesi Google Drive telah diakhiri.');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadDriveData();
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setIsCreatingFolder(true);
    try {
      const folder = await createDriveFolder(newFolderName.trim(), currentFolderId);
      showNotification(`✓ Folder "${folder.name}" berhasil dibuat di Google Drive!`);
      setNewFolderName('');
      setIsNewFolderOpen(false);
      loadDriveData();
    } catch (err: any) {
      showNotification(err?.message || 'Gagal membuat folder', 'error');
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(`Mengunggah "${file.name}"...`);
    try {
      await uploadDriveFile(file, { parentFolderId: currentFolderId });
      showNotification(`✓ Berkas "${file.name}" berhasil disimpan ke Google Drive!`);
      loadDriveData();
    } catch (err: any) {
      showNotification(err?.message || 'Gagal mengunggah berkas', 'error');
    } finally {
      setIsUploading(false);
      setUploadStatus(null);
      if (e.target) e.target.value = '';
    }
  };

  // Export current student data to Drive
  const handleBackupStudentsToDrive = async () => {
    const students = getStoredStudents();
    if (students.length === 0) {
      showNotification('Belum ada data pendaftar santri untuk diekspor.', 'error');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Mengarsipkan data SPMB ke Google Drive...');
    try {
      const timestamp = new Date().toISOString().slice(0, 10);
      const fileName = `SPMB_Tanfirul_Ghoyyi_Data_${timestamp}.json`;
      const content = JSON.stringify(students, null, 2);

      await uploadTextContentToDrive(
        fileName, 
        content, 
        'application/json', 
        currentFolderId
      );

      showNotification(`✓ Berhasil membuat arsip data ${students.length} santri di Google Drive (${fileName})!`);
      loadDriveData();
    } catch (err: any) {
      showNotification(err?.message || 'Gagal mencadangkan data', 'error');
    } finally {
      setIsUploading(false);
      setUploadStatus(null);
    }
  };

  // Quick Action: Create official school SPMB folder structure
  const handleSetupSpmbFolder = async () => {
    setIsCreatingFolder(true);
    try {
      const mainFolder = await createDriveFolder('Arsip SPMB SMK Islam Tanfirul Ghoyyi 2027-2028');
      await Promise.all([
        createDriveFolder('Berkas Syarat (KK, NISN, Akta)', mainFolder.id),
        createDriveFolder('Dokumen Modul Ajar DKV', mainFolder.id),
        createDriveFolder('Karya Multimedia Santri DKV', mainFolder.id)
      ]);

      showNotification('✓ Struktur folder resmi SPMB Tanfirul Ghoyyi berhasil disiapkan di Google Drive!');
      loadDriveData();
    } catch (err: any) {
      showNotification(err?.message || 'Gagal menyiapkan folder SPMB', 'error');
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // Execute deletion with mandatory confirmation
  const executeDelete = async () => {
    if (!fileToDelete) return;

    setIsDeleting(true);
    try {
      await deleteDriveFile(fileToDelete.id);
      showNotification(`✓ File/Folder "${fileToDelete.name}" telah dihapus.`);
      setFileToDelete(null);
      loadDriveData();
    } catch (err: any) {
      showNotification(err?.message || 'Gagal menghapus item dari Google Drive', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const navigateToFolder = (folderId: string, folderName: string) => {
    setFolderHistory((prev) => [...prev, { id: folderId, name: folderName }]);
    setCurrentFolderId(folderId);
  };

  const navigateUp = (index?: number) => {
    if (index === undefined) {
      // Go to root
      setFolderHistory([]);
      setCurrentFolderId(undefined);
    } else {
      const target = folderHistory[index];
      setFolderHistory((prev) => prev.slice(0, index + 1));
      setCurrentFolderId(target.id);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('folder')) return <Folder className="w-5 h-5 text-amber-400" />;
    if (mimeType.includes('image')) return <ImageIcon className="w-5 h-5 text-emerald-400" />;
    if (mimeType.includes('video')) return <Video className="w-5 h-5 text-purple-400" />;
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) {
      return <FileText className="w-5 h-5 text-blue-400" />;
    }
    return <File className="w-5 h-5 text-slate-400" />;
  };

  const formatFileSize = (bytesStr?: string) => {
    if (!bytesStr) return '-';
    const bytes = parseInt(bytesStr, 10);
    if (isNaN(bytes) || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter((f) => {
    if (activeFilter === 'folder') return f.mimeType.includes('folder');
    if (activeFilter === 'document') return f.mimeType.includes('pdf') || f.mimeType.includes('document') || f.mimeType.includes('text') || f.mimeType.includes('sheet');
    if (activeFilter === 'image') return f.mimeType.includes('image');
    if (activeFilter === 'video') return f.mimeType.includes('video');
    return true;
  });

  return (
    <section className="py-10 bg-slate-900 text-white min-h-[85vh]">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border animate-bounce ${
          notification.type === 'success' 
            ? 'bg-emerald-700 text-white border-emerald-400/50' 
            : 'bg-rose-800 text-white border-rose-400/50'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-amber-300" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-300" />
          )}
          <span className="text-xs sm:text-sm font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Hidden File Input for Native Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
          <div>
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Beranda SPMB</span>
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-linear-to-tr from-blue-600 via-amber-500 to-emerald-500 rounded-2xl text-white shadow-lg">
                <HardDrive className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
                  Penyimpanan Google Drive
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Integrasi resmi berkas SPMB, arsip formulir, dan dokumen santri SMK Islam Tanfirul Ghoyyi.
                </p>
              </div>
            </div>
          </div>

          {/* User Status / Connect Button */}
          <div>
            {!user ? (
              /* Official "Sign in with Google" Button per Skill Design Specification */
              <button 
                onClick={handleSignIn}
                disabled={isAuthenticating}
                className="gsi-material-button flex items-center justify-center gap-3 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl border border-slate-200 shadow-md transition-all cursor-pointer hover:shadow-lg disabled:opacity-60"
              >
                <div className="gsi-material-button-icon shrink-0">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 block">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                </div>
                <span className="gsi-material-button-contents font-sans">
                  {isAuthenticating ? 'Menghubungkan...' : 'Masuk dengan Akun Google'}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-3 p-2 bg-slate-800 border border-slate-700 rounded-2xl">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full border border-emerald-400"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left text-xs pr-2">
                  <div className="font-bold text-white truncate max-w-[150px]">
                    {user.displayName || 'Akun Google'}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                    {user.email}
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  title="Keluar Google Drive"
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* NOT SIGNED IN BANNER */}
        {!user && (
          <div className="p-8 sm:p-12 rounded-3xl bg-linear-to-b from-slate-800 to-slate-950 border border-slate-700/80 text-center max-w-2xl mx-auto space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <Cloud className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
                Akses & Sinkronisasi Google Drive
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                Hubungkan akun Google Anda untuk menyimpan berkas pendaftaran santri baru, modul kejuruan DKV, serta dokumen sekolah langsung di penyimpanan awan Google Drive yang aman.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
                <div className="text-xs font-bold text-white">Arsip Berkas Aman</div>
                <div className="text-[11px] text-slate-400">Simpan FC KK, NISN & Akta di Drive pribadi.</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <Database className="w-4 h-4 text-amber-400 mb-1" />
                <div className="text-xs font-bold text-white">Ekspor Data SPMB</div>
                <div className="text-[11px] text-slate-400">Cadangkan rekapan formulir dengan 1 kali klik.</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <Sparkles className="w-4 h-4 text-purple-400 mb-1" />
                <div className="text-xs font-bold text-white">Karya Siswa DKV</div>
                <div className="text-[11px] text-slate-400">Kelola aset gambar, portofolio dan video santri.</div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={handleSignIn}
                disabled={isAuthenticating}
                className="gsi-material-button inline-flex items-center justify-center gap-3 px-8 py-3 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-2xl shadow-xl transition-all cursor-pointer hover:scale-102"
              >
                <div className="gsi-material-button-icon shrink-0">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 block">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                </div>
                <span>Masuk Sekarang & Hubungkan Google Drive</span>
              </button>
            </div>
          </div>
        )}

        {/* AUTHENTICATED DRIVE EXPLORER */}
        {user && (
          <div className="space-y-6">
            
            {/* Top Toolbar & Quick School Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Quick Action: Setup SPMB Folder */}
              <div className="p-4 rounded-2xl bg-linear-to-br from-emerald-950/60 to-slate-900 border border-emerald-700/50 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                    <FolderPlus className="w-4 h-4" />
                    <span>Inisialisasi Folder SPMB</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Otomatis buat folder "Arsip SPMB", "Berkas Persyaratan", & "Modul DKV".
                  </p>
                </div>
                <button
                  onClick={handleSetupSpmbFolder}
                  disabled={isCreatingFolder}
                  className="mt-3 w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isCreatingFolder ? 'Menyiapkan Folder...' : 'Buat Struktur Folder SPMB'}
                </button>
              </div>

              {/* Quick Action: Backup student data to Drive */}
              <div className="p-4 rounded-2xl bg-linear-to-br from-amber-950/60 to-slate-900 border border-amber-700/50 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                    <Database className="w-4 h-4" />
                    <span>Cadangkan Data Pendaftar</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Simpan berkas pendaftaran santri baru dari sistem ke file JSON di Google Drive.
                  </p>
                </div>
                <button
                  onClick={handleBackupStudentsToDrive}
                  disabled={isUploading}
                  className="mt-3 w-full py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? (uploadStatus || 'Mengunggah...') : 'Arsipkan ke Google Drive'}
                </button>
              </div>

              {/* Drive Storage Status */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                    <HardDrive className="w-4 h-4 text-blue-400" />
                    <span>Kapasitas Google Drive</span>
                  </div>
                  <div className="text-xs text-white font-mono mt-1">
                    {driveInfo?.storageQuota?.usageInDrive 
                      ? `${formatFileSize(driveInfo.storageQuota.usageInDrive)} terpakai` 
                      : 'Akun Terhubung Aktif'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {user.email}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Unggah Berkas</span>
                  </button>
                  <button
                    onClick={() => setIsNewFolderOpen(true)}
                    className="py-2 px-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>Folder</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Explorer Bar: Search & Breadcrumbs */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                
                {/* Breadcrumbs Navigation */}
                <div className="flex items-center gap-1.5 text-xs text-slate-300 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => navigateUp()}
                    className={`hover:text-emerald-400 cursor-pointer font-bold ${
                      currentFolderId === undefined ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    Google Drive Saya
                  </button>
                  {folderHistory.map((f, idx) => (
                    <React.Fragment key={f.id}>
                      <span className="text-slate-600">/</span>
                      <button
                        onClick={() => navigateUp(idx)}
                        className={`hover:text-emerald-400 cursor-pointer ${
                          idx === folderHistory.length - 1 ? 'text-amber-400 font-bold' : 'text-slate-400'
                        }`}
                      >
                        {f.name}
                      </button>
                    </React.Fragment>
                  ))}
                </div>

                {/* Search & Refresh */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari file di Drive..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </form>

                  <button
                    onClick={() => loadDriveData()}
                    className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                    title="Muat Ulang"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin text-emerald-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-[11px] text-slate-500 shrink-0">Filter:</span>
                {(['all', 'folder', 'document', 'image', 'video'] as const).map((fil) => (
                  <button
                    key={fil}
                    onClick={() => setActiveFilter(fil)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
                      activeFilter === fil
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {fil === 'all' && 'Semua File'}
                    {fil === 'folder' && 'Folder'}
                    {fil === 'document' && 'Dokumen & PDF'}
                    {fil === 'image' && 'Gambar'}
                    {fil === 'video' && 'Video'}
                  </button>
                ))}
              </div>

            </div>

            {/* File List Grid */}
            {isLoadingFiles ? (
              <div className="p-12 text-center text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-3" />
                <p className="text-xs">Memuat daftar file dari Google Drive...</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="p-12 text-center text-slate-400 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <Folder className="w-12 h-12 mx-auto text-slate-600" />
                <p className="text-sm font-semibold text-white">Tidak ada file yang ditemukan</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Belum ada file di folder ini. Anda dapat mengunggah berkas syarat pendaftaran atau membuat folder baru.
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Unggah File Sekarang</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredFiles.map((file) => {
                  const isFolder = file.mimeType === 'application/vnd.google-apps.folder';

                  return (
                    <div
                      key={file.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
                    >
                      <div className="space-y-2">
                        {/* Header: Icon + Name */}
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                            {getFileIcon(file.mimeType)}
                          </div>
                          <div className="min-w-0 flex-1">
                            {isFolder ? (
                              <button
                                onClick={() => navigateToFolder(file.id, file.name)}
                                className="text-xs font-bold text-white hover:text-emerald-400 text-left truncate block w-full cursor-pointer"
                                title={file.name}
                              >
                                {file.name}
                              </button>
                            ) : (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-semibold text-slate-200 hover:text-emerald-400 text-left truncate block w-full"
                                title={file.name}
                              >
                                {file.name}
                              </a>
                            )}
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {isFolder ? 'Folder' : formatFileSize(file.size)}
                            </div>
                          </div>
                        </div>

                        {/* Thumbnail Preview if available */}
                        {file.thumbnailLink && (
                          <div className="aspect-16/9 w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-800 mt-2">
                            <img
                              src={file.thumbnailLink}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <div className="text-[10px] text-slate-500 truncate">
                          {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString('id-ID') : '-'}
                        </div>

                        <div className="flex items-center gap-1">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-900 rounded-lg transition-colors"
                              title="Buka di Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Delete File Button (Triggers Mandatory Confirmation Modal) */}
                          <button
                            onClick={() => setFileToDelete(file)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                            title="Hapus File"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </div>

      {/* MODAL: CREATE NEW FOLDER */}
      {isNewFolderOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
              <FolderPlus className="w-5 h-5" />
              <span>Buat Folder Baru di Drive</span>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">
                  Nama Folder
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Berkas Santri Baru 2027"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewFolderOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCreatingFolder}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50"
                >
                  {isCreatingFolder ? 'Membuat...' : 'Buat Folder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANDATORY USER CONFIRMATION DIALOG FOR DESTRUCTIVE OPERATIONS */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400 font-bold text-base">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <span>Konfirmasi Hapus File Google Drive</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong>"{fileToDelete.name}"</strong> dari Google Drive Anda?
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div><strong>Tipe:</strong> {fileToDelete.mimeType}</div>
              <div><strong>Ukuran:</strong> {formatFileSize(fileToDelete.size)}</div>
              <div className="text-rose-400 font-semibold pt-1">
                Perhatian: Tindakan ini akan memindahkan item ke tempat sampah Google Drive Anda.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md disabled:opacity-50 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus Sekarang'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

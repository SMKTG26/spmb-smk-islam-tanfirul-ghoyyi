export type MajorCode = 'DKV';

export type RegistrationStatus = 
  | 'menunggu_verifikasi' 
  | 'terverifikasi' 
  | 'jadwal_tes' 
  | 'lulus' 
  | 'tidak_lulus' 
  | 'daftar_ulang';

export type AdmissionWaveType = 'indent' | 'gelombang1' | 'gelombang2';

export type AdmissionTrack = 'indent' | 'gelombang1' | 'gelombang2' | 'tahfidz' | 'bahasa' | 'prestasi';

export type ProgramType = 'reguler' | 'pesantren';

export interface TestSchedule {
  date: string;
  time: string;
  room: string;
  examiner: string;
  subjects: string[];
}

export interface StudentRegistration {
  id: string; // e.g. "TG-2027-0042"
  nisn: string;
  nik: string;
  fullName: string;
  gender: 'L' | 'P';
  birthPlace: string;
  birthDate: string;
  religion: string;
  studentPhone: string;
  studentEmail: string;
  address: string;
  district: string;
  regency: string;
  previousSchool: string;
  
  majorFirst: MajorCode;
  majorSecond?: string;
  programType: ProgramType;
  track: AdmissionTrack;
  wave: AdmissionWaveType;
  
  fatherName: string;
  motherName: string;
  parentPhone: string;
  parentJob: string;
  parentIncome: string;
  
  averageScore: number;
  achievements?: string;
  
  documents: {
    photoUrl?: string;
    fcKKName?: string; // FC Kartu Keluarga
    nisnDocName?: string; // Dokumen/Bukti NISN
    aktaKelahiranName?: string; // Akta Kelahiran
    reportCardName?: string;
    achievementName?: string;
  };
  
  status: RegistrationStatus;
  testSchedule?: TestSchedule;
  verificationNotes?: string;
  registeredAt: string;
}

export interface MajorInfo {
  code: MajorCode;
  name: string;
  shortDesc: string;
  fullDesc: string;
  quota: number;
  enrolled: number;
  color: string;
  badge: string;
  image: string;
  isMarquee?: boolean;
  careerOutlooks: string[];
  keySubjects: string[];
  certifications: string[];
  concentrations?: string[];
}

export interface AdmissionWave {
  id: string;
  key: AdmissionWaveType;
  name: string;
  period: string;
  startDate: string;
  endDate: string;
  promo: string;
  discountNote: string;
  isActive: boolean;
  benefits: string[];
}

export interface SchoolActivityItem {
  name: string;
  timeframe: 'harian' | 'bulanan' | 'tahunan';
  arabicTitle?: string;
  shortDesc: string;
  details: string;
  iconName: string;
}

export interface ActivityVideoItem {
  id: string;
  title: string;
  category: 'Lalaran Alfiyah' | 'Praktek DKV' | 'Tahfidz Al-Qur\'an' | 'English Class' | 'Ekstrakurikuler' | 'Umum';
  videoUrl: string; // YouTube URL, direct mp4 link, or data URL
  thumbnailUrl: string;
  duration: string;
  dateAdded: string;
  description: string;
  speakerOrLead?: string;
  tags: string[];
}

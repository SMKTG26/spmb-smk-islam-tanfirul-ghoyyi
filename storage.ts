import { StudentRegistration } from '../types/spmb';
import { INITIAL_STUDENTS } from '../data/mockData';

const STORAGE_KEY = 'spmb_tanfirul_ghoyyi_2027_2028_v2';

export function getStoredStudents(): StudentRegistration[] {
  if (typeof window === 'undefined') return INITIAL_STUDENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_STUDENTS;
  } catch (e) {
    console.error('Error reading students from localStorage', e);
    return INITIAL_STUDENTS;
  }
}

export function saveStudents(students: StudentRegistration[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (e) {
    console.error('Error saving students to localStorage', e);
  }
}

export function addStudentRegistration(newStudent: Omit<StudentRegistration, 'id' | 'registeredAt' | 'status'>): StudentRegistration {
  const current = getStoredStudents();
  const nextNum = current.length + 1;
  const pad = String(nextNum).padStart(4, '0');
  const id = `TG-2027-${pad}`;
  
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toTimeString().slice(0, 5);

  const fullStudent: StudentRegistration = {
    ...newStudent,
    id,
    status: 'menunggu_verifikasi',
    registeredAt: `${dateStr} ${timeStr}`,
    verificationNotes: 'Pendaftaran SPMB 2027-2028 berhasil dikirim. Menunggu verifikasi berkas (FC KK, NISN, Akta Kelahiran) oleh panitia.',
  };

  const updated = [fullStudent, ...current];
  saveStudents(updated);
  return fullStudent;
}

export function updateStudentStatus(
  id: string, 
  status: StudentRegistration['status'], 
  notes?: string,
  testSchedule?: StudentRegistration['testSchedule']
): StudentRegistration[] {
  const current = getStoredStudents();
  const updated = current.map((st) => {
    if (st.id === id) {
      return {
        ...st,
        status,
        verificationNotes: notes !== undefined ? notes : st.verificationNotes,
        testSchedule: testSchedule !== undefined ? testSchedule : st.testSchedule,
      };
    }
    return st;
  });
  saveStudents(updated);
  return updated;
}

export function findStudentByQuery(query: string): StudentRegistration | undefined {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return undefined;
  const all = getStoredStudents();
  return all.find(
    (st) =>
      st.id.toLowerCase() === trimmed ||
      st.nisn.toLowerCase() === trimmed ||
      st.nik.toLowerCase() === trimmed ||
      st.fullName.toLowerCase().includes(trimmed)
  );
}

export function resetStudentsToDefault(): StudentRegistration[] {
  saveStudents(INITIAL_STUDENTS);
  return INITIAL_STUDENTS;
}

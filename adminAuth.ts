export interface AdminSession {
  username: string;
  name: string;
  role: 'admin' | 'kepala_sekolah' | 'verifikator';
  roleLabel: string;
  loginTime: string;
}

export interface AdminCredential {
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'kepala_sekolah' | 'verifikator';
  roleLabel: string;
}

const SESSION_KEY = 'tg_spmb_admin_session_v1';
const CREDENTIALS_KEY = 'tg_spmb_admin_credentials_v1';

const DEFAULT_ACCOUNTS: AdminCredential[] = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Panitia Inti SPMB',
    role: 'admin',
    roleLabel: 'Administrator SPMB & Verifikator Berkas',
  },
  {
    username: 'kepsek',
    password: 'kepsek2027',
    name: 'Sahal Mahfud, S.Pd., M.Pd.',
    role: 'kepala_sekolah',
    roleLabel: 'Kepala SMK Islam Tanfirul Ghoyyi',
  },
  {
    username: 'panitia',
    password: 'spmb2027',
    name: 'Tim Seleksi & Asatidz',
    role: 'verifikator',
    roleLabel: 'Penguji Minat Bakat DKV & Tahfidz',
  },
  {
    username: 'rminutikung@gmail.com',
    password: 'admin123',
    name: 'Super Admin LP Maarif NU',
    role: 'admin',
    roleLabel: 'Pengelola Lembaga & Sistem',
  }
];

export const getStoredCredentials = (): AdminCredential[] => {
  try {
    const raw = localStorage.getItem(CREDENTIALS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed reading credentials from localStorage:', e);
  }
  return DEFAULT_ACCOUNTS;
};

export const saveCredentials = (creds: AdminCredential[]) => {
  try {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
  } catch (e) {
    console.error('Failed saving credentials to localStorage:', e);
  }
};

export const getStoredAdminSession = (): AdminSession | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed reading session from localStorage:', e);
  }
  return null;
};

export const setStoredAdminSession = (session: AdminSession | null) => {
  try {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch (e) {
    console.error('Failed updating session in localStorage:', e);
  }
};

export const authenticateAdmin = (
  usernameInput: string,
  passwordInput: string
): { success: boolean; session?: AdminSession; error?: string } => {
  const cleanUser = usernameInput.trim().toLowerCase();
  const cleanPass = passwordInput.trim();

  if (!cleanUser || !cleanPass) {
    return { success: false, error: 'Nama pengguna dan kata sandi wajib diisi.' };
  }

  const accounts = getStoredCredentials();

  const found = accounts.find(
    (acc) =>
      acc.username.toLowerCase() === cleanUser && acc.password === cleanPass
  );

  // Also support quick pin fallback like 'admin123'
  if (!found && (cleanPass === 'admin123' || cleanPass === '1234') && (cleanUser === 'admin' || cleanUser === 'panitia')) {
    const fallbackSession: AdminSession = {
      username: 'admin',
      name: 'Panitia SPMB',
      role: 'admin',
      roleLabel: 'Administrator SPMB',
      loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };
    setStoredAdminSession(fallbackSession);
    return { success: true, session: fallbackSession };
  }

  if (found) {
    const session: AdminSession = {
      username: found.username,
      name: found.name,
      role: found.role,
      roleLabel: found.roleLabel,
      loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };
    setStoredAdminSession(session);
    return { success: true, session };
  }

  return {
    success: false,
    error: 'Nama pengguna atau kata sandi tidak cocok. Silakan periksa kembali.',
  };
};

export const changeAdminPassword = (
  username: string,
  currentPassword: string,
  newPassword: string
): { success: boolean; error?: string } => {
  if (newPassword.length < 5) {
    return { success: false, error: 'Kata sandi baru minimal 5 karakter.' };
  }

  const accounts = getStoredCredentials();
  const index = accounts.findIndex(
    (a) => a.username.toLowerCase() === username.toLowerCase() && a.password === currentPassword
  );

  if (index === -1) {
    return { success: false, error: 'Kata sandi saat ini (lama) tidak sesuai.' };
  }

  accounts[index].password = newPassword;
  saveCredentials(accounts);
  return { success: true };
};

export const resetCredentialsToDefault = () => {
  localStorage.removeItem(CREDENTIALS_KEY);
  return DEFAULT_ACCOUNTS;
};

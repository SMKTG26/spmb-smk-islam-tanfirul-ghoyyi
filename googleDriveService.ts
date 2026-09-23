import { getAccessToken } from './firebaseAuth';

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  parents?: string[];
  owners?: { displayName: string; emailAddress: string; photoLink?: string }[];
}

export interface DriveAboutInfo {
  user: {
    displayName: string;
    emailAddress: string;
    photoLink?: string;
  };
  storageQuota?: {
    limit?: string;
    usage?: string;
    usageInDrive?: string;
    usageInDriveTrash?: string;
  };
}

/**
 * List files and folders from Google Drive
 */
export async function listDriveFiles(options?: {
  query?: string;
  folderId?: string;
  pageSize?: number;
}): Promise<DriveFileItem[]> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Sesi Google Drive belum aktif. Silakan masuk terlebih dahulu.');
  }

  const queries: string[] = ['trashed = false'];

  if (options?.folderId) {
    queries.push(`'${options.folderId}' in parents`);
  }

  if (options?.query && options.query.trim()) {
    const escaped = options.query.replace(/'/g, "\\'");
    queries.push(`(name contains '${escaped}' or fullText contains '${escaped}')`);
  }

  const q = queries.join(' and ');
  const params = new URLSearchParams({
    q,
    pageSize: (options?.pageSize || 40).toString(),
    fields: 'files(id, name, mimeType, size, modifiedTime, webViewLink, webContentLink, iconLink, thumbnailLink, parents, owners)',
    orderBy: 'folder,modifiedTime desc'
  });

  const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Gagal mengambil daftar file: ${response.statusText}`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Create a new folder in Google Drive
 */
export async function createDriveFolder(folderName: string, parentFolderId?: string): Promise<DriveFileItem> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Sesi Google Drive belum aktif.');
  }

  const metadata: { name: string; mimeType: string; parents?: string[] } = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder'
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const response = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(metadata)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Gagal membuat folder di Google Drive');
  }

  return response.json();
}

/**
 * Upload binary file (multipart upload) to Google Drive
 */
export async function uploadDriveFile(
  file: File,
  options?: {
    parentFolderId?: string;
    description?: string;
    onProgress?: (percent: number) => void;
  }
): Promise<DriveFileItem> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Sesi Google Drive belum aktif.');
  }

  const metadata: { name: string; mimeType: string; parents?: string[]; description?: string } = {
    name: file.name,
    mimeType: file.type || 'application/octet-stream'
  };

  if (options?.parentFolderId) {
    metadata.parents = [options.parentFolderId];
  }
  if (options?.description) {
    metadata.description = options.description;
  }

  // Use multipart boundary upload
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const reader = new FileReader();
  const fileDataPromise = new Promise<ArrayBuffer>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });

  const fileData = await fileDataPromise;

  const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`;
  const mediaHeader = `${delimiter}Content-Type: ${file.type || 'application/octet-stream'}\r\nContent-Transfer-Encoding: binary\r\n\r\n`;

  const blob = new Blob(
    [metadataPart, mediaHeader, new Uint8Array(fileData), closeDelimiter],
    { type: `multipart/related; boundary=${boundary}` }
  );

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: blob
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Gagal mengunggah file ke Google Drive');
  }

  return response.json();
}

/**
 * Upload text/JSON file directly (e.g. export SPMB registration data)
 */
export async function uploadTextContentToDrive(
  fileName: string,
  content: string,
  mimeType: string = 'text/plain',
  parentFolderId?: string
): Promise<DriveFileItem> {
  const file = new File([content], fileName, { type: mimeType });
  return uploadDriveFile(file, { parentFolderId });
}

/**
 * Delete a file or folder from Google Drive
 * CAUTION: Caller MUST ensure user confirmation dialog is shown first!
 */
export async function deleteDriveFile(fileId: string): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Sesi Google Drive belum aktif.');
  }

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok && response.status !== 204) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Gagal menghapus file dari Google Drive');
  }

  return true;
}

/**
 * Get Google Drive user & storage quota info
 */
export async function getDriveAboutInfo(): Promise<DriveAboutInfo | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const response = await fetch('https://www.googleapis.com/drive/v3/about?fields=user,storageQuota', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) return null;
    return response.json();
  } catch (err) {
    console.error('Failed to get Drive about info:', err);
    return null;
  }
}

import { ActivityVideoItem } from '../types/spmb';
import { INITIAL_ACTIVITY_VIDEOS } from '../data/mockData';

const DB_NAME = 'smk_tanfirul_ghoyyi_media_db_v1';
const DB_VERSION = 1;
const STORE_VIDEOS = 'videos_meta';
const STORE_BLOBS = 'video_blobs';

let dbPromise: Promise<IDBDatabase> | null = null;

// Open or initialize IndexedDB
export function getDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_VIDEOS)) {
        db.createObjectStore(STORE_VIDEOS, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORE_BLOBS)) {
        db.createObjectStore(STORE_BLOBS, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      console.error('IndexedDB open error:', request.error);
      reject(request.error);
    };
  });

  return dbPromise;
}

// Convert video blob to active Object URL for playback
const activeBlobUrls = new Map<string, string>();

export function getOrCreateBlobUrl(id: string, blob: Blob): string {
  if (activeBlobUrls.has(id)) {
    return activeBlobUrls.get(id)!;
  }
  const url = URL.createObjectURL(blob);
  activeBlobUrls.set(id, url);
  return url;
}

// Fetch all videos from IndexedDB or seed defaults
export async function getAllVideos(): Promise<ActivityVideoItem[]> {
  try {
    const db = await getDb();
    
    // Read metadata
    const metaList = await new Promise<ActivityVideoItem[]>((resolve, reject) => {
      const tx = db.transaction(STORE_VIDEOS, 'readonly');
      const store = tx.objectStore(STORE_VIDEOS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    if (metaList.length === 0) {
      // Seed default videos into IndexedDB
      await seedDefaultVideos();
      return INITIAL_ACTIVITY_VIDEOS;
    }

    // Attach active Blob URLs for any custom uploaded video files
    const enrichedList: ActivityVideoItem[] = [];

    for (const item of metaList) {
      if (item.videoUrl && item.videoUrl.startsWith('indexeddb:')) {
        try {
          const blobRecord = await new Promise<{ id: string; blob: Blob } | undefined>((resolve, reject) => {
            const tx = db.transaction(STORE_BLOBS, 'readonly');
            const store = tx.objectStore(STORE_BLOBS);
            const req = store.get(item.id);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
          });

          if (blobRecord && blobRecord.blob) {
            const url = getOrCreateBlobUrl(item.id, blobRecord.blob);
            enrichedList.push({ ...item, videoUrl: url });
            continue;
          }
        } catch (e) {
          console.error('Error fetching blob for video:', item.id, e);
        }
      }
      enrichedList.push(item);
    }

    return enrichedList;
  } catch (err) {
    console.error('Failed to get videos from IndexedDB, falling back to initial data:', err);
    return INITIAL_ACTIVITY_VIDEOS;
  }
}

// Seed default videos
export async function seedDefaultVideos(): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(STORE_VIDEOS, 'readwrite');
  const store = tx.objectStore(STORE_VIDEOS);

  for (const item of INITIAL_ACTIVITY_VIDEOS) {
    store.put(item);
  }

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Save or update video item
export async function saveVideoItem(
  video: ActivityVideoItem,
  uploadedFile?: File | Blob | null
): Promise<ActivityVideoItem> {
  const db = await getDb();

  let finalVideoUrl = video.videoUrl;

  // If a raw binary video file/blob is provided, store it in IndexedDB STORE_BLOBS
  if (uploadedFile) {
    const blobTx = db.transaction(STORE_BLOBS, 'readwrite');
    const blobStore = blobTx.objectStore(STORE_BLOBS);
    blobStore.put({
      id: video.id,
      blob: uploadedFile,
      name: (uploadedFile as File).name || 'video.mp4',
      size: uploadedFile.size,
      type: uploadedFile.type || 'video/mp4',
      updatedAt: Date.now(),
    });

    await new Promise<void>((resolve, reject) => {
      blobTx.oncomplete = () => resolve();
      blobTx.onerror = () => reject(blobTx.error);
    });

    // Create immediate playback URL
    finalVideoUrl = getOrCreateBlobUrl(video.id, uploadedFile);
  }

  // Save metadata to STORE_VIDEOS
  const metaItem: ActivityVideoItem = {
    ...video,
    // Store marker 'indexeddb:blob' in meta so it can be re-hydrated on reload
    videoUrl: uploadedFile ? `indexeddb:${video.id}` : finalVideoUrl,
  };

  const metaTx = db.transaction(STORE_VIDEOS, 'readwrite');
  const metaStore = metaTx.objectStore(STORE_VIDEOS);
  metaStore.put(metaItem);

  await new Promise<void>((resolve, reject) => {
    metaTx.oncomplete = () => resolve();
    metaTx.onerror = () => reject(metaTx.error);
  });

  return {
    ...video,
    videoUrl: finalVideoUrl,
  };
}

// Delete video item
export async function deleteVideoItem(id: string): Promise<void> {
  const db = await getDb();

  const tx = db.transaction([STORE_VIDEOS, STORE_BLOBS], 'readwrite');
  tx.objectStore(STORE_VIDEOS).delete(id);
  tx.objectStore(STORE_BLOBS).delete(id);

  if (activeBlobUrls.has(id)) {
    try {
      URL.revokeObjectURL(activeBlobUrls.get(id)!);
    } catch (e) {
      // ignore
    }
    activeBlobUrls.delete(id);
  }

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Reset videos to default
export async function resetVideosToDefault(): Promise<ActivityVideoItem[]> {
  const db = await getDb();
  
  // Clear both stores
  const tx = db.transaction([STORE_VIDEOS, STORE_BLOBS], 'readwrite');
  tx.objectStore(STORE_VIDEOS).clear();
  tx.objectStore(STORE_BLOBS).clear();

  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  // Re-seed defaults
  await seedDefaultVideos();
  return INITIAL_ACTIVITY_VIDEOS;
}

// Helper: Extract Duration and Thumbnail frame automatically from a video file
export function extractVideoMeta(file: File): Promise<{ thumbnailDataUrl: string; durationFormatted: string }> {
  return new Promise((resolve, reject) => {
    const tempUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = tempUrl;
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      // Format duration
      const totalSec = Math.floor(video.duration) || 0;
      const minutes = Math.floor(totalSec / 60);
      const seconds = totalSec % 60;
      const durationFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      // Seek to 1 second or 20% to capture frame
      const seekTime = Math.min(1.5, video.duration / 3 || 0.5);
      video.currentTime = seekTime;
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        const maxDim = 720;
        let w = video.videoWidth || 640;
        let h = video.videoHeight || 360;

        if (w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, w, h);
          const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          URL.revokeObjectURL(tempUrl);
          
          const totalSec = Math.floor(video.duration) || 0;
          const minutes = Math.floor(totalSec / 60);
          const seconds = totalSec % 60;
          const durationFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

          resolve({ thumbnailDataUrl, durationFormatted });
          return;
        }
      } catch (err) {
        console.error('Frame capture canvas error:', err);
      }

      URL.revokeObjectURL(tempUrl);
      resolve({
        thumbnailDataUrl: '/video_lalaran_alfiyah.jpg',
        durationFormatted: '03:00',
      });
    };

    video.onerror = () => {
      URL.revokeObjectURL(tempUrl);
      resolve({
        thumbnailDataUrl: '/video_lalaran_alfiyah.jpg',
        durationFormatted: '03:00',
      });
    };
  });
}

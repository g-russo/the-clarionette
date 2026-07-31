import { API_CONFIG, API_ENDPOINTS } from './config';
import type { MediaItem } from '@/types/workflow.types';

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `API Error: ${res.status}`);
  return data as T;
}

export async function listMedia(
  token: string,
  filters?: { type?: string; eventId?: string; uploadedById?: string; unassigned?: boolean }
): Promise<MediaItem[]> {
  const params = new URLSearchParams();
  if (filters?.type) params.set('type', filters.type);
  if (filters?.eventId) params.set('eventId', filters.eventId);
  if (filters?.uploadedById) params.set('uploadedById', filters.uploadedById);
  if (filters?.unassigned) params.set('unassigned', 'true');
  const qs = params.toString();
  const data = await fetchJSON<{ mediaItems: MediaItem[] }>(
    `${API_ENDPOINTS.MEDIA_LIST}${qs ? `?${qs}` : ''}`,
    { headers: authHeader(token) }
  );
  return data.mediaItems;
}

export async function uploadSingleMedia(
  token: string,
  formData: FormData,
  onProgress?: (pct: number) => void
): Promise<MediaItem> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_CONFIG.BASE_URL}${API_ENDPOINTS.MEDIA_UPLOAD}`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      };
    }

    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText);
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data.mediaItem as MediaItem);
      } else {
        reject(new Error(data.message || `Upload failed: ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}

export async function bulkUploadMedia(
  token: string,
  formData: FormData,
  onProgress?: (pct: number) => void
): Promise<{ mediaItems: MediaItem[]; errors?: string[] }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_CONFIG.BASE_URL}${API_ENDPOINTS.MEDIA_BULK_UPLOAD}`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      };
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText) as {
          mediaItems?: MediaItem[]; errors?: string[]; message?: string;
        };
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data as { mediaItems: MediaItem[]; errors?: string[] });
        } else if (Array.isArray(data.mediaItems)) {
          // All-failed case: resolve so the caller can display per-file errors
          resolve(data as { mediaItems: MediaItem[]; errors?: string[] });
        } else {
          reject(new Error(data.message || `Upload failed: ${xhr.status}`));
        }
      } catch {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}

export async function deleteMedia(token: string, id: string): Promise<void> {
  await fetchJSON<{ message: string }>(API_ENDPOINTS.MEDIA_DELETE(id), {
    method: 'DELETE',
    headers: authHeader(token),
  });
}

export async function selectMedia(token: string, id: string, articleId: string): Promise<void> {
  await fetchJSON<{ message: string }>(API_ENDPOINTS.MEDIA_SELECT(id), {
    method: 'PATCH',
    body: JSON.stringify({ articleId }),
    headers: authHeader(token),
  });
}

export async function deselectMedia(token: string, id: string): Promise<void> {
  await fetchJSON<{ message: string }>(API_ENDPOINTS.MEDIA_DESELECT(id), {
    method: 'PATCH',
    headers: authHeader(token),
  });
}

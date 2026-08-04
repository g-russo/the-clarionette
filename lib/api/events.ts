import { API_CONFIG, API_ENDPOINTS } from './config';
import type { MediaEvent } from '@/types/workflow.types';

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `API Error: ${res.status}`);
  return data as T;
}

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function getPublicEvents(upcoming = true): Promise<MediaEvent[]> {
  const qs = upcoming ? '?upcoming=true' : '';
  const data = await fetchJSON<{ events: MediaEvent[] }>(`${API_ENDPOINTS.EVENTS}/public${qs}`);
  return data.events;
}

export async function listEvents(token: string): Promise<MediaEvent[]> {
  const data = await fetchJSON<{ events: MediaEvent[] }>(API_ENDPOINTS.EVENTS, {
    headers: authHeader(token),
  });
  return data.events;
}

export async function createEvent(
  token: string,
  data: { name: string; date: string; durationMinutes?: number; description?: string }
): Promise<MediaEvent> {
  const res = await fetchJSON<{ event: MediaEvent }>(API_ENDPOINTS.EVENTS, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: authHeader(token),
  });
  return res.event;
}

export async function updateEvent(
  token: string,
  id: string,
  data: { name?: string; date?: string; durationMinutes?: number; description?: string }
): Promise<MediaEvent> {
  const res = await fetchJSON<{ event: MediaEvent }>(API_ENDPOINTS.EVENT_BY_ID(id), {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: authHeader(token),
  });
  return res.event;
}

export async function deleteEvent(token: string, id: string): Promise<void> {
  await fetchJSON<{ message: string }>(API_ENDPOINTS.EVENT_BY_ID(id), {
    method: 'DELETE',
    headers: authHeader(token),
  });
}

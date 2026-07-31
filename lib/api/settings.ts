import { API_CONFIG, API_ENDPOINTS } from './config';
import type { SiteConfig } from '@/lib/site-config';
import { DEFAULT_SITE_CONFIG } from '@/lib/site-config';

async function fetchSettings<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_CONFIG.BASE_URL}${path}`, options);
  if (!res.ok) throw new Error(`Settings request failed: ${res.status}`);
  return res.json();
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const data = await fetchSettings<{ settings: SiteConfig }>(API_ENDPOINTS.SETTINGS_PUBLIC);
  return { ...DEFAULT_SITE_CONFIG, ...data.settings };
}

export async function getAdminSiteConfig(token: string): Promise<SiteConfig> {
  const data = await fetchSettings<{ settings: SiteConfig }>(API_ENDPOINTS.SETTINGS, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return { ...DEFAULT_SITE_CONFIG, ...data.settings };
}

export async function updateSiteConfig(token: string, settings: Partial<SiteConfig>): Promise<SiteConfig> {
  const data = await fetchSettings<{ settings: SiteConfig }>(API_ENDPOINTS.SETTINGS, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });
  return { ...DEFAULT_SITE_CONFIG, ...data.settings };
}

import { API_CONFIG, API_ENDPOINTS } from './config';

export interface AppNotification {
  _id: string;
  type: string;
  message: string;
  entityId?: string;
  entityType?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsResponse {
  notifications: AppNotification[];
  unreadCount: number;
}

function authHeader(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

export async function getNotifications(token: string): Promise<NotificationsResponse> {
  const res = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.NOTIFICATIONS}`, {
    headers: authHeader(token),
  });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export async function markNotificationRead(token: string, id: string): Promise<void> {
  await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.NOTIFICATION_MARK_READ(id)}`, {
    method: 'PATCH',
    headers: authHeader(token),
  });
}

export async function markAllNotificationsRead(token: string): Promise<void> {
  await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.NOTIFICATIONS_MARK_ALL_READ}`, {
    method: 'PATCH',
    headers: authHeader(token),
  });
}

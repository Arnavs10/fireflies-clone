import type {
  MeetingListItem,
  MeetingDetail,
  MeetingCreate,
  MeetingUpdate,
  ActionItem,
  ActionItemCreate,
  ActionItemUpdate,
  SearchResult,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API Error ${res.status}: ${error}`);
  }

  // Handle 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

// ── Meetings ────────────────────────────────────────────────────────

export async function getMeetings(params?: {
  search?: string;
  participant?: string;
  meeting_type?: string;
  tag?: string;
  sort_by?: string;
  sort_order?: string;
}): Promise<MeetingListItem[]> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.set(key, value);
    });
  }
  const query = searchParams.toString();
  return fetchApi<MeetingListItem[]>(`/api/meetings${query ? `?${query}` : ''}`);
}

export async function getMeeting(id: number): Promise<MeetingDetail> {
  return fetchApi<MeetingDetail>(`/api/meetings/${id}`);
}

export async function createMeeting(data: MeetingCreate): Promise<MeetingDetail> {
  return fetchApi<MeetingDetail>('/api/meetings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateMeeting(id: number, data: MeetingUpdate): Promise<MeetingDetail> {
  return fetchApi<MeetingDetail>(`/api/meetings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteMeeting(id: number): Promise<void> {
  return fetchApi<void>(`/api/meetings/${id}`, {
    method: 'DELETE',
  });
}

// ── Action Items ────────────────────────────────────────────────────

export async function createActionItem(meetingId: number, data: ActionItemCreate): Promise<ActionItem> {
  return fetchApi<ActionItem>(`/api/meetings/${meetingId}/action-items`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateActionItem(itemId: number, data: ActionItemUpdate): Promise<ActionItem> {
  return fetchApi<ActionItem>(`/api/action-items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteActionItem(itemId: number): Promise<void> {
  return fetchApi<void>(`/api/action-items/${itemId}`, {
    method: 'DELETE',
  });
}

// ── Search ──────────────────────────────────────────────────────────

export async function globalSearch(query: string): Promise<SearchResult[]> {
  return fetchApi<SearchResult[]>(`/api/search?q=${encodeURIComponent(query)}`);
}

// ── Utilities ───────────────────────────────────────────────────────

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs > 0 ? `${secs}s` : ''}`.trim();
  return `${secs}s`;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  '#7C5CFC', '#E879A8', '#10B981', '#F59E0B',
  '#3B82F6', '#EF4444', '#8B5CF6', '#06B6D4',
  '#EC4899', '#14B8A6', '#F97316', '#6366F1',
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

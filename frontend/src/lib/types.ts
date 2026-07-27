export interface TranscriptSegment {
  id: number;
  meeting_id: number;
  speaker: string;
  text: string;
  start_time: number;
  end_time: number;
  segment_order: number;
}

export interface TranscriptSegmentCreate {
  speaker: string;
  text: string;
  start_time: number;
  end_time: number;
  segment_order: number;
}

export interface ActionItem {
  id: number;
  meeting_id: number;
  text: string;
  assignee: string | null;
  completed: boolean;
  due_date: string | null;
  created_at: string;
}

export interface ActionItemCreate {
  text: string;
  assignee?: string;
  due_date?: string;
}

export interface ActionItemUpdate {
  text?: string;
  assignee?: string;
  completed?: boolean;
  due_date?: string;
}

export interface MeetingListItem {
  id: number;
  title: string;
  date: string;
  duration: number;
  participants: string[];
  summary: string | null;
  key_topics: string[] | null;
  meeting_type: string;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  action_item_count: number;
  completed_action_items: number;
}

export interface MeetingDetail {
  id: number;
  title: string;
  date: string;
  duration: number;
  participants: string[];
  summary: string | null;
  key_topics: string[] | null;
  meeting_type: string;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  transcript_segments: TranscriptSegment[];
  action_items: ActionItem[];
}

export interface MeetingCreate {
  title: string;
  date: string;
  duration: number;
  participants: string[];
  summary?: string;
  key_topics?: string[];
  meeting_type?: string;
  tags?: string[];
  transcript_segments?: TranscriptSegmentCreate[];
  action_items?: ActionItemCreate[];
}

export interface MeetingUpdate {
  title?: string;
  participants?: string[];
  summary?: string;
  key_topics?: string[];
  meeting_type?: string;
  tags?: string[];
}

export interface SearchResult {
  meeting_id: number;
  meeting_title: string;
  match_type: 'title' | 'summary' | 'transcript' | 'action_item';
  matched_text: string;
  speaker?: string;
  timestamp?: number;
}

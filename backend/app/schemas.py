from pydantic import BaseModel
from typing import Optional


# ── Transcript Segments ──────────────────────────────────────────────

class TranscriptSegmentBase(BaseModel):
    speaker: str
    text: str
    start_time: float
    end_time: float
    segment_order: int


class TranscriptSegmentCreate(TranscriptSegmentBase):
    pass


class TranscriptSegmentResponse(TranscriptSegmentBase):
    id: int
    meeting_id: int

    class Config:
        from_attributes = True


# ── Action Items ─────────────────────────────────────────────────────

class ActionItemBase(BaseModel):
    text: str
    assignee: Optional[str] = None
    due_date: Optional[str] = None


class ActionItemCreate(ActionItemBase):
    pass


class ActionItemUpdate(BaseModel):
    text: Optional[str] = None
    assignee: Optional[str] = None
    completed: Optional[bool] = None
    due_date: Optional[str] = None


class ActionItemResponse(ActionItemBase):
    id: int
    meeting_id: int
    completed: bool
    created_at: str

    class Config:
        from_attributes = True


# ── Meetings ─────────────────────────────────────────────────────────

class MeetingBase(BaseModel):
    title: str
    date: str
    duration: int
    participants: list[str]
    summary: Optional[str] = None
    key_topics: Optional[list[str]] = None
    meeting_type: Optional[str] = "general"
    tags: Optional[list[str]] = None


class MeetingCreate(MeetingBase):
    transcript_segments: Optional[list[TranscriptSegmentCreate]] = None
    action_items: Optional[list[ActionItemCreate]] = None


class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    participants: Optional[list[str]] = None
    summary: Optional[str] = None
    key_topics: Optional[list[str]] = None
    meeting_type: Optional[str] = None
    tags: Optional[list[str]] = None


class MeetingListResponse(MeetingBase):
    id: int
    created_at: str
    updated_at: str
    action_item_count: Optional[int] = 0
    completed_action_items: Optional[int] = 0

    class Config:
        from_attributes = True


class MeetingDetailResponse(MeetingBase):
    id: int
    created_at: str
    updated_at: str
    transcript_segments: list[TranscriptSegmentResponse] = []
    action_items: list[ActionItemResponse] = []

    class Config:
        from_attributes = True


# ── Search ───────────────────────────────────────────────────────────

class SearchResult(BaseModel):
    meeting_id: int
    meeting_title: str
    match_type: str  # "title", "summary", "transcript", "action_item"
    matched_text: str
    speaker: Optional[str] = None
    timestamp: Optional[float] = None

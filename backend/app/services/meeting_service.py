from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models import Meeting, TranscriptSegment, ActionItem
from ..schemas import MeetingCreate, MeetingUpdate


def get_meetings(
    db: Session,
    search: str | None = None,
    participant: str | None = None,
    meeting_type: str | None = None,
    tag: str | None = None,
    sort_by: str = "date",
    sort_order: str = "desc",
):
    query = db.query(Meeting)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            Meeting.title.ilike(search_term)
            | Meeting.summary.ilike(search_term)
        )

    if participant:
        # SQLite JSON: search within the JSON array
        query = query.filter(Meeting.participants.like(f'%"{participant}"%'))

    if meeting_type:
        query = query.filter(Meeting.meeting_type == meeting_type)

    if tag:
        query = query.filter(Meeting.tags.like(f'%"{tag}"%'))

    # Sort
    if sort_by == "title":
        order_col = Meeting.title
    elif sort_by == "duration":
        order_col = Meeting.duration
    else:
        order_col = Meeting.date

    if sort_order == "asc":
        query = query.order_by(order_col.asc())
    else:
        query = query.order_by(order_col.desc())

    meetings = query.all()

    # Enrich with action item counts
    result = []
    for m in meetings:
        total = db.query(func.count(ActionItem.id)).filter(ActionItem.meeting_id == m.id).scalar()
        completed = db.query(func.count(ActionItem.id)).filter(
            ActionItem.meeting_id == m.id, ActionItem.completed == True
        ).scalar()
        meeting_dict = {
            "id": m.id,
            "title": m.title,
            "date": m.date,
            "duration": m.duration,
            "participants": m.participants,
            "summary": m.summary,
            "key_topics": m.key_topics,
            "meeting_type": m.meeting_type,
            "tags": m.tags,
            "created_at": m.created_at,
            "updated_at": m.updated_at,
            "action_item_count": total,
            "completed_action_items": completed,
        }
        result.append(meeting_dict)

    return result


def get_meeting_detail(db: Session, meeting_id: int):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        return None
    return meeting


def create_meeting(db: Session, data: MeetingCreate):
    now = datetime.utcnow().isoformat()
    meeting = Meeting(
        title=data.title,
        date=data.date,
        duration=data.duration,
        participants=data.participants,
        summary=data.summary,
        key_topics=data.key_topics,
        meeting_type=data.meeting_type or "general",
        tags=data.tags,
        created_at=now,
        updated_at=now,
    )
    db.add(meeting)
    db.flush()  # get meeting.id

    # Add transcript segments if provided
    if data.transcript_segments:
        for seg in data.transcript_segments:
            segment = TranscriptSegment(
                meeting_id=meeting.id,
                speaker=seg.speaker,
                text=seg.text,
                start_time=seg.start_time,
                end_time=seg.end_time,
                segment_order=seg.segment_order,
            )
            db.add(segment)

    # Add action items if provided
    if data.action_items:
        for item in data.action_items:
            action = ActionItem(
                meeting_id=meeting.id,
                text=item.text,
                assignee=item.assignee,
                due_date=item.due_date,
                created_at=now,
            )
            db.add(action)

    db.commit()
    db.refresh(meeting)
    return meeting


def update_meeting(db: Session, meeting_id: int, data: MeetingUpdate):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        return None

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(meeting, key, value)

    meeting.updated_at = datetime.utcnow().isoformat()
    db.commit()
    db.refresh(meeting)
    return meeting


def delete_meeting(db: Session, meeting_id: int):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        return False
    db.delete(meeting)
    db.commit()
    return True


def global_search(db: Session, query: str):
    search_term = f"%{query}%"
    results = []

    # Search meeting titles
    meetings = db.query(Meeting).filter(Meeting.title.ilike(search_term)).all()
    for m in meetings:
        results.append({
            "meeting_id": m.id,
            "meeting_title": m.title,
            "match_type": "title",
            "matched_text": m.title,
        })

    # Search summaries
    summaries = db.query(Meeting).filter(
        Meeting.summary.ilike(search_term),
        ~Meeting.title.ilike(search_term),
    ).all()
    for m in summaries:
        # Extract a snippet around the match
        idx = m.summary.lower().find(query.lower())
        start = max(0, idx - 50)
        end = min(len(m.summary), idx + len(query) + 50)
        snippet = ("..." if start > 0 else "") + m.summary[start:end] + ("..." if end < len(m.summary) else "")
        results.append({
            "meeting_id": m.id,
            "meeting_title": m.title,
            "match_type": "summary",
            "matched_text": snippet,
        })

    # Search transcripts
    segments = db.query(TranscriptSegment).filter(
        TranscriptSegment.text.ilike(search_term)
    ).all()
    for seg in segments:
        meeting = db.query(Meeting).filter(Meeting.id == seg.meeting_id).first()
        if meeting:
            results.append({
                "meeting_id": seg.meeting_id,
                "meeting_title": meeting.title,
                "match_type": "transcript",
                "matched_text": seg.text,
                "speaker": seg.speaker,
                "timestamp": seg.start_time,
            })

    # Search action items
    items = db.query(ActionItem).filter(
        ActionItem.text.ilike(search_term)
    ).all()
    for item in items:
        meeting = db.query(Meeting).filter(Meeting.id == item.meeting_id).first()
        if meeting:
            results.append({
                "meeting_id": item.meeting_id,
                "meeting_title": meeting.title,
                "match_type": "action_item",
                "matched_text": item.text,
            })

    return results

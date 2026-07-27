from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Meeting, TranscriptSegment
from ..schemas import TranscriptSegmentCreate, TranscriptSegmentResponse

router = APIRouter(prefix="/api/meetings", tags=["transcripts"])


@router.get("/{meeting_id}/transcript", response_model=list[TranscriptSegmentResponse])
def get_transcript(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    segments = (
        db.query(TranscriptSegment)
        .filter(TranscriptSegment.meeting_id == meeting_id)
        .order_by(TranscriptSegment.segment_order)
        .all()
    )
    return segments


@router.post(
    "/{meeting_id}/transcript",
    response_model=list[TranscriptSegmentResponse],
    status_code=201,
)
def add_transcript(
    meeting_id: int,
    segments: list[TranscriptSegmentCreate],
    db: Session = Depends(get_db),
):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    created = []
    for seg in segments:
        segment = TranscriptSegment(
            meeting_id=meeting_id,
            speaker=seg.speaker,
            text=seg.text,
            start_time=seg.start_time,
            end_time=seg.end_time,
            segment_order=seg.segment_order,
        )
        db.add(segment)
        created.append(segment)

    # Update meeting timestamp
    meeting.updated_at = datetime.utcnow().isoformat()
    db.commit()

    for seg in created:
        db.refresh(seg)

    return created

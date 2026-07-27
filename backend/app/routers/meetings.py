from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from ..database import get_db
from ..schemas import (
    MeetingCreate,
    MeetingUpdate,
    MeetingListResponse,
    MeetingDetailResponse,
)
from ..services.meeting_service import (
    get_meetings,
    get_meeting_detail,
    create_meeting,
    update_meeting,
    delete_meeting,
)

router = APIRouter(prefix="/api/meetings", tags=["meetings"])


@router.get("", response_model=list[MeetingListResponse])
def list_meetings(
    search: Optional[str] = Query(None),
    participant: Optional[str] = Query(None),
    meeting_type: Optional[str] = Query(None),
    tag: Optional[str] = Query(None),
    sort_by: str = Query("date", regex="^(date|title|duration)$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db),
):
    results = get_meetings(
        db,
        search=search,
        participant=participant,
        meeting_type=meeting_type,
        tag=tag,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    return results


@router.get("/{meeting_id}", response_model=MeetingDetailResponse)
def get_meeting(meeting_id: int, db: Session = Depends(get_db)):
    meeting = get_meeting_detail(db, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting


@router.post("", response_model=MeetingDetailResponse, status_code=201)
def create_new_meeting(data: MeetingCreate, db: Session = Depends(get_db)):
    meeting = create_meeting(db, data)
    return meeting


@router.put("/{meeting_id}", response_model=MeetingDetailResponse)
def update_existing_meeting(
    meeting_id: int, data: MeetingUpdate, db: Session = Depends(get_db)
):
    meeting = update_meeting(db, meeting_id, data)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting


@router.delete("/{meeting_id}", status_code=204)
def delete_existing_meeting(meeting_id: int, db: Session = Depends(get_db)):
    success = delete_meeting(db, meeting_id)
    if not success:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return None

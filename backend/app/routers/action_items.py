from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Meeting, ActionItem
from ..schemas import ActionItemCreate, ActionItemUpdate, ActionItemResponse

router = APIRouter(tags=["action_items"])


@router.get(
    "/api/meetings/{meeting_id}/action-items",
    response_model=list[ActionItemResponse],
)
def get_action_items(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    items = (
        db.query(ActionItem)
        .filter(ActionItem.meeting_id == meeting_id)
        .order_by(ActionItem.created_at)
        .all()
    )
    return items


@router.post(
    "/api/meetings/{meeting_id}/action-items",
    response_model=ActionItemResponse,
    status_code=201,
)
def create_action_item(
    meeting_id: int, data: ActionItemCreate, db: Session = Depends(get_db)
):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    item = ActionItem(
        meeting_id=meeting_id,
        text=data.text,
        assignee=data.assignee,
        due_date=data.due_date,
        created_at=datetime.utcnow().isoformat(),
    )
    db.add(item)
    meeting.updated_at = datetime.utcnow().isoformat()
    db.commit()
    db.refresh(item)
    return item


@router.put("/api/action-items/{item_id}", response_model=ActionItemResponse)
def update_action_item(
    item_id: int, data: ActionItemUpdate, db: Session = Depends(get_db)
):
    item = db.query(ActionItem).filter(ActionItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Action item not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)
    return item


@router.delete("/api/action-items/{item_id}", status_code=204)
def delete_action_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(ActionItem).filter(ActionItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Action item not found")

    db.delete(item)
    db.commit()
    return None

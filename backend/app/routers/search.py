from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import SearchResult
from ..services.meeting_service import global_search

router = APIRouter(prefix="/api/search", tags=["search"])


@router.get("", response_model=list[SearchResult])
def search(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    results = global_search(db, q)
    return results

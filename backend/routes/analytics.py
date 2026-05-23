from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from services.analytics_service import get_analytics_summary, get_recent_events
from security import verify_admin_key

router = APIRouter()

@router.get("/summary", dependencies=[Depends(verify_admin_key)])
def get_summary(db: Session = Depends(get_db)):
    return get_analytics_summary(db)

@router.get("/events", dependencies=[Depends(verify_admin_key)])
def get_events(db: Session = Depends(get_db)):
    return get_recent_events(db)

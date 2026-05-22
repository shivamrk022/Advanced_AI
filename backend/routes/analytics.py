from fastapi import APIRouter
from services.analytics_service import get_analytics_summary, get_recent_events

router = APIRouter()

@router.get("/summary")
def get_summary():
    return get_analytics_summary()

@router.get("/events")
def get_events():
    return get_recent_events()

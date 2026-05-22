from fastapi import APIRouter
from services.dashboard_service import get_dashboard_summary

router = APIRouter()

@router.get("/summary")
def get_user_dashboard():
    return get_dashboard_summary()

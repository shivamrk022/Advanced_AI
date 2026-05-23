from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from services.job_service import search_all_jobs

router = APIRouter()

@router.get("/search")
async def search_jobs_endpoint(
    keyword: str = Query("AI Engineer", description="Job search keyword"),
    location: Optional[str] = Query(None, description="Job location filter"),
    limit: int = Query(20, description="Max number of jobs to return")
):
    try:
        from services.analytics_service import track_event
        track_event("job_search", "jobs", {"keyword": keyword, "location": location})
        
        return search_all_jobs(keyword, location, limit)
    except Exception as e:
        import logging
        logging.getLogger(__name__).exception("Job search failed")
        raise HTTPException(status_code=500, detail="Job search failed. Please try again.")

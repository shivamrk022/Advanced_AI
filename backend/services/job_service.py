import requests
from datetime import datetime
from typing import List, Dict, Any

def fetch_remotive_jobs(keyword: str, location: str, limit: int) -> List[Dict[str, Any]]:
    jobs = []
    try:
        params = {"search": keyword}
        response = requests.get("https://remotive.com/api/remote-jobs", params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            for job in data.get("jobs", []):
                job_location = job.get("candidate_required_location", "").lower()
                if location and location.lower() not in job_location and "worldwide" not in job_location and "anywhere" not in job_location:
                    continue
                    
                jobs.append({
                    "title": job.get("title", "Unknown Title"),
                    "company": job.get("company_name", "Unknown Company"),
                    "location": job.get("candidate_required_location", "Remote"),
                    "type": job.get("job_type", "full_time").replace("_", " ").title(),
                    "url": job.get("url", ""),
                    "source": "remotive",
                    "posted_at": job.get("publication_date", ""),
                    "description": job.get("description", "")[:200] + "..." if job.get("description") else ""
                })
                if len(jobs) >= limit:
                    break
    except Exception as e:
        print(f"Remotive API error: {e}")
    return jobs

def fetch_arbeitnow_jobs(keyword: str, location: str, limit: int) -> List[Dict[str, Any]]:
    jobs = []
    try:
        response = requests.get("https://www.arbeitnow.com/api/job-board-api", timeout=10)
        if response.status_code == 200:
            data = response.json()
            for job in data.get("data", []):
                title = job.get("title", "").lower()
                desc = job.get("description", "").lower()
                company = job.get("company_name", "").lower()
                loc = job.get("location", "").lower()
                
                kw = keyword.lower()
                if kw in title or kw in desc or kw in company:
                    if location and location.lower() not in loc and not job.get("remote"):
                        continue
                    
                    jobs.append({
                        "title": job.get("title", "Unknown Title"),
                        "company": job.get("company_name", "Unknown Company"),
                        "location": job.get("location", "Remote") if not job.get("remote") else "Remote",
                        "type": "Full Time",
                        "url": job.get("url", ""),
                        "source": "arbeitnow",
                        "posted_at": str(job.get("created_at", "")),
                        "description": job.get("description", "")[:200] + "..." if job.get("description") else ""
                    })
                    if len(jobs) >= limit:
                        break
    except Exception as e:
        print(f"Arbeitnow API error: {e}")
    return jobs

def fetch_remoteok_jobs(keyword: str, location: str, limit: int) -> List[Dict[str, Any]]:
    jobs = []
    try:
        headers = {"User-Agent": "JobSearchApp/1.0"}
        url = f"https://remoteok.com/api?tag={keyword.replace(' ', '+')}"
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            for job in data:
                if "legal" in job:
                    continue
                loc = job.get("location", "").lower()
                if location and location.lower() not in loc and "worldwide" not in loc and "anywhere" not in loc:
                    continue
                    
                jobs.append({
                    "title": job.get("position", "Unknown Title"),
                    "company": job.get("company", "Unknown Company"),
                    "location": job.get("location", "Remote"),
                    "type": "Full Time",
                    "url": job.get("apply_url") or job.get("url", ""),
                    "source": "remoteok",
                    "posted_at": job.get("date", ""),
                    "description": job.get("description", "")[:200] + "..." if job.get("description") else ""
                })
                if len(jobs) >= limit:
                    break
    except Exception as e:
        print(f"RemoteOK API error: {e}")
    return jobs

def get_fallback_jobs(keyword: str, location: str) -> List[Dict[str, Any]]:
    kw_title = keyword.title() if keyword else "AI Developer"
    loc_title = location.title() if location else "India (Remote)"
    now_str = datetime.utcnow().isoformat() + "Z"
    
    return [
        {
            "title": f"Junior {kw_title}",
            "company": "Tech Innovators Inc.",
            "location": loc_title,
            "type": "Full Time",
            "url": "#",
            "source": "sample",
            "posted_at": now_str,
            "description": f"Looking for a motivated Junior {kw_title} to join our fast-growing startup in {loc_title}."
        },
        {
            "title": f"Senior {kw_title}",
            "company": "Global Data Systems",
            "location": "Remote",
            "type": "Full Time",
            "url": "#",
            "source": "sample",
            "posted_at": now_str,
            "description": f"We need an experienced {kw_title} with strong backend and database optimization skills."
        },
        {
            "title": "Data Analyst Intern",
            "company": "Analytics Nexus",
            "location": loc_title,
            "type": "Internship",
            "url": "#",
            "source": "sample",
            "posted_at": now_str,
            "description": "3-month internship focused on data pipelines and business intelligence."
        },
        {
            "title": "Full Stack Developer",
            "company": "Web Solutions Ltd.",
            "location": loc_title,
            "type": "Contract",
            "url": "#",
            "source": "sample",
            "posted_at": now_str,
            "description": "Contract role to help build out new user-facing features and improve backend architecture."
        },
        {
            "title": "ML Engineer Intern",
            "company": "AI Pioneers",
            "location": "Remote",
            "type": "Internship",
            "url": "#",
            "source": "sample",
            "posted_at": now_str,
            "description": "Work on cutting-edge deep learning models and natural language processing pipelines."
        }
    ]

def search_all_jobs(keyword: str, location: str, limit: int) -> dict:
    if not keyword or not keyword.strip():
        keyword = "AI Engineer"
        
    keyword = keyword.strip()
    location = location.strip() if location else ""
    
    if limit > 50:
        limit = 50
    elif limit < 1:
        limit = 20

    all_jobs = []
    sources = set()
    
    remotive = fetch_remotive_jobs(keyword, location, limit)
    all_jobs.extend(remotive)
    if remotive: sources.add("remotive")
        
    arbeitnow = fetch_arbeitnow_jobs(keyword, location, limit)
    all_jobs.extend(arbeitnow)
    if arbeitnow: sources.add("arbeitnow")
        
    remoteok = fetch_remoteok_jobs(keyword, location, limit)
    all_jobs.extend(remoteok)
    if remoteok: sources.add("remoteok")
        
    if not all_jobs:
        all_jobs = get_fallback_jobs(keyword, location)
        sources.add("sample")
        
    final_jobs = all_jobs[:limit]
    
    return {
        "jobs": final_jobs,
        "count": len(final_jobs),
        "source_summary": list(sources)
    }

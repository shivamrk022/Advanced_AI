from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.agent_service import run_agents

router = APIRouter()

class AgentRequest(BaseModel):
    task: str
    mode: str

@router.post("/run")
def run_agent_workflow(request: AgentRequest):
    if not request.task or not request.task.strip():
        raise HTTPException(status_code=400, detail="Task cannot be empty")
    
    valid_modes = ["business", "career", "research", "project"]
    if request.mode not in valid_modes:
        raise HTTPException(status_code=400, detail=f"Invalid mode. Allowed modes are: {', '.join(valid_modes)}")
    
    try:
        result = run_agents(request.task.strip(), request.mode)
        
        from database import track_event
        track_event("agent_run", "agents", {"mode": request.mode})
        
        return result
    except Exception as e:
        # We handle Groq errors inside the service with fallbacks, 
        # so this catch-all is just a safety net for unexpected crashes.
        raise HTTPException(status_code=500, detail=f"Agent workflow failed: {str(e)}")

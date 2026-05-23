import os
import logging
from fastapi import Header, HTTPException

logger = logging.getLogger(__name__)

def verify_admin_key(x_admin_key: str = Header(None)):
    admin_api_key = os.getenv("ADMIN_API_KEY")
    
    if not admin_api_key:
        # In local development or if not set, we might warn and allow, but in production we should ideally block.
        # Following instructions: "In local development, allow access but show warning in logs. In production/Render, require it."
        # If running on Render, standard practice is to assume production if environment variables are set. We can check if we're in prod.
        is_prod = os.getenv("RENDER") == "true" or os.getenv("NODE_ENV") == "production" or os.getenv("ENVIRONMENT") == "production"
        if is_prod:
            logger.error("ADMIN_API_KEY is missing in production environment!")
            raise HTTPException(status_code=500, detail="Server configuration error. Admin access disabled.")
        else:
            logger.warning("ADMIN_API_KEY is not set. Allowing admin access in development mode.")
            return True

    if x_admin_key != admin_api_key:
        logger.warning("Unauthorized access attempt to admin endpoint.")
        raise HTTPException(status_code=403, detail="Invalid or missing Admin API Key")
        
    return True

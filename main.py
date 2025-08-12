"""
Lead Agent - Main FastAPI Application
AI-Powered B2B Lead Generation Tool
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn
import os
from dotenv import load_dotenv
from loguru import logger

# Load environment variables
load_dotenv()

# Import routers (to be created)
# from app.routers import product_analysis, lead_generation, sequences, auth

# Create FastAPI application
app = FastAPI(
    title="Lead Agent API",
    description="AI-Powered B2B Lead Generation Tool",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS configuration
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Serve static files (your frontend)
app.mount("/static", StaticFiles(directory="static"), name="static")

# API Routes (to be implemented)
@app.get("/")
async def serve_frontend():
    """Serve the main frontend application"""
    return FileResponse("static/index.html")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app_name": os.getenv("APP_NAME", "Lead Agent"),
        "version": os.getenv("APP_VERSION", "1.0.0"),
        "environment": os.getenv("ENVIRONMENT", "development")
    }

# Import the AI service
from app.services.ai_service import AIAnalysisService

# Initialize AI service
ai_service = AIAnalysisService()

# Product Analysis endpoints
@app.post("/api/analyze-product")
async def analyze_product(product_data: dict):
    """
    Analyze product description and return target audience insights using Claude AI
    
    Expected payload:
    {
        "description": "Product description text..."
    }
    """
    try:
        description = product_data.get("description")
        if not description:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Product description is required"
            )
        
        if not description.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Product description cannot be empty"
            )
        
        # Validate API key first
        if not ai_service.validate_api_key():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="AI service is not properly configured. Please check API keys."
            )
        
        # Use Claude AI to analyze the product
        analysis_result = await ai_service.analyze_product(description)
        
        if not analysis_result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"AI analysis failed: {analysis_result.get('error', 'Unknown error')}"
            )
        
        return analysis_result
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error analyzing product: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to analyze product. Please try again."
        )

# Lead Generation endpoints
@app.post("/api/generate-leads")
async def generate_leads(criteria: dict):
    """
    Generate leads based on analysis criteria
    
    Expected payload:
    {
        "target_audience": {...},
        "markets": [...],
        "regions": [...],
        "limit": 50
    }
    """
    try:
        # TODO: Implement lead generation logic
        # This is where you'll integrate with lead generation APIs
        
        # Placeholder response
        leads = [
            {
                "id": 1,
                "name": "Sarah Johnson",
                "company": "TechFlow Solutions",
                "title": "Project Manager",
                "email": "sarah.j@techflow.io",
                "linkedin": "https://linkedin.com/in/sarahjohnson",
                "company_size": "150 employees",
                "industry": "Software Development",
                "location": "San Francisco, CA",
                "insight": "Recently expanded remote team to 50+ developers"
            },
            {
                "id": 2,
                "name": "Michael Chen",
                "company": "Nova Digital",
                "title": "Director of Operations",
                "email": "m.chen@novadigital.com",
                "linkedin": "https://linkedin.com/in/michaelchen",
                "company_size": "85 employees",
                "industry": "Marketing Agency",
                "location": "Austin, TX",
                "insight": "Managing 15+ client campaigns simultaneously"
            },
            {
                "id": 3,
                "name": "Emily Rodriguez",
                "company": "Spark Creative",
                "title": "Marketing Team Lead",
                "email": "e.rodriguez@sparkcreative.co",
                "linkedin": "https://linkedin.com/in/emilyrodriguez",
                "company_size": "45 employees",
                "industry": "Creative Agency",
                "location": "New York, NY",
                "insight": "Looking to streamline client collaboration workflows"
            }
        ]
        
        return {
            "success": True,
            "data": {
                "leads": leads,
                "total": len(leads),
                "generated_at": "2025-01-15T10:30:00Z"
            }
        }
        
    except Exception as e:
        logger.error(f"Error generating leads: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate leads"
        )

# Email Sequence endpoints
@app.post("/api/send-sequence")
async def send_email_sequence(sequence_data: dict):
    """
    Send email sequence to selected leads
    
    Expected payload:
    {
        "leads": [1, 2, 3],
        "subject": "Email subject",
        "template": "Email template with {variables}",
        "schedule": "immediate" or datetime
    }
    """
    try:
        leads = sequence_data.get("leads", [])
        subject = sequence_data.get("subject")
        template = sequence_data.get("template")
        
        if not leads or not subject or not template:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Leads, subject, and template are required"
            )
        
        # TODO: Implement email sending logic
        # This is where you'll integrate with SMTP or email service providers
        
        return {
            "success": True,
            "data": {
                "sequence_id": "seq_123456",
                "emails_sent": len(leads),
                "status": "scheduled",
                "sent_at": "2025-01-15T10:30:00Z"
            }
        }
        
    except Exception as e:
        logger.error(f"Error sending sequence: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send email sequence"
        )

if __name__ == "__main__":
    # Configure logging
    logger.add(
        "logs/leadagent.log",
        rotation="1 day",
        retention="30 days",
        level=os.getenv("LOG_LEVEL", "INFO")
    )
    
    # Run the application
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=os.getenv("DEBUG", "False").lower() == "true",
        log_level=os.getenv("LOG_LEVEL", "info").lower()
    )
    
"""
AI Service for Product Analysis using Claude API
"""

import os
import json
from typing import Dict, Any
from anthropic import Anthropic
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class AIAnalysisService:
    def __init__(self):
        self.client = Anthropic(
            api_key=os.getenv("ANTHROPIC_API_KEY")
        )
        
        if not os.getenv("ANTHROPIC_API_KEY"):
            raise ValueError("ANTHROPIC_API_KEY not found in environment variables")
    
    async def analyze_product(self, product_description: str) -> Dict[str, Any]:
        """
        Analyze a product description and return target audience insights
        
        Args:
            product_description (str): The product/service description to analyze
            
        Returns:
            Dict containing analysis results
        """
        
        # Create the prompt for Claude
        prompt = f"""
        You are a B2B lead generation expert. Analyze the following product/service description and provide detailed insights about the target audience and market opportunities.

        Product/Service Description:
        {product_description}

        Please provide your analysis in the following JSON format:
        {{
            "target_audience": {{
                "primary": "Primary target audience description",
                "industry": "Main industry vertical",
                "company_size": "Ideal company size (e.g., 50-500 employees)",
                "roles": ["Role 1", "Role 2", "Role 3"],
                "pain_points": ["Pain point 1", "Pain point 2", "Pain point 3"]
            }},
            "recommended_markets": [
                {{
                    "rank": 1,
                    "market": "Market name",
                    "description": "Why this market is ideal",
                    "potential": "High/Medium/Low"
                }},
                {{
                    "rank": 2,
                    "market": "Market name",
                    "description": "Why this market is ideal",
                    "potential": "High/Medium/Low"
                }},
                {{
                    "rank": 3,
                    "market": "Market name",
                    "description": "Why this market is ideal",
                    "potential": "High/Medium/Low"
                }}
            ],
            "target_regions": [
                {{
                    "region": "North America",
                    "score": 0.9,
                    "reasoning": "Why this region is good"
                }},
                {{
                    "region": "Europe",
                    "score": 0.8,
                    "reasoning": "Why this region is good"
                }},
                {{
                    "region": "Asia-Pacific",
                    "score": 0.7,
                    "reasoning": "Why this region is good"
                }}
            ],
            "marketing_angles": [
                "Key marketing message 1",
                "Key marketing message 2",
                "Key marketing message 3"
            ],
            "competitive_landscape": {{
                "main_competitors": ["Competitor 1", "Competitor 2", "Competitor 3"],
                "differentiation": "What makes this product unique"
            }}
        }}

        Respond only with the JSON, no additional text.
        """
        
        try:
            # Make the API call to Claude
            response = self.client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=2000,
                temperature=0.3,
                messages=[
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ]
            )
            
            # Extract the response content
            analysis_text = response.content[0].text
            
            # Parse the JSON response
            try:
                analysis_result = json.loads(analysis_text)
                return {
                    "success": True,
                    "data": analysis_result
                }
            except json.JSONDecodeError as e:
                # If JSON parsing fails, return a structured error
                return {
                    "success": False,
                    "error": "Failed to parse AI response",
                    "details": str(e),
                    "raw_response": analysis_text
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": "AI analysis failed",
                "details": str(e)
            }
    
    def validate_api_key(self) -> bool:
        """
        Validate that the API key is working
        
        Returns:
            bool: True if API key is valid
        """
        try:
            # Make a simple test call
            response = self.client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=10,
                messages=[
                    {
                        "role": "user", 
                        "content": "Hello"
                    }
                ]
            )
            return True
        except Exception:
            return False
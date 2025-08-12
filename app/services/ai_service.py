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
You are an elite B2B lead generation strategist with deep expertise in market analysis, buyer personas, and geographic expansion strategies.

MISSION: Analyze this product/service and provide laser-focused recommendations for the HIGHEST-CONVERTING prospects.

Product/Service Description:
{product_description}

ANALYSIS REQUIREMENTS:
- Identify the #1 most profitable company type to target
- Specify exact employee titles/roles who make buying decisions
- Focus on prospects with immediate need and available budget
- Provide data-driven geographic recommendations with market size insights
- Be extremely specific and actionable

Please provide your analysis in the following JSON format:
{{
    "target_audience": {{
        "primary_company_type": "The single most profitable company type to focus all efforts on",
        "company_characteristics": "Specific traits that make them ideal (size, growth stage, tech stack, etc.)",
        "industry": "Primary industry vertical with highest conversion rates",
        "company_size": "Optimal company size range (employee count) with reasoning",
        "revenue_range": "Annual revenue range of ideal prospects",
        "growth_stage": "Business maturity level (startup, growth, enterprise, etc.)",
        "primary_decision_maker": {{
            "title": "Exact job title of person who signs contracts",
            "department": "Which department they work in",
            "seniority_level": "C-level, VP, Director, Manager, etc.",
            "typical_background": "Their professional background/experience",
            "pain_points": ["Their top 3 specific frustrations this product solves"],
            "success_metrics": ["What they're measured on that this product improves"]
        }},
        "secondary_influencers": [
            {{
                "title": "Job title of key influencer #1",
                "role_in_decision": "How they influence the buying process",
                "what_they_care_about": "Their primary concerns/interests"
            }},
            {{
                "title": "Job title of key influencer #2", 
                "role_in_decision": "Their influence on the decision",
                "what_they_care_about": "What motivates them"
            }}
        ],
        "buying_triggers": ["Specific events that trigger immediate need", "Seasonal factors", "Business milestones that create urgency"],
        "budget_authority": "Who controls the budget and typical approval process",
        "sales_cycle_length": "Expected time from first contact to closed deal"
    }},
    "additional_target_audiences": [
        {{
            "rank": 1,
            "company_type": "Second-best company type to target",
            "why_target_them": "Specific reasons why they're high-value prospects with conversion potential"
        }},
        {{
            "rank": 2,
            "company_type": "Third company type worth pursuing",
            "why_target_them": "Business case for targeting this segment"
        }},
        {{
            "rank": 3,
            "company_type": "Fourth target company type",
            "why_target_them": "Strategic reasoning for this market segment"
        }},
        {{
            "rank": 4,
            "company_type": "Fifth target company type",
            "why_target_them": "Why this segment represents good opportunity"
        }},
        {{
            "rank": 5,
            "company_type": "Sixth target company type",
            "why_target_them": "Justification for targeting this market"
        }}
    ],
    "top_target_countries": [
        {{
            "rank": 1,
            "country": "Most important country to focus on",
            "market_size_insight": "Specific data about market size, growth rate, or adoption metrics that justify #1 ranking"
        }},
        {{
            "rank": 2,
            "country": "Second priority country",
            "market_size_insight": "Quantitative reasoning with numbers/statistics for this ranking"
        }},
        {{
            "rank": 3,
            "country": "Third priority country",
            "market_size_insight": "Data-driven justification with market metrics"
        }},
        {{
            "rank": 4,
            "country": "Fourth priority country", 
            "market_size_insight": "Numerical insights supporting this country's potential"
        }},
        {{
            "rank": 5,
            "country": "Fifth priority country",
            "market_size_insight": "Market data and growth statistics justifying inclusion"
        }},
        {{
            "rank": 6,
            "country": "Sixth priority country",
            "market_size_insight": "Quantitative market analysis for this country"
        }},
        {{
            "rank": 7,
            "country": "Seventh priority country",
            "market_size_insight": "Market size data and business environment factors"
        }},
        {{
            "rank": 8,
            "country": "Eighth priority country",
            "market_size_insight": "Statistical justification for targeting this market"
        }},
        {{
            "rank": 9,
            "country": "Ninth priority country",
            "market_size_insight": "Data-backed reasoning for including this country"
        }}
    ],
    "outreach_strategy": {{
        "primary_messaging": "The #1 message that resonates with the primary decision maker",
        "pain_point_messaging": "How to articulate their biggest pain point",
        "value_proposition": "Clear ROI/value statement with numbers if possible",
        "social_proof_needed": "Type of case studies/testimonials that would convince them",
        "best_communication_channels": ["Email", "LinkedIn", "Phone", "etc."],
        "optimal_outreach_timing": "Best days/times to reach this audience"
    }},
    "competitive_positioning": {{
        "main_competitors": ["Top 3 direct competitors they probably know"],
        "our_differentiation": "How to position against competition",
        "competitive_weaknesses": "Competitor gaps we can exploit"
    }}
}}

CRITICAL: Be extremely specific with company types, job titles, and provide actual market data/statistics where possible. Focus on actionable intelligence that can be used immediately for prospecting.

Respond only with the JSON, no additional text.
"""
        
        try:
            # Make the API call to Claude
            response = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
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
                model="claude-3-5-sonnet-20241022",
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
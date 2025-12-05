import os
import requests
import random # Used for calorie simulation
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# ----------------------------------------------------
# 1. FASTAPI SETUP (DEFINED FIRST TO AVOID ERRORS)
# ----------------------------------------------------

app = FastAPI(title="AI Food Calorie Microservice", version="1.0") # <-- THIS IS THE CRITICAL LINE

# CORS Configuration - IMPORTANT for MERN stack communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for testing; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    """Service Health Check."""
    return {"message": "AI Food Calorie Counter is running. Go to /docs."}

# ----------------------------------------------------
# 2. PYDANTIC MODELS (The MERN Contract)
# ----------------------------------------------------

class CalorieInput(BaseModel):
    """Input model for the API."""
    user_id: str
    media_url: str
    
class CalorieOutput(BaseModel):
    """Output model for the API."""
    user_id: str
    total_calories_kcal: int
    items_recognized: List[str]
    confidence_score: float

# ----------------------------------------------------
# 3. CORE LOGIC: IMAGE TO CALORIE ESTIMATION
# ----------------------------------------------------

def estimate_food_calories(media_url: str, user_id: str) -> dict:
    """
    Handles image download, food recognition, and calorie estimation (Simulated).
    """
    temp_file_name = f"temp_food_{user_id}_{os.path.basename(media_url)}"
    
    # 1. Download Media File
    try:
        response = requests.get(media_url, stream=True)
        response.raise_for_status()
        with open(temp_file_name, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
    except Exception as e:
        if os.path.exists(temp_file_name): os.remove(temp_file_name)
        raise HTTPException(status_code=400, detail=f"Failed to download/open media: {e}")

    # 2. --- SIMULATION / PLACEHOLDER LOGIC ---
    try:
        # Simulate recognition output
        recognized_foods_list = random.choice([
            ["Chicken Breast (150g)", "Salad (200g)"],
            ["Pasta with Sauce (350g)"],
            ["Scrambled Eggs (2)", "Toast (1 slice)"],
            ["Chole Bhature (1 serving)"]
        ])
        
        # Simulate calorie lookup
        if "Chicken" in recognized_foods_list[0]:
            total_calories = 480
        elif "Pasta" in recognized_foods_list[0]:
            total_calories = 650
        elif "Eggs" in recognized_foods_list[0]:
            total_calories = 250
        elif "Chole Bhature" in recognized_foods_list[0]:
            total_calories = 550
        else:
            total_calories = 95
        
        return {
            "total_calories_kcal": total_calories,
            "items_recognized": recognized_foods_list,
            "confidence_score": round(random.uniform(0.80, 0.99), 2)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calorie estimation failed: {e}")
        
    finally:
        # 3. Cleanup: Guarantee removal of the downloaded file
        if os.path.exists(temp_file_name):
            os.remove(temp_file_name)


@app.post("/calculate_calories", response_model=CalorieOutput)
def calculate_calories_endpoint(input_data: CalorieInput):
    """
    POST endpoint to receive an image URL and return the estimated calorie count.
    """
    if not input_data.media_url.startswith("http"):
        raise HTTPException(status_code=400, detail="media_url must be a valid HTTP/HTTPS link.")
    
    result = estimate_food_calories(input_data.media_url, input_data.user_id)
    
    return CalorieOutput(user_id=input_data.user_id, **result)
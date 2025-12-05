import numpy as np
import os
import requests
import random # Used for calorie simulation
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ----------------------------------------------------
# 1. PYDANTIC MODELS (The MERN Contract)
# ----------------------------------------------------

# --- Calorie Input/Output ---
class CalorieInput(BaseModel):
    """Data structure for the MERN app to send an image URL."""
    user_id: str
    media_url: str
    
class CalorieOutput(BaseModel):
    """Data structure for the AI service to return the results."""
    user_id: str
    total_calories_kcal: int
    items_recognized: list[str]
    confidence_score: float

# ----------------------------------------------------
# 2. FASTAPI SETUP
# ----------------------------------------------------

# Initialize the FastAPI app
app = FastAPI(title="AI Food Calorie Microservice", version="1.0")

# CORS Configuration (Allows frontend/backend communication)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Optional Base Route for status check
@app.get("/")
def read_root():
    """Confirms the service is running."""
    return {"message": "AI Food Calorie Microservice is running. Go to /docs to test the endpoint."}

# ----------------------------------------------------
# 3. AI CALORIE ESTIMATION LOGIC (/calculate_calories)
# ----------------------------------------------------

def estimate_food_calories(media_url: str, user_id: str) -> dict:
    """
    SIMULATED: Handles image download, food recognition, and calorie estimation.
    
    In a real-world scenario, this is where you integrate a:
    1. Food Recognition Model (e.g., fine-tuned YOLO or CNN).
    2. Nutrition Database API (e.g., USDA FoodData Central, CalorieMama, Spike).
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
        # Simulate recognition output (Food and estimated portion size)
        recognized_foods_list = random.choice([
            ["Salad (200g)", "Chicken Breast (150g)"],
            ["Pasta with Sauce (350g)"],
            ["Scrambled Eggs (2)"],
            ["Apple (1 large)"]
        ])
        
        # Simulate calorie lookup based on recognized item
        total_calories = 0
        if "Chicken" in recognized_foods_list[0]:
            total_calories = 480
        elif "Pasta" in recognized_foods_list[0]:
            total_calories = 650
        elif "Eggs" in recognized_foods_list[0]:
            total_calories = 180
        else:
            total_calories = 95
        
        return {
            "total_calories_kcal": total_calories,
            "items_recognized": recognized_foods_list,
            "confidence_score": round(random.uniform(0.75, 0.99), 2)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calorie estimation failed: {e}")
        
    finally:
        # Guarantee removal of the downloaded file
        if os.path.exists(temp_file_name):
            os.remove(temp_file_name)


@app.post("/calculate_calories", response_model=CalorieOutput)
def calculate_calories_endpoint(input_data: CalorieInput):
    """
    Receives an image URL, simulates food recognition, and returns calorie estimation.
    """
    if not input_data.media_url.startswith("http"):
        raise HTTPException(status_code=400, detail="media_url must be a valid HTTP/HTTPS link.")
    
    result = estimate_food_calories(input_data.media_url, input_data.user_id)
    
    return CalorieOutput(user_id=input_data.user_id, **result)

# ----------------------------------------------------
# EXECUTION
# ----------------------------------------------------
# To run this file (assuming it's named 'calorie_service.py'):
# uvicorn calorie_service:app --reload
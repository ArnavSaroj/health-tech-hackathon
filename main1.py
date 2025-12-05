import cv2
import numpy as np
import os
import requests
import torch
from ultralytics import YOLO 
from transformers import pipeline # For Motivation/Sentiment
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ----------------------------------------------------
# 1. CONFIGURATION AND MODEL INITIALIZATION
# ----------------------------------------------------

# Scoring Model (YOLOv8-Pose)
YOLO_MODEL_NAME = "yolov8n-pose.pt"
try:
    pose_model = YOLO(YOLO_MODEL_NAME)
except Exception as e:
    print(f"Error loading YOLO model: {e}")
    raise

# Motivation Model (Sentiment Analysis for user mood)
# Using 'distilbert-base-uncased-finetuned-sst-2-english' - fast and accurate for positive/negative classification
try:
    sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
except Exception as e:
    print(f"Error loading Sentiment Model: {e}")
    # Still allow the server to run if the scoring part is the priority
    sentiment_analyzer = None 

# Scoring Thresholds
DOWN_THRESHOLD = 100 
UP_THRESHOLD = 160   

# ----------------------------------------------------
# 2. Pydantic Models (The MERN Contract)
# ----------------------------------------------------

# --- A. Scoring Input/Output ---
class ExerciseInput(BaseModel):
    user_id: str
    media_url: str
    exercise_type: str = "squat" 
    
class ScoringOutput(BaseModel):
    user_id: str
    score: int
    message: str
    valid: bool
    reps_counted: int

# --- B. Motivation Input/Output ---
class MotivationInput(BaseModel):
    user_id: str
    last_score: int          # The score from the last exercise (0-100)
    user_mood_text: str      # Text input from user (e.g., "I feel lazy today")
    recent_activity_level: str # e.g., "High", "Low", "Consistent"

class MotivationOutput(BaseModel):
    user_id: str
    motivational_message: str
    tone: str # e.g., "Empathetic", "Challenging", "Encouraging"

# ----------------------------------------------------
# 3. FastAPI Setup and Utility Functions
# ----------------------------------------------------

app = FastAPI(title="AI Fitness Coaching Microservice", version="2.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def calculate_angle(a, b, c):
    """Calculates the angle (in degrees) between three 2D points."""
    a = np.array(a); b = np.array(b); c = np.array(c)
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    if angle > 180.0: angle = 360 - angle
    return angle

# ----------------------------------------------------
# 4. ENDPOINT 1: AI SCORING LOGIC (/score_exercise)
# ----------------------------------------------------

def process_media_for_score(media_url: str, user_id: str) -> dict:
    """Handles media download, YOLO processing, and squat scoring."""
    temp_file_name = f"temp_score_{user_id}_{os.path.basename(media_url)}"
    
    # --- File Download Logic ---
    try:
        response = requests.get(media_url, stream=True)
        response.raise_for_status()
        with open(temp_file_name, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        cap = cv2.VideoCapture(temp_file_name) 
        if not cap.isOpened():
            return {"score": 0, "message": "Media could not be decoded.", "valid": False, "reps_counted": 0}

    except Exception as e:
        if os.path.exists(temp_file_name): os.remove(temp_file_name)
        raise HTTPException(status_code=400, detail=f"Failed to download/open media: {e}")

    # --- YOLO Processing and Scoring Logic (Squat) ---
    rep_counter = 0; stage = "up"; max_depth_score = 0
    try:
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        for _ in range(total_frames):
            success, image = cap.read()
            if not success: break
            
            results = pose_model(image, verbose=False, show=False) 
            
            if results and results[0].keypoints.xyn.shape[1] > 0:
                keypoints_array = results[0].keypoints.xyn.cpu().numpy()[0]
                
                # YOLO Keypoints: 6=Hip, 8=Knee, 10=Ankle (Right Side)
                hip = keypoints_array[6]; knee = keypoints_array[8]; ankle = keypoints_array[10]
                knee_angle = calculate_angle(hip, knee, ankle)
                
                # Squat Rep/Depth Logic
                if knee_angle < DOWN_THRESHOLD:
                    stage = "down"
                    max_depth_score = max(max_depth_score, DOWN_THRESHOLD - knee_angle) 
                
                if knee_angle > UP_THRESHOLD and stage == 'down':
                    stage = "up"
                    rep_counter += 1
            
        cap.release()

        # Final Score Calculation
        final_score = min(100, (rep_counter * 10) + int(max_depth_score * 2))
        
        if rep_counter >= 3 and final_score >= 80:
            msg = f"Excellent! {rep_counter} quality reps, Score: {final_score}."
            return {"score": final_score, "message": msg, "valid": True, "reps_counted": rep_counter}
        else:
            msg = f"Needs depth/reps. Reps: {rep_counter}. Max depth points: {int(max_depth_score * 2)}."
            return {"score": final_score, "message": msg, "valid": False, "reps_counted": rep_counter}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal processing error: {e}")
        
    finally:
        if os.path.exists(temp_file_name): os.remove(temp_file_name)


@app.post("/score_exercise", response_model=ScoringOutput)
def score_exercise_endpoint(input_data: ExerciseInput):
    """Processes exercise media and returns the score for staking/rewards."""
    if not input_data.media_url.startswith("http"):
        raise HTTPException(status_code=400, detail="media_url must be a valid HTTP/HTTPS link.")
    
    result = process_media_for_score(input_data.media_url, input_data.user_id)
    return ScoringOutput(user_id=input_data.user_id, **result)


# ----------------------------------------------------
# 5. ENDPOINT 2: AI PERSONALIZATION LOGIC (/generate_motivation)
# ----------------------------------------------------

@app.post("/generate_motivation", response_model=MotivationOutput)
def generate_motivation_endpoint(input_data: MotivationInput):
    """Generates a personalized motivational message based on user data."""
    if not sentiment_analyzer:
        raise HTTPException(status_code=503, detail="Motivation model is not loaded.")

    # 1. Emotional Context (NLP)
    sentiment_result = sentiment_analyzer(input_data.user_mood_text)[0]
    is_positive = sentiment_result['label'] == 'POSITIVE'
    
    # 2. Contextual Logic (Rule Engine)
    score = input_data.last_score
    activity = input_data.recent_activity_level.lower()
    
    # Default message and tone
    tone = "Encouraging"
    message = "Great to see you here! Consistency is the key to all progress."

    # --- Rule Set 1: Low Score / Negative Mood ---
    if score < 70 and not is_positive:
        tone = "Empathetic"
        message = (f"It's alright to feel discouraged after a score of {score}. "
                   "A champion's secret is showing up even when you don't feel like it. "
                   "Focus on just one perfect rep today.")

    # --- Rule Set 2: High Score / Consistent Activity ---
    elif score >= 90 and activity == 'consistent':
        tone = "Challenging"
        message = (f"Awesome consistency! You crushed it with {score}. "
                   "Now, what's the next goal? Time to increase the challenge.")

    # --- Rule Set 3: High Score / Low Activity (Needs a push) ---
    elif score >= 80 and activity == 'low':
        tone = "Aspirational"
        message = (f"That {score} shows you have the skill! Don't let that talent go to waste. "
                   "A small habit breakthrough this week will change everything.")
    
    # --- Rule Set 4: Low Score / Positive Mood (Needs correction) ---
    elif score < 70 and is_positive:
        tone = "Technical"
        message = (f"Your attitude is perfect! Now let's match that effort with form. "
                   "Remember to focus on getting that knee angle below 90 degrees for max depth.")
        
    return MotivationOutput(
        user_id=input_data.user_id,
        motivational_message=message,
        tone=tone
    )

# ----------------------------------------------------
# Execution
# Run in terminal: uvicorn ai_full_service:app --reload
# ----------------------------------------------------
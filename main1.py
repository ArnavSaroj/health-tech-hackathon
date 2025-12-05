import cv2
import numpy as np
import math
import os
import requests
from ultralytics import YOLO 
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ----------------------------------------------------
# 1. Configuration and Model Initialization
# ----------------------------------------------------
# YOLO Pose Model (downloads the first time, uses the nano model for speed)
MODEL_NAME = "yolov8n-pose.pt"
try:
    pose_model = YOLO(MODEL_NAME)
except Exception as e:
    print(f"Error loading YOLO model: {e}. Check internet connection.")
    # Raise the error immediately to prevent the server from starting with a broken model
    raise

# Thresholds for Squat Counting (Degrees)
DOWN_THRESHOLD = 100 
UP_THRESHOLD = 160   

# ----------------------------------------------------
# 2. Pydantic Models (The API Contract with MERN)
# ----------------------------------------------------

class ExerciseInput(BaseModel):
    """
    Input model: Data sent from the MERN backend to this FastAPI service.
    Note: The MERN app should handle file storage (S3/IPFS) and send the URL.
    """
    user_id: str
    media_url: str
    exercise_type: str = "squat" 
    
class ScoringOutput(BaseModel):
    """
    Output model: Standardized JSON response returned to the MERN backend.
    """
    user_id: str
    score: int
    message: str
    valid: bool
    reps_counted: int

# ----------------------------------------------------
# 3. FastAPI Setup and CORS Configuration
# ----------------------------------------------------
app = FastAPI(title="YOLO AI Fitness Scorer", version="1.0.1")

# Configure CORS: ESSENTIAL for cross-origin communication with the Node.js server
# Replace "http://localhost:3000" with the actual address of your MERN frontend/backend server in production
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allowing all origins for simple testing/development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------
# 4. Core Calculation Functions
# ----------------------------------------------------

def calculate_angle(a, b, c):
    """Calculates the angle (in degrees) between three 2D points (NumPy)."""
    a = np.array(a); b = np.array(b); c = np.array(c)
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    if angle > 180.0: angle = 360 - angle
    return angle

def process_media_for_score(media_url: str, user_id: str) -> dict:
    """Handles media download, YOLO processing, and scoring."""
    temp_file_name = f"temp_{user_id}_{os.path.basename(media_url)}"
    
    # 1. Download Media File
    try:
        # Stream the file content and save it locally for OpenCV to read
        response = requests.get(media_url, stream=True)
        response.raise_for_status() # Raise exception for bad status codes (4xx or 5xx)
        with open(temp_file_name, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        cap = cv2.VideoCapture(temp_file_name) 
        if not cap.isOpened():
            return {"score": 0, "message": "Media could not be decoded.", "valid": False, "reps_counted": 0}

    except Exception as e:
        if os.path.exists(temp_file_name): os.remove(temp_file_name)
        raise HTTPException(status_code=400, detail=f"Failed to download/open media from URL: {e}")

    # 2. YOLO Processing and Scoring Logic
    rep_counter = 0; stage = "up"; max_depth_score = 0
    
    try:
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        for _ in range(total_frames):
            success, image = cap.read()
            if not success: break
            
            # Flip image for side view analysis if required by your data
            image = cv2.flip(image, 1) 
            results = pose_model(image, verbose=False, show=False) 

            if results and results[0].keypoints.xyn.shape[1] > 0:
                keypoints_array = results[0].keypoints.xyn.cpu().numpy()[0]
                
                # Use YOLO keypoints: 6=Hip, 8=Knee, 10=Ankle (Right Side)
                hip = keypoints_array[6]; knee = keypoints_array[8]; ankle = keypoints_array[10]
                
                knee_angle = calculate_angle(hip, knee, ankle)
                
                # Squat Logic
                if knee_angle < DOWN_THRESHOLD:
                    stage = "down"
                    max_depth_score = max(max_depth_score, DOWN_THRESHOLD - knee_angle) 
                
                if knee_angle > UP_THRESHOLD and stage == 'down':
                    stage = "up"
                    rep_counter += 1
            
        cap.release()

        # 3. Final Score Calculation
        final_score = min(100, (rep_counter * 10) + int(max_depth_score * 2))
        
        if rep_counter >= 3 and final_score >= 80:
            return {"score": final_score, "message": f"Excellent! {rep_counter} reps, Score: {final_score}.", "valid": True, "reps_counted": rep_counter}
        else:
            return {"score": final_score, "message": f"Needs more depth or reps. Reps: {rep_counter}.", "valid": False, "reps_counted": rep_counter}

    except IndexError:
        raise HTTPException(status_code=422, detail="Pose estimation failed. User not visible or media too low quality.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal processing error: {e}")
        
    finally:
        # Guarantee removal of the downloaded file
        if os.path.exists(temp_file_name):
            os.remove(temp_file_name)


# ----------------------------------------------------
# 5. API Endpoint (The Integration Point)
# ----------------------------------------------------

@app.post("/score_exercise", response_model=ScoringOutput)
def score_exercise_endpoint(input_data: ExerciseInput):
    """
    Receives JSON from the MERN backend, processes the exercise media, and returns the score.
    """
    # 1. Basic Input Validation
    if not input_data.media_url.startswith("http"):
        raise HTTPException(status_code=400, detail="media_url must be a valid HTTP/HTTPS link.")
    
    # 2. Run the Core Logic
    # The process_media_for_score function handles all exceptions internally
    result = process_media_for_score(input_data.media_url, input_data.user_id)
    
    # 3. Return the Standardized Output
    return ScoringOutput(user_id=input_data.user_id, **result)

# ----------------------------------------------------
# Execution
# Run in terminal: uvicorn main:app --reload
# ----------------------------------------------------
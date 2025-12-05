import cv2
import numpy as np
import math
from ultralytics import YOLO # Uses the YOLOv8/11 Pose model

# --- 1. Load YOLO Model ---
# Uses the smallest, fastest model. It will download the first time you run it.
model = YOLO("yolov8n-pose.pt")

# --- 2. Angle Calculation Function (REUSABLE) ---
def calculate_angle(a, b, c):
    """Calculates the angle (in degrees) between three 2D points (e.g., Hip, Knee, Ankle)."""
    a = np.array(a)  # First point
    b = np.array(b)  # Mid point (vertex)
    c = np.array(c)  # End point
    
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    
    if angle > 180.0:
        angle = 360 - angle
        
    return angle

# --- 3. Main Webcam Processing Loop ---
def run_webcam_scorer():
    # 0 is usually the default camera ID
    cap = cv2.VideoCapture(0) 

    # --- Scoring Variables ---
    rep_counter = 0
    stage = None # 'up' or 'down'
    max_depth_score = 0 # Tracks the lowest knee angle achieved for form score
    
    # Text appearance for the score overlay
    font = cv2.FONT_HERSHEY_SIMPLEX
    
    while cap.isOpened():
        success, image = cap.read()
        if not success:
            print("Ignoring empty camera frame.")
            break
        
        # 1. YOLO Inference (Pose Estimation)
        # show=False prevents YOLO from opening its own separate window
        results = model(image, verbose=False, show=False) 

        # We assume only one person is being tracked (results[0])
        if results and results[0].keypoints.xyn.shape[1] > 0:
            
            # Extract keypoints (normalized coordinates: 0 to 1)
            # [0] selects the first detected person
            keypoints_array = results[0].keypoints.xyn.cpu().numpy()[0]
            
            try:
                # --- YOLOv8/11 Keypoint Indices for a Squat (Right Side) ---
                # 6 = Right Hip, 8 = Right Knee, 10 = Right Ankle
                hip = keypoints_array[6]
                knee = keypoints_array[8]
                ankle = keypoints_array[10]
                
                # Convert normalized coordinates (0-1) to pixel coordinates for text placement
                h, w, c = image.shape
                knee_pixel = (int(knee[0] * w), int(knee[1] * h))

                # Calculate the knee angle
                knee_angle = calculate_angle(hip, knee, ankle)
                
                # --- Squat Repetition/Depth Logic ---
                if knee_angle < 100:
                    stage = "down"
                    # Calculate depth score (lower angle = better score)
                    max_depth_score = max(max_depth_score, 100 - knee_angle) 
                
                if knee_angle > 160 and stage == 'down':
                    stage = "up"
                    rep_counter += 1
                
                # Draw the angle on the screen
                cv2.putText(image, f"Angle: {int(knee_angle)}", knee_pixel, font, 0.7, (0, 255, 255), 2, cv2.LINE_AA)

            except IndexError:
                # Handle cases where keypoints are missing or occluded
                cv2.putText(image, "Adjust View: Pose not fully visible", (10, 30), font, 0.7, (0, 0, 255), 2, cv2.LINE_AA)
            
        # Draw the pose skeleton overlay using YOLO's built-in drawing
        image = results[0].plot(img=image) 

        # Display Final Score and Status
        cv2.putText(image, f"REPS: {rep_counter}", (10, 70), font, 1.5, (0, 255, 0), 4, cv2.LINE_AA)
        cv2.putText(image, f"STAGE: {stage}", (10, 120), font, 1.0, (255, 255, 0), 2, cv2.LINE_AA)

        # Show the processed frame
        cv2.imshow('Virtual Squat Tracker', image)

        # Break loop on 'q' press
        if cv2.waitKey(5) & 0xFF == ord('q'):
            break

    # --- Clean up ---
    cap.release()
    cv2.destroyAllWindows()
    
    # Calculate Final Score for logging
    final_score = min(100, (rep_counter * 10) + int(max_depth_score * 2))
    print("-" * 50)
    print(f"Final Reps Counted: {rep_counter}")
    print(f"Max Depth Achieved: {int(max_depth_score)} points")
    print(f"Final Calculated Score: {final_score}/100")
    print("-" * 50)

if __name__ == "__main__":
    run_webcam_scorer()
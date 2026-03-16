import cv2
import torch
import numpy as np
from models.efficientnetv2_model import EfficientNetV2Model
from ensemble.weighted_fusion import weighted_fusion
from bio_signals.blink_detector import detect_blinks
from bio_signals.rppg_extractor import extract_rppg

# ----------------------------
# Load Model (once)
# ----------------------------
model = EfficientNetV2Model()
model.eval()

# ----------------------------
# Frame Extraction (video only)
# ----------------------------
def extract_frames(video_path, max_frames=20):
    cap = cv2.VideoCapture(video_path)
    frames = []
    count = 0
    while cap.isOpened() and count < max_frames:
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.resize(frame, (224, 224))
        frames.append(frame)
        count += 1
    cap.release()
    return frames

# ----------------------------
# Frame Prediction
# ----------------------------
def predict_frames(frames):
    predictions = []
    for frame in frames:
        img = torch.tensor(frame).permute(2, 0, 1).float() / 255
        img = img.unsqueeze(0)
        with torch.no_grad():
            output = model(img)
        prob = torch.softmax(output, dim=1)
        predictions.append(prob.numpy()[0])
    predictions = np.array(predictions)
    return np.mean(predictions, axis=0)

# ----------------------------
# Bio Signal Score (video only)
# ----------------------------
def bio_signal_score(video_path):
    blink_count = detect_blinks(video_path)
    rppg_signal = extract_rppg(video_path)
    rppg_variation = np.std(rppg_signal)

    # Simple heuristic scoring
    blink_score = 0.5 if blink_count > 3 else 0.2
    rppg_score = 0.5 if rppg_variation > 1 else 0.2

    severity_score = blink_score + rppg_score  # for frontend severity color
    return np.array([blink_score, rppg_score]), severity_score

# ----------------------------
# Analyze Video
# ----------------------------
def analyze_video(video_path):
    print("[INFO] Extracting frames...")
    frames = extract_frames(video_path)

    print("[INFO] Running model prediction...")
    model_pred = predict_frames(frames)

    print("[INFO] Extracting biological signals...")
    bio_pred, severity_score = bio_signal_score(video_path)

    # Dummy 3rd model (optional)
    dummy_pred = np.array([0.5, 0.5])

    label, score = weighted_fusion(model_pred, bio_pred, dummy_pred)
    result = "FAKE" if label == 1 else "REAL"

    # Frame-by-frame results
    frame_results = []
    for i, frame in enumerate(frames):
        prob = predict_frames([frame])
        frame_results.append({
            "frame": i + 1,
            "prediction": "FAKE" if np.argmax(prob) == 1 else "REAL",
            "confidence": float(np.max(prob))
        })

    return {
        "prediction": result,
        "confidence": float(np.max(score)),
        "severity_score": severity_score,
        "frames": frame_results
    }

# ----------------------------
# Analyze Image
# ----------------------------
def analyze_image(image_path):
    img = cv2.imread(image_path)
    img = cv2.resize(img, (224, 224))
    img_tensor = torch.tensor(img).permute(2, 0, 1).float() / 255
    img_tensor = img_tensor.unsqueeze(0)

    with torch.no_grad():
        output = model(img_tensor)

    prob = torch.softmax(output, dim=1).numpy()[0]

    # For images, no bio-signal
    bio_pred = np.array([0.0, 0.0])
    severity_score = 0.0
    dummy_pred = np.array([0.5, 0.5])

    label, score = weighted_fusion(prob, bio_pred, dummy_pred)
    result = "FAKE" if label == 1 else "REAL"

    return {
        "prediction": result,
        "confidence": float(np.max(score)),
        "severity_score": severity_score,
        "frames": [{
            "frame": 1,
            "prediction": result,
            "confidence": float(np.max(score))
        }]
    }

# ----------------------------
# Main Inference Function
# ----------------------------
def analyze_media(path, media_type='video'):
    """
    media_type: 'video' or 'image'
    """
    if media_type == 'video':
        return analyze_video(path)
    elif media_type == 'image':
        return analyze_image(path)
    else:
        raise ValueError("Invalid media type. Must be 'video' or 'image'.")
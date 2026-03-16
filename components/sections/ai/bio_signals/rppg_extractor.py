import cv2
import numpy as np

def extract_rppg(video_path):

    cap = cv2.VideoCapture(video_path)

    signals = []

    while cap.isOpened():

        ret, frame = cap.read()

        if not ret:
            break

        green_channel = frame[:, :, 1]

        signals.append(np.mean(green_channel))

    cap.release()

    signals = np.array(signals)

    return signals
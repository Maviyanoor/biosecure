import cv2
import mediapipe as mp

mp_face_mesh = mp.solutions.face_mesh

def detect_blinks(video_path):

    cap = cv2.VideoCapture(video_path)

    blink_count = 0

    with mp_face_mesh.FaceMesh() as face_mesh:

        while cap.isOpened():
            ret, frame = cap.read()

            if not ret:
                break

            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = face_mesh.process(rgb)

            if results.multi_face_landmarks:
                blink_count += 1

    cap.release()

    return blink_count
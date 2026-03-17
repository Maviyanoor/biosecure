# BioSecure Backend — Complete Explanation
### For Final Year Project Viva Preparation

---

## SECTION 1: WHAT WE BUILT

### What is the Backend?

The backend is the server-side brain of BioSecure. It is a REST API built with Python. The frontend (Next.js) sends requests to this backend, the backend processes them, runs the deepfake detection logic, talks to the database, and sends back results. The user never directly touches the backend — everything goes through API endpoints.

---

### What Each File Does

#### `main.py` — The Entry Point
This is the first file that runs when you start the server. It creates the FastAPI application, sets up CORS (so the frontend on port 3000 can talk to the backend on port 8000), and connects all the route files together.

#### `requirements.txt` — Dependencies List
Lists all Python packages needed. Run `pip install -r requirements.txt` to install everything at once.

#### `.env` — Environment Variables
Stores secret configuration like database passwords, API keys, and service URLs. These are NEVER hardcoded in the source code.

#### `app/celery_app.py` — Background Task Manager
Creates and configures the Celery instance. Celery handles background jobs — when a user uploads a video, we don't make them wait. We put the analysis job in a queue and respond immediately with a task ID.

---

#### Routes Folder (`app/routes/`)

**`detection.py`** — Handles all media upload and analysis endpoints:
- `POST /api/detection/video` — accepts a video file upload
- `POST /api/detection/image` — accepts an image file upload
- `POST /api/detection/url` — accepts a URL to analyze
- `GET /api/detection/{task_id}` — checks the status/result of an analysis job

**`chat.py`** — Handles the AI chatbot:
- `POST /api/chat` — accepts a user message and returns a BioSecure AI reply
- Also stores conversation history in memory per session

**`stats.py`** — Handles platform-wide statistics:
- `GET /api/stats` — returns total analyses done, how many were FAKE/REAL/SUSPICIOUS

---

#### Services Folder (`app/services/`)

**`detection_service.py`** — The main detection logic. Currently returns mock results (because real AI models are connected in the next phase). Contains `run_mock_detection()` which builds a complete `DetectionResult` with hardcoded values. Also contains the verdict logic:
- confidence < 40 → REAL
- confidence 40–69 → SUSPICIOUS
- confidence ≥ 70 → FAKE
- severity_score = confidence / 10 (gives a 0–10 scale)

**`ensemble_service.py`** — Placeholder for model fusion logic. In the AI phase, this will combine results from multiple deepfake detection models (e.g., EfficientNet + Xception) and return a weighted average confidence score.

**`bio_signal_service.py`** — Placeholder for biological signal analysis. Will use MediaPipe to detect blink rate and rPPG (remote photoplethysmography) to estimate heart rate from face video.

**`gradcam_service.py`** — Placeholder for Grad-CAM heatmap generation. Will create visual explanations showing which regions of the face triggered the "FAKE" verdict.

**`chat_service.py`** — The working Groq chatbot integration. Uses the OpenAI SDK but points it at Groq's API endpoint. Sends the detection results plus conversation history to the Llama 3.3 model and returns a professional AI reply.

---

#### Models Folder (`app/models/`)

**`schemas.py`** — Pydantic data models. These define the exact shape of data going in and out of the API. If the frontend sends wrong data, Pydantic automatically rejects it. Key schemas:
- `DetectionResult` — the full analysis result (the frontend depends on this exact shape)
- `DeepfakeType` — breakdown of fake probability by type (face_swap, lip_sync, etc.)
- `BioSignals` — blink rate, rPPG heart rate, micro-expression status
- `Explainability` — human-readable reason + list of key features detected
- `FrameResult` — per-frame analysis result
- `ChatRequest` / `ChatResponse` — chatbot message format
- `StatsResponse` — platform statistics format

**`db_models.py`** — SQLAlchemy database table definitions:
- `VideoAnalysis` — one row per analysis job (task_id, verdict, confidence, severity, timestamps)
- `FrameAnalysis` — one row per video frame analyzed (linked to VideoAnalysis by foreign key)
- `ChatConversation` — one row per chatbot message (session_id, role, message, timestamp)
- `GlobalStats` — one row with running totals of all analyses ever done

---

#### Utils Folder (`app/utils/`)

**`db.py`** — Database connection setup. Creates the async SQLAlchemy engine using the DATABASE_URL from `.env`. Provides `get_db()` which is a dependency injected into routes that need database access.

**`face_extractor.py`** — Placeholder for MediaPipe face cropping. Will detect faces in images/frames and return a cropped face region for the detection models.

**`video_processor.py`** — Placeholder for FFmpeg-based frame extraction. Will split a video file into individual frames at regular intervals for analysis.

---

#### Tasks Folder (`app/tasks/`)

**`detection_task.py`** — The Celery background task. When a user uploads media, this task is queued. It calls `run_mock_detection()` and stores the result in Redis so the frontend can poll for it.

---

## SECTION 2: WHY WE BUILT IT THIS WAY

### Why FastAPI (not Flask or Django)?

FastAPI was chosen for three reasons:
1. **Speed** — FastAPI is one of the fastest Python frameworks. It uses async/await natively, meaning it can handle many requests at the same time without blocking.
2. **Automatic docs** — FastAPI auto-generates interactive API documentation at `/docs` using qSwagger UI. This makes testing endpoints easy during development.
3. **Pydantic validation** — FastAPI is built on Pydantic, so all request and response data is automatically validated and typed. This catches errors early.

Flask is simpler but has no async support and no auto-validation. Django is too heavy — it includes an ORM, templating, admin panel, and many things we don't need.

### Why Celery + Redis (not just running detection directly)?

Deepfake detection on a video can take 30–60 seconds. If we run it directly in the API request, the HTTP connection would time out and the user would get an error.

Instead:
1. User uploads video → backend immediately returns a `task_id` (response in under 1 second)
2. Celery runs the detection in the background
3. User's frontend polls `GET /api/detection/{task_id}` every few seconds
4. When done, Celery stores the result in Redis
5. The polling endpoint reads from Redis and returns the full result

This is called the **async task pattern**. It's used by professional applications like Uber, Instagram, and YouTube for heavy processing jobs.

Redis acts as both the **message broker** (sends jobs from FastAPI to Celery) and the **result backend** (stores completed job results).

### Why PostgreSQL (not MySQL or SQLite)?

- PostgreSQL is the most advanced open-source relational database.
- It supports async queries through `asyncpg`, which works with our async FastAPI setup.
- It handles concurrent writes better than MySQL, important for a platform with many simultaneous users.
- SQLite is fine for small apps but not suitable for production — it cannot handle concurrent writes from multiple workers.

### Why SQLAlchemy (not raw SQL)?

SQLAlchemy is an ORM (Object Relational Mapper). It lets us write Python classes instead of raw SQL queries. Benefits:
- Tables are defined as Python classes — easy to read and maintain
- Prevents SQL injection attacks automatically
- Supports async operations with `asyncpg`
- Database migrations are managed through Alembic (SQLAlchemy's companion tool)

### Why Pydantic v2?

Pydantic validates data automatically. If a route expects a `confidence: float` but receives a string, it rejects the request with a clear error message. This is critical for an API that the frontend depends on. Version 2 is significantly faster than version 1.

### Why MinIO (not AWS S3)?

MinIO is an open-source, self-hosted object storage system that uses the same API as Amazon S3. We use it to store uploaded videos, images, and generated heatmap images. Benefits:
- Free and runs locally during development
- S3-compatible — if we deploy to cloud later, we switch to S3 with minimal code changes
- Better than storing files directly on disk (which doesn't scale)

### Why MediaPipe (not Dlib or OpenCV alone)?

MediaPipe is Google's framework for face detection and landmark tracking. It is:
- Faster and more accurate than Dlib for face detection
- Maintained actively by Google
- Works well with Python and runs on CPU without requiring a GPU
- Provides face mesh landmarks needed for blink detection and expression analysis

Dlib was excluded by project rules because MediaPipe is more modern and better supported.

### Why OpenAI SDK pointed at Groq?

Groq provides a free, extremely fast inference API for large language models. The OpenAI SDK is the industry-standard way to call LLM APIs — Groq made their API compatible with the OpenAI format.

By using `base_url="https://api.groq.com/openai/v1"`, we get:
- Free API access during development
- The Llama 3.3 70B model — very capable for explaining deepfake results
- Easy future switch to real OpenAI if needed (just change `base_url` and `api_key`)

### Why PyTorch (not TensorFlow)?

PyTorch is the dominant framework in academic AI research. Most pre-trained deepfake detection models (XceptionNet, EfficientNet-B4, CLIP-based detectors) are released in PyTorch. TensorFlow was excluded by project rules, and PyTorch has better model ecosystem support for our use case.

---

## SECTION 3: HOW IT WORKS — COMPLETE STEP BY STEP FLOW

### Flow 1: User Uploads a Video for Analysis

```
Step 1: User opens BioSecure frontend and uploads a video file.

Step 2: Frontend sends HTTP POST to http://localhost:8000/api/detection/video
        with the file as multipart/form-data.

Step 3: detection.py route receives the request.
        - Validates that the file is a video (content_type starts with "video/")
        - Generates a unique task_id using uuid.uuid4()
        - Calls run_detection_task.delay(task_id) — this sends the job to Redis

Step 4: The route immediately returns:
        { "task_id": "abc-123", "status": "processing" }
        (This happens in under 1 second — the user is not blocked)

Step 5: Celery worker (running separately) picks up the job from Redis.
        - Calls run_mock_detection(task_id) in detection_service.py
        - Builds a full DetectionResult with verdict, confidence, bio signals, etc.
        - Returns the result dict — Celery stores it in Redis under the task_id

Step 6: Frontend polls GET /api/detection/abc-123 every 3 seconds.

Step 7: detection.py route checks Celery's AsyncResult for that task_id.
        - If state is PENDING → returns 404
        - If state is STARTED → returns status="processing"
        - If state is SUCCESS → returns the full DetectionResult
        - If state is FAILURE → returns 500 error

Step 8: Frontend receives the completed DetectionResult and displays the analysis.
```

### Flow 2: User Sends a Chat Message

```
Step 1: User types a question in the BioSecure AI chatbot panel.
        Frontend sends POST /api/chat with:
        { "session_id": "sess-xyz", "message": "What does FAKE mean?",
          "detection_results": { ...the analysis results... } }

Step 2: chat.py route receives the request.
        - Validates the message is not empty
        - Loads conversation history for this session_id from memory

Step 3: Calls get_chat_response() in chat_service.py.
        - Builds a messages array: system prompt + detection context + history + new message
        - Calls Groq's API via the OpenAI SDK
        - Groq runs Llama 3.3 70B and returns a response

Step 4: chat.py appends the user message and AI reply to session history.
        Returns: { "session_id": "sess-xyz", "reply": "Your video shows..." }

Step 5: Frontend displays the AI reply in the chat panel.
```

### Flow 3: Frontend Loads Platform Stats

```
Step 1: Frontend loads and calls GET /api/stats.

Step 2: stats.py route uses get_db() to get a database session.
        Queries the GlobalStats table for row with id=1.

Step 3: If the row exists, returns the counts.
        If no row exists yet, returns all zeros.

Step 4: Frontend displays total analyses, fake count, real count, suspicious count.
```

---

## SECTION 4: WHERE DOES DATA COME FROM

### Current Phase (Mock Data)

Right now, the backend returns hardcoded mock detection results. There are no real AI models connected yet. The `run_mock_detection()` function in `detection_service.py` always returns:
- confidence: 85.5
- verdict: FAKE
- face_swap probability: 0.8
- blink_status: suspicious

This is intentional. The backend infrastructure (routes, database, Celery, chatbot) is fully built and tested. The AI models will be plugged into `detection_service.py` in the next phase without changing anything else.

### Future Phase (Real AI Models)

When real models are connected, data will flow like this:

**For Face Detection:**
- `face_extractor.py` will use MediaPipe to detect the face region in each frame
- Returns a cropped face image as a NumPy array

**For Deepfake Detection:**
- Pre-trained models (EfficientNet-B4, XceptionNet, or similar) will process the cropped face
- These models were trained on datasets like:
  - **FaceForensics++** — 1000 original videos + manipulated versions using 4 manipulation methods
  - **Celeb-DF** — high-quality celebrity deepfakes
  - **DFDC (DeepFake Detection Challenge)** — dataset released by Facebook with 100,000+ videos

**For Bio-Signals:**
- `bio_signal_service.py` will use MediaPipe face mesh to track eye landmarks → calculate blink rate
- rPPG (remote photoplethysmography): analyzes subtle color changes in the face skin over time to estimate heart rate. Real faces have a pulse signal; deepfakes do not.

**For Heatmaps:**
- `gradcam_service.py` will use Grad-CAM (Gradient-weighted Class Activation Mapping) to generate a visual overlay showing which pixels most influenced the "FAKE" decision.

**For Video Frames:**
- `video_processor.py` will use FFmpeg to extract frames at 1 fps or every N milliseconds

**Database Storage:**
- Every completed analysis is saved to `video_analysis` and `frame_analysis` tables in PostgreSQL
- Chat messages are saved to `chat_conversations`
- The `global_stats` row is updated after each analysis

**File Storage:**
- Uploaded videos and images are stored in MinIO (object storage)
- Generated heatmap images are saved to MinIO and the URL is stored in the database

---

## SECTION 5: HOW EACH FILE CONNECTS

```
main.py
  │
  ├── imports app.routes.detection  ──►  detection.py
  │                                          │
  │                                          ├── imports DetectionResult from schemas.py
  │                                          ├── imports run_detection_task from detection_task.py
  │                                          │         │
  │                                          │         └── imports celery from celery_app.py
  │                                          │             imports run_mock_detection from detection_service.py
  │                                          │                       │
  │                                          │                       └── imports DetectionResult, DeepfakeType,
  │                                          │                           BioSignals, Explainability, FrameResult
  │                                          │                           from schemas.py
  │                                          │
  │                                          └── uses get_db() from db.py (for future DB writes)
  │
  ├── imports app.routes.chat  ──►  chat.py
  │                                    │
  │                                    ├── imports ChatRequest, ChatResponse from schemas.py
  │                                    └── imports get_chat_response from chat_service.py
  │                                               │
  │                                               └── uses OpenAI SDK → Groq API → Llama 3.3
  │
  └── imports app.routes.stats  ──►  stats.py
                                         │
                                         ├── imports StatsResponse from schemas.py
                                         ├── imports GlobalStats from db_models.py
                                         └── imports get_db from db.py
                                                    │
                                                    └── connects to PostgreSQL via DATABASE_URL
                                                        (defined in .env, loaded by python-dotenv)
```

### Dependency Injection Chain (FastAPI)

FastAPI's `Depends()` system is used for the database session:
```
stats.py route function
  └── parameter: db: AsyncSession = Depends(get_db)
                                              │
                                              └── get_db() opens a database session
                                                  yields it to the route function
                                                  closes it when the function finishes
```

This pattern ensures database connections are always properly opened and closed, even if an error occurs.

---

## SECTION 6: WHY I USED THESE TECHNOLOGIES IN MY FYP

### Why FastAPI for Deepfake Detection?

Deepfake detection involves heavy computation (neural network inference, video processing). FastAPI's async support means we can handle multiple uploads simultaneously. While one video is being analyzed in the background, the server can accept more uploads from other users without freezing.

### Why Celery for Deepfake Detection?

Real deepfake detection on a 30-second video can take 20–90 seconds. Web HTTP requests time out after 30 seconds. Without Celery, every long analysis would fail with a timeout error. Celery solves this by moving the work out of the HTTP request cycle into a background worker queue.

### Why PostgreSQL for Deepfake Detection?

We need to store:
- Analysis results with multiple fields (confidence, verdict, severity, timestamps)
- Frame-by-frame results with foreign key relationships
- Chat conversation history
- Platform-wide statistics

This is relational data — PostgreSQL is the correct choice. We also need concurrent reads (many users checking their results at the same time), which PostgreSQL handles well.

### Why MediaPipe for Bio-Signal Analysis?

Blink analysis and rPPG are based on precise face landmark positions over time. MediaPipe provides 468 face landmarks per frame with high accuracy and runs in real-time on CPU. This is essential for detecting whether a face is behaving like a real human (natural blink patterns, pulse signal) or a synthetic deepfake (irregular or absent biological signals).

### Why Grad-CAM for Explainability?

Deepfake detection models are neural networks — black boxes. A detection system that just says "this is FAKE" without explanation is not trustworthy or useful. Grad-CAM generates a heatmap overlaid on the face showing exactly which regions (eye area, mouth boundaries, skin texture) triggered the FAKE verdict. This is called **Explainable AI (XAI)** and is a strong research contribution for an FYP.

### Why Groq/Llama for the Chatbot?

An AI chatbot that can explain complex analysis results in plain English adds significant user value. Llama 3.3 70B is a powerful open-weight model that understands technical content. Using Groq's inference API gives us:
- Free usage during development/demo
- Very fast response (Groq's hardware is optimized for LLM inference)
- No need to run a GPU server for the chatbot component

### Why MinIO for File Storage?

Videos and heatmaps cannot be stored in a PostgreSQL database (too large, wrong data type). MinIO provides proper object storage with:
- HTTP URLs for each stored file (so the frontend can display heatmap images directly)
- Scalable storage that can handle large video files
- Local development without cloud costs

---

## SECTION 7: VIVA QUESTIONS AND ANSWERS

**Q1. What is the overall architecture of your backend?**

The backend follows a three-tier architecture. The first tier is the API layer — FastAPI handles HTTP requests and routes them to the correct handler. The second tier is the service/business logic layer — detection, chatbot, and stats logic live here. The third tier is the data layer — PostgreSQL stores persistent data, Redis stores temporary task results and job queues, and MinIO stores uploaded files and generated images.

---

**Q2. Why did you choose FastAPI over Flask or Django?**

FastAPI supports async/await natively, which is important because our detection tasks are I/O-heavy. It auto-generates Swagger documentation so I can test every endpoint interactively. It uses Pydantic for automatic data validation, which catches bugs early. Flask doesn't support async and has no built-in validation. Django is too heavyweight for a pure REST API — it includes a templating engine, admin panel, and many features we don't need.

---

**Q3. What is Celery and why do you need it?**

Celery is a distributed task queue system. When a user uploads a video for deepfake analysis, the analysis can take 30–90 seconds. If we run it directly in the HTTP request, the connection times out. Instead, we queue the job using Celery — the API immediately returns a task_id, and Celery runs the analysis in a background worker. The frontend polls the result endpoint every few seconds until the task completes.

---

**Q4. What role does Redis play in your system?**

Redis plays two roles. First, it acts as the message broker — it receives job messages from FastAPI and delivers them to Celery workers. Second, it acts as the result backend — Celery stores completed task results in Redis with the task_id as the key. When the frontend polls for results, FastAPI reads from Redis to return the completed analysis.

---

**Q5. What is Pydantic and why is it important?**

Pydantic is a data validation library. In our project, all request and response data is defined as Pydantic models. When the frontend sends a request, FastAPI automatically validates it against the model — if a required field is missing or has the wrong type, the request is rejected with a clear error message before any code runs. This prevents bad data from reaching our services or database. It also ensures the API always returns data in exactly the format the frontend expects.

---

**Q6. What is the DetectionResult schema and why is it fixed?**

DetectionResult is the Pydantic model that defines the exact JSON structure returned after every deepfake analysis. It contains: task_id, status, verdict (REAL/FAKE/SUSPICIOUS), confidence (0–100), severity_score (0–10), deepfake_type breakdown, bio_signals, explainability, frame results, heatmap URL, and processing time. It is fixed because the frontend code is already written to read from this exact structure. If we change a field name or type, the frontend breaks.

---

**Q7. How does your deepfake verdict logic work?**

The detection model returns a confidence score between 0 and 100 representing the probability that the media is a deepfake. We then apply threshold logic:
- confidence below 40 → REAL (low probability of being fake)
- confidence between 40 and 69 → SUSPICIOUS (uncertain, needs further review)
- confidence 70 and above → FAKE (high probability of manipulation)

The severity score is simply confidence divided by 10, giving a 0–10 scale for how serious the detected manipulation is.

---

**Q8. What are Bio-Signals and why are they useful for deepfake detection?**

Bio-signals are biological indicators extracted from the face video. We analyze two types. First, blink rate — real humans blink 12–20 times per minute in a natural pattern. Early deepfakes had irregular or absent blinking because training data lacked blink examples. Second, rPPG (remote photoplethysmography) — this detects the subtle color changes in facial skin caused by blood flow with each heartbeat. A real face has a detectable pulse signal in the video. Synthetic deepfake faces typically do not. These signals add an extra layer of detection that works even when visual artifacts are not obvious.

---

**Q9. What is Grad-CAM and why did you include it?**

Grad-CAM stands for Gradient-weighted Class Activation Mapping. It is a technique to explain neural network decisions visually. We compute the gradient of the FAKE prediction score with respect to the last convolutional layer's feature maps, then create a heatmap showing which spatial regions influenced the decision most. Overlaid on the face, it shows the user exactly which area (mouth boundary, eye region, skin texture) triggered the FAKE verdict. This is Explainable AI — it makes the system transparent and trustworthy rather than just a black box.

---

**Q10. How does your chatbot work technically?**

The chatbot uses the OpenAI Python SDK but points it at Groq's API endpoint (`https://api.groq.com/openai/v1`). Groq provides fast, free inference for the Llama 3.3 70B model. When the user sends a message, we build a message array containing: a system prompt that establishes the BioSecure AI persona, the current detection results as context, the full conversation history for this session, and the new user message. This is sent to the model, which returns a professional explanation. The conversation history is stored in memory per session_id so the chatbot can reference earlier messages.

---

**Q11. How do you handle file uploads and storage?**

Files are uploaded as multipart/form-data using FastAPI's `UploadFile`. The route validates the content type (must start with "video/" or "image/"). In the current mock phase, the file bytes are not processed further. In the full implementation, the file is uploaded to MinIO (our object storage), which returns a URL. That URL is stored in the database and passed to the detection pipeline so the Celery worker can download the file for processing.

---

**Q12. How does your database schema support the detection workflow?**

The schema has four tables. `video_analysis` stores one record per detection job with the overall result — task_id, verdict, confidence, severity, timestamps. `frame_analysis` stores one record per analyzed video frame with its individual verdict and heatmap URL, linked to `video_analysis` by foreign key. `chat_conversations` stores every chatbot message with its session_id, role (user or assistant), and timestamp. `global_stats` has a single row with running totals used for the platform statistics dashboard.

---

**Q13. What is async/await in Python and why did you use it?**

Async/await is a programming pattern for non-blocking I/O operations. In a normal (synchronous) program, when you make a database query the entire thread waits until the query finishes. With async/await, the program can switch to handling another request while waiting for the database. This means our single FastAPI server can handle dozens of concurrent requests without needing dozens of threads. We use `asyncpg` for async database connections and SQLAlchemy's async session for all database operations.

---

**Q14. What security measures are in place in the backend?**

First, all secrets (database password, API keys) are stored in environment variables loaded from `.env` — never hardcoded. Second, CORS is configured to only allow requests from `http://localhost:3000` — requests from other origins are blocked. Third, Pydantic validates all incoming data, preventing bad inputs from reaching the database or services. Fourth, file uploads are validated by content type before processing. Fifth, SQLAlchemy ORM prevents SQL injection by using parameterized queries. In production, HTTPS would be added and the CORS origin would be updated to the real domain.

---

**Q15. What is the current state of the AI models and what is the next step?**

Currently, the AI models are not connected. The `detection_service.py` returns a hardcoded mock result with a fixed confidence of 85.5 and verdict of FAKE. This is intentional — it allowed us to build and test the complete backend infrastructure (routing, async tasks, database, chatbot, file storage) without needing working models.

The next step is to plug in real pre-trained models. The `face_extractor.py` will be implemented using MediaPipe to crop the face region. The `video_processor.py` will extract frames using FFmpeg. The `detection_service.py` will load a pre-trained EfficientNet-B4 or XceptionNet model, run inference on the cropped face frames, and return real confidence scores. The `ensemble_service.py` will combine predictions from multiple models for higher accuracy. The `bio_signal_service.py` and `gradcam_service.py` will be implemented last. Nothing else in the backend needs to change — the infrastructure is already in place.

---

*File: backend/BACKEND_EXPLANATION.md — Created for BioSecure FYP Viva Preparation*

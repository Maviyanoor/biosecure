from app.models.schemas import (
    DetectionResult, DeepfakeType, BioSignals,
    Explainability, FrameResult
)


def get_verdict(confidence: float) -> str:
    if confidence < 40:
        return "REAL"
    elif confidence < 70:
        return "SUSPICIOUS"
    else:
        return "FAKE"


def get_severity_score(confidence: float) -> float:
    return round(confidence / 10, 1)


def run_mock_detection(task_id: str) -> dict:
    confidence = 85.5
    verdict = get_verdict(confidence)
    severity = get_severity_score(confidence)

    result = DetectionResult(
        task_id=task_id,
        status="complete",
        verdict=verdict,
        confidence=confidence,
        severity_score=severity,
        deepfake_type=DeepfakeType(
            face_swap=0.8,
            lip_sync=0.6,
            expression_manipulation=0.4,
            temporal_inconsistency=0.7,
        ),
        bio_signals=BioSignals(
            blink_rate=12.0,
            blink_status="suspicious",
            micro_expression_status="inconsistent",
            rppg_bpm=72.0,
            rppg_status="unavailable",
        ),
        explainability=Explainability(
            reason="High probability of face swap detected based on facial boundary inconsistencies.",
            key_features=[
                "facial boundary artifacts",
                "unnatural blinking",
                "skin texture mismatch",
            ],
        ),
        frames=[
            FrameResult(
                frame_number=1,
                timestamp_ms=0.0,
                confidence=85.5,
                verdict="FAKE",
                heatmap_url="",
            )
        ],
        heatmap_url="",
        processing_time_ms=1500.0,
    )

    return result.model_dump()

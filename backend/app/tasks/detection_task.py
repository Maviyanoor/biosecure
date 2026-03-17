from app.celery_app import celery
from app.services.detection_service import run_mock_detection


@celery.task(bind=True, name="detection_task")
def run_detection_task(self, task_id: str) -> dict:
    self.update_state(state="STARTED", meta={"task_id": task_id, "status": "processing"})
    result = run_mock_detection(task_id)
    return result
